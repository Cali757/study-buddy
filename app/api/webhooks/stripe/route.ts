import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { setUserPro } from '@/lib/firestore';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
  : null;

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.error('[STRIPE WEBHOOK] Configuration error: Missing Stripe secret or webhook secret');
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }
  
  console.log('[STRIPE WEBHOOK] Received webhook request');

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[STRIPE WEBHOOK] Error: No signature provided in request headers');
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`[STRIPE WEBHOOK] Successfully verified webhook signature for event type: ${event.type}`);
  } catch (err: any) {
    console.error('[STRIPE WEBHOOK] FAILURE: Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;

        if (userId && session.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Update user subscription in Firestore
          await setUserPro(
            userId,
            true,
            session.customer as string,
            subscription.id
          );

          console.log(`[STRIPE WEBHOOK] SUCCESS: User ${userId} upgraded to Pro (subscription: ${subscription.id})`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get customer to find userId from metadata
        const customer = await stripe.customers.retrieve(customerId);
        const userId = (customer as Stripe.Customer).metadata?.userId;

        if (userId) {
          const isActive = subscription.status === 'active';
          
          // Update user subscription status in Firestore
          await setUserPro(
            userId,
            isActive,
            customerId,
            subscription.id
          );

          console.log(`[STRIPE WEBHOOK] SUCCESS: Subscription ${subscription.id} updated to status: ${subscription.status} for user ${userId}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get customer to find userId
        const customer = await stripe.customers.retrieve(customerId);
        const userId = (customer as Stripe.Customer).metadata?.userId;

        if (userId) {
          // Set user to free plan
          await setUserPro(userId, false, customerId, subscription.id);
          console.log(`[STRIPE WEBHOOK] SUCCESS: Subscription ${subscription.id} canceled for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
    }

    console.log(`[STRIPE WEBHOOK] SUCCESS: Webhook processed successfully for event ${event.id}`);
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[STRIPE WEBHOOK] FAILURE: Error processing webhook:', error.message || error);
    console.error('[STRIPE WEBHOOK] Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

