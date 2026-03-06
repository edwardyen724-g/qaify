import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});
const firestore = getFirestore();

interface AuthedRequest extends NextApiRequest {
  user?: {
    uid: string;
  };
}

initializeApp({
  credential: applicationDefault(),
});

export default async function manageSubscription(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user } = req;
  const { subscriptionId, action } = req.body;

  if (!user || !user.uid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    if (action === 'cancel') {
      await stripe.subscriptions.update(subscriptionId, {
        delete: true,
      });
      await firestore.collection('subscriptions').doc(subscriptionId).update({ status: 'canceled' });
      return res.status(200).json({ message: 'Subscription canceled successfully' });
    }

    if (action === 'update') {
      // Handle subscription updates here (e.g. change plan)
      return res.status(400).json({ error: 'Update action not implemented' });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
}