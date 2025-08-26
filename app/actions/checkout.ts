"use server";

import { currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { availablePlans, type Plan } from "@/lib/plans";

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL;

export async function createCheckoutSession(planChoice: Plan["id"]) {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "You must be logged in to subscribe",
    };
  }

  try {
    const selectedPlan = availablePlans.find(plan => plan.id === planChoice);
    
    if (!selectedPlan) {
      throw new Error("Invalid plan selected");
    }

    const priceId = selectedPlan.priceId;

    if (!priceId) {
      throw new Error("Price ID not configured");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${DOMAIN}/select`,
      cancel_url: `${DOMAIN}/subscribe`,
      customer_email:
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        planType: planChoice,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planType: planChoice,
        },
      },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    return {
      success: true,
      url: session.url,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      success: false,
      error: "Failed to create checkout session. Please try again.",
    };
  }
}
