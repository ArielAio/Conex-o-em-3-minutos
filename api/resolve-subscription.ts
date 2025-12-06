import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable.');
}

const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' });

// Finds a subscription by customer email (best effort: picks most recent).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = req.query.email;
  if (!email || Array.isArray(email)) {
    return res.status(400).json({ error: 'email is required' });
  }

  try {
    // Find customer by email
    const customers = await stripe.customers.search({
      query: `email:'${email.replace(/'/g, '')}'`,
      limit: 5,
    });

    if (!customers.data.length) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get subscriptions for these customers and pick the most recent
    let latestSub: Stripe.Subscription | null = null;
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 5,
      });
      for (const sub of subs.data) {
        if (!latestSub || sub.created > latestSub.created) {
          latestSub = sub;
        }
      }
    }

    if (!latestSub) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    return res.status(200).json({
      id: latestSub.id,
      status: latestSub.status,
      current_period_end: latestSub.current_period_end,
      cancel_at_period_end: latestSub.cancel_at_period_end,
    });
  } catch (err: any) {
    console.error('Resolve subscription by email error', err);
    return res.status(500).json({ error: err?.message || 'Failed to resolve subscription' });
  }
}
