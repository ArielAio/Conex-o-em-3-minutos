import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable.');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionId = req.query.session_id;
  if (!sessionId || Array.isArray(sessionId)) {
    return res.status(400).json({ error: 'session_id is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    const subscription = session.subscription as Stripe.Subscription | null;
    const status = subscription?.status || session.status;

    return res.status(200).json({
      sessionId: session.id,
      customer: typeof session.customer === 'string' ? session.customer : session.customer?.id,
      subscriptionId: subscription?.id,
      status,
      currentPeriodEnd: subscription?.current_period_end,
      cancelAtPeriodEnd: subscription?.cancel_at_period_end,
    });
  } catch (err) {
    console.error('Get checkout session error', err);
    return res.status(500).json({ error: 'Failed to retrieve checkout session' });
  }
}
