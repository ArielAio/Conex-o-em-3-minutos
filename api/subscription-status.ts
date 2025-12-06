import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable.');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' });

// Returns the latest subscription status by ID.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const subscriptionId = req.query.subscriptionId;

  if (!subscriptionId || Array.isArray(subscriptionId)) {
    return res.status(400).json({ error: 'subscriptionId is required' });
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return res.status(200).json({
      id: subscription.id,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
    });
  } catch (err: any) {
    console.error('Retrieve subscription error', err);
    return res.status(500).json({ error: err?.message || 'Failed to retrieve subscription' });
  }
}
