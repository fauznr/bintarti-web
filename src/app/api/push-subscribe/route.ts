import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabase";

export async function POST(request: Request) {
  try {
    const { subscription } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription object" }, { status: 400 });
    }

    // Insert or update the subscription based on endpoint
    // We assume the user creates the table push_subscriptions with a unique constraint on 'endpoint'
    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert(
        { 
          endpoint: subscription.endpoint,
          subscription: subscription
        },
        { onConflict: 'endpoint' }
      )
      .select();

    if (error) {
      console.error("Supabase insert error for push subscription:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Subscription saved successfully." });
  } catch (error: any) {
    console.error("Error in push-subscribe API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
