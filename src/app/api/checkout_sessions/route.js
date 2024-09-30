import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(req) {
  // Extract search parameters using NextRequest
  const { searchParams } = new URL(req.url);
  const priceId = searchParams.get("priceId");

  // Check if priceId is provided
  if (!priceId) {
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  }

  try {
    // 2 months delay for the next payment
    const trialPeriodDays = 60;

    // Create Checkout Session for a subscription
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Use the provided recurring price ID
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/?success=true`,
      cancel_url: `${req.headers.get("origin")}/?canceled=true`,
      subscription_data: {
        trial_period_days: trialPeriodDays,
        metadata: { tag: "EA" },
      },
      automatic_tax: { enabled: true },
    });

    // Redirect to the checkout session URL
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    // Handle errors
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
