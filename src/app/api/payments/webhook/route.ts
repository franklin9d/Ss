import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { stripe } from '@/lib/stripe/config';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.subscription) {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as unknown as Record<string, unknown>;

          const items = stripeSubscription.items as { data: { price: { id: string } }[] };
          const periodStart = stripeSubscription.current_period_start as number;
          const periodEnd = stripeSubscription.current_period_end as number;

          await prisma.subscription.upsert({
            where: { userId },
            update: {
              stripeSubscriptionId: stripeSubscription.id as string,
              stripePriceId: items.data[0].price.id,
              status: 'ACTIVE',
              currentPeriodStart: new Date(periodStart * 1000),
              currentPeriodEnd: new Date(periodEnd * 1000),
            },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: stripeSubscription.id as string,
              stripePriceId: items.data[0].price.id,
              status: 'ACTIVE',
              currentPeriodStart: new Date(periodStart * 1000),
              currentPeriodEnd: new Date(periodEnd * 1000),
            },
          });

          await prisma.user.update({
            where: { id: userId },
            data: { plan: 'PRO' },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subObj = event.data.object as unknown as Record<string, unknown>;
        const subId = subObj.id as string;
        const subStatus = subObj.status as string;
        const cancelAtEnd = subObj.cancel_at_period_end as boolean;
        const periodEnd = subObj.current_period_end as number;
        
        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subId },
        });

        if (dbSub) {
          const status = subStatus === 'active' ? 'ACTIVE' : 
                         subStatus === 'past_due' ? 'PAST_DUE' :
                         subStatus === 'canceled' ? 'CANCELED' : 'EXPIRED';

          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: {
              status,
              cancelAtPeriodEnd: cancelAtEnd,
              currentPeriodEnd: new Date(periodEnd * 1000),
            },
          });

          if (status !== 'ACTIVE') {
            await prisma.user.update({
              where: { id: dbSub.userId },
              data: { plan: 'FREE' },
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const delSubObj = event.data.object as unknown as Record<string, unknown>;
        const delSubId = delSubObj.id as string;
        
        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: delSubId },
        });

        if (dbSub) {
          await prisma.subscription.update({
            where: { id: dbSub.id },
            data: { status: 'CANCELED' },
          });

          await prisma.user.update({
            where: { id: dbSub.userId },
            data: { plan: 'FREE' },
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as unknown as Record<string, unknown>;
        const invSub = invoice.subscription as string;
        
        if (invSub) {
          const dbSub = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: invSub },
          });

          if (dbSub) {
            await prisma.payment.create({
              data: {
                subscriptionId: dbSub.id,
                stripePaymentId: invoice.payment_intent as string,
                amount: invoice.amount_paid as number,
                currency: (invoice.currency as string) || 'usd',
                status: 'succeeded',
              },
            });
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
