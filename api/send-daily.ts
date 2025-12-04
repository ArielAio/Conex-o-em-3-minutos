// Serverless function for Vercel to send daily mission emails using Resend.
// Requires env vars:
// RESEND_API_KEY (from resend.com)
// FROM_EMAIL (ex: Conexao <damegeex@gmail.com> or domínio verificado no Resend)
// FIREBASE_SERVICE_ACCOUNT (JSON string of service account)
// CRON_SECRET (shared secret for Vercel Cron call)

import admin from 'firebase-admin';

// Init Firebase Admin once
if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT');
  }
  const serviceAccount = JSON.parse(serviceAccountJson);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const sendEmail = async (to: string, subject: string, text: string) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error('Missing RESEND_API_KEY or FROM_EMAIL');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error: ${res.status} ${body}`);
  }
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretHeader = req.headers['x-cron-secret'];
  const secretQuery = (req.query?.secret as string) || '';
  const provided = secretHeader || secretQuery;
  if (!provided || provided !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const snap = await db.collection('users').get();
    const emails = new Set<string>();
    snap.forEach((doc) => {
      const data = doc.data() as { email?: string };
      if (data.email) emails.add(data.email);
    });

    const subject = 'Sua missão do dia - Conexão em 3 Minutos';
    const text =
      'Ei! Não perca sua ofensiva: faça a missão de hoje em 3 minutos.\n\nAcesse: https://conexao-em-3-minutos.vercel.app\n\nEstamos juntos!';

    const results: { sent: string[]; errors: string[] } = { sent: [], errors: [] };

    for (const email of emails) {
      try {
        await sendEmail(email, subject, text);
        results.sent.push(email);
      } catch (err: any) {
        results.errors.push(`${email}: ${err?.message || err}`);
      }
    }

    return res.status(200).json({ total: emails.size, ...results });
  } catch (error: any) {
    console.error('send-daily error', error);
    return res.status(500).json({ error: error?.message || 'Internal error' });
  }
}
