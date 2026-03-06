import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { addDoc, collection } from 'firebase/firestore';
import { createTransport } from 'nodemailer';
import rateLimit from 'async-ratelimit';

const rateLimiter = rateLimit({ max: 5, per: 60000 }); // 5 requests per minute

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(firebaseAdminConfig),
});

const db = getFirestore();
const mailTransporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface AuthedRequest extends NextApiRequest {
  user?: { uid: string; email: string };
}

const runTest = async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await rateLimiter.get();

    const { testData } = req.body;

    if (!testData) {
      return res.status(400).json({ message: 'Missing test data' });
    }

    const testResults = await executeTest(testData); // Assume executeTest is a defined function

    const docRef = await addDoc(collection(db, 'testResults'), {
      uid: req.user?.uid,
      results: testResults,
      createdAt: new Date(),
    });

    await mailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.user?.email,
      subject: 'Test Run Alert',
      text: `Test run completed. Results: ${JSON.stringify(testResults)}`,
    });

    res.status(201).json({ id: docRef.id, results: testResults });
  } catch (err) {
    res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
};

export default runTest;