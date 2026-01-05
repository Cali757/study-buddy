import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2023-10-16' })
  : null;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    let customerId: string;
    try {
      // Try to find existing customer by userId in metadata
      const customers = await stripe.customers.list({
        limit: 100,
      });
      const existingCustomer = customers.data.find(
        (c) => c.metadata?.userId === userId
      );

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer with userId in metadata
        const customer = await stripe.customers.create({
          metadata: {
            userId,
          },
        });
        customerId = customer.id;
      }
    } catch (error) {
      console.error('Error managing customer:', error);
      // Fallback: create customer without lookup
      const customer = await stripe.customers.create({
        metadata: {
          userId,
        },
      });
      customerId = customer.id;
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pro Plan',
              description: 'Access to all Pro lessons and premium features',
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/checkout/cancel`,
      client_reference_id: userId,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

