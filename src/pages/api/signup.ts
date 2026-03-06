import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import initFirebaseAdmin from '../../../lib/firebaseAdmin'; // Ensure you create this file to initialize Firebase Admin SDK
import { z } from 'zod';

// Initialize Firebase Admin
initFirebaseAdmin();

interface AuthedRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function signup(req: AuthedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = signupSchema.parse(req.body);

    const userRecord = await getAuth().createUser({
      email,
      password,
    });

    return res.status(201).json({ uid: userRecord.uid, email: userRecord.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err instanceof Error ? err.message : String(err) });
  }
}