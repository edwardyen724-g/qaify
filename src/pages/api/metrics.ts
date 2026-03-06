import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

interface AuthedRequest extends NextApiRequest {
  user?: {
    uid: string;
  };
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const metricsHandler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const metricsRef = admin.firestore().collection('metrics');
    const snapshot = await metricsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No metrics found' });
    }

    const metrics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(metrics);
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default metricsHandler;