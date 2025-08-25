import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

type ClerkWebhookEvent = {
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
    first_name?: string;
    last_name?: string;
  };
  type: string;
};

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { data, type } = evt;

  switch (type) {
    case "user.created": {
      const { id: clerkId, email_addresses, first_name, last_name } = data;
      const email = email_addresses[0]?.email_address;
      const name =
        first_name && last_name
          ? `${first_name} ${last_name}`
          : first_name || last_name;

      if (!email) {
        console.error("No email found for user:", clerkId);
        return NextResponse.json({ error: "No email found" }, { status: 400 });
      }
      try {
        await prisma.user.create({
          data: {
            clerk_id: clerkId,
            email,
            name,
          },
        });

        console.log(`User created: ${email} (${clerkId})`);
        return NextResponse.json({ message: "User created successfully" });
      } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
    }

    case "user.updated": {
      const { id: clerkId, email_addresses, first_name, last_name } = data;
      const email = email_addresses[0]?.email_address;
      const name =
        first_name && last_name
          ? `${first_name} ${last_name}`
          : first_name || last_name;

      if (!email) {
        console.error("No email found for user:", clerkId);
        return NextResponse.json({ error: "No email found" }, { status: 400 });
      }
      try {
        await prisma.user.update({
          where: { clerk_id: clerkId },
          data: {
            email,
            name,
          },
        });

        console.log(`User updated: ${email} (${clerkId})`);
        return NextResponse.json({ message: "User updated successfully" });
      } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }
    }

    case "user.deleted": {
      const { id: clerkId } = data;

      try {
        await prisma.user.delete({
          where: { clerk_id: clerkId },
        });

        console.log(`User deleted: ${clerkId}`);
        return NextResponse.json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
          { error: "Failed to delete user" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ message: "Webhook processed" });
}
