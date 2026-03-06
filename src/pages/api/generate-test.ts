import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const firebaseAdminConfig = {
  credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG || '{}'))
};

initializeApp(firebaseAdminConfig);

interface AuthedRequest extends NextApiRequest {
  uid?: string;
}

const rateLimit = new Map<string, number>();

const handler = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // Rate limiting
    if (userIp && rateLimit.has(userIp) && rateLimit.get(userIp)! >= 5) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    req.uid = decodedToken.uid;

    const { interactions } = req.body;
    if (!interactions || !Array.isArray(interactions)) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    // Insert logic for generating tests based on interactions here

    // Example of saving a generated test to Firestore
    const db = getFirestore();
    const testDocRef = db.collection('tests').doc();
    await testDocRef.set({
      uid: req.uid,
      interactions,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update rate limit
    if (userIp) {
      rateLimit.set(userIp, (rateLimit.get(userIp) || 0) + 1);
      setTimeout(() => rateLimit.set(userIp, (rateLimit.get(userIp) || 0) - 1), 60000);
    }

    return res.status(201).json({ message: 'Test generated successfully', testId: testDocRef.id });
  } catch (err) {
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default handler;