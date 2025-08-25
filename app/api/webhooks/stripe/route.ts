import { NextRequest, NextResponse } from "next/server";
import { Stripe, stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@/lib/generated/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId,
          {
            expand: ["items.data.price.product"],
          }
        )) as Stripe.Subscription;

        const priceId = subscription.items.data[0].price.id;
        const now = new Date(
          subscription.items.data[0].current_period_start * 1000
        ).toISOString();
        const end = new Date(
          subscription.items.data[0].current_period_end * 1000
        ).toISOString();

        const clerkUserId = session.metadata?.userId;

        if (!clerkUserId) {
          console.error(
            "Could not find clerk user ID for customer:",
            customerId
          );
          break;
        }

        // Find or create the user in our database
        const user = await prisma.user.findUnique({
          where: { clerk_id: clerkUserId },
        });

        if (!user) {
          console.error(
            "User not found in database for clerk_id:",
            clerkUserId
          );
          break;
        }

        console.log("upsert subscription: ", {
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: priceId,
          status: subscription.status,
          current_period_start: now,
          current_period_end: end,
          cancel_at_period_end: subscription.cancel_at_period_end || false,
        });

        await prisma.subscription.upsert({
          where: { user_id: user.id },
          update: {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            status: subscription.status as SubscriptionStatus,
            current_period_start: new Date(now),
            current_period_end: new Date(end),
            cancel_at_period_end: subscription.cancel_at_period_end || false,
          },
          create: {
            user_id: user.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            status: subscription.status as SubscriptionStatus,
            current_period_start: new Date(now),
            current_period_end: new Date(end),
            cancel_at_period_end: subscription.cancel_at_period_end || false,
          },
        });
        break;
      }

      default:
        break;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: `Webhook error: ${err.message}` },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
