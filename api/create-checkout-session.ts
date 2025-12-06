import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable.');
}

// Use the latest Stripe API version supported by the SDK types.
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-02-24.acacia' });
const trialDays = Number(process.env.TRIAL_DAYS || 0) || undefined;

// Creates a Checkout Session for a subscription and returns the redirect URL.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, customerEmail, allowTrial } = req.body || {};

  if (!priceId) {
    return res.status(400).json({ error: 'priceId is required' });
  }

  try {
    const appUrl = process.env.APP_URL || 'http://localhost:5173';
    const includeTrial = Boolean(allowTrial) && !!trialDays;
    // Envie o usuário de volta para a SPA via hash, evitando 404 em rotas que não existem no servidor.
    const successUrl = `${appUrl}/#/app?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/#/app?cancelled=1`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      subscription_data: includeTrial
        ? {
            trial_period_days: trialDays,
          }
        : undefined,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe create checkout error', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
