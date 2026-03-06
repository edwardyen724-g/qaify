import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import axios from 'axios';
import { User } from '../types'; // Assume you have a User type defined in a types file

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);
const analytics = getAnalytics();

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(false);
      if (user) {
        setUser({ uid: user.uid, email: user.email });
        fetchDashboardData(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async (uid: string) => {
    try {
      const response = await axios.get(`/api/admin/dashboard/${uid}`);
      setData(response.data);
    } catch (error) {
      console.error(err instanceof Error ? err.message : String(err));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to access the admin dashboard.</div>;

  return (
    <div>
      <h1>Revolutionize Your AI Quality Assurance in Minutes!</h1>
      <h2>Welcome, {user.email}</h2>
      {data ? (
        <div>
          <h3>Performance Metrics</h3>
          {/* Render your performance metrics here */}
        </div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default AdminDashboard;