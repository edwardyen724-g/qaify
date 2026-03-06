import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { collection, getDocs } from "firebase/firestore";
import { FirebaseOptions } from "firebase/app";
import { firestore } from '../../lib/firebase';
import Link from 'next/link';

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

interface Feedback {
    id: string;
    message: string;
    createdAt: string;
}

const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const feedbackCollection = collection(firestore, 'feedback');
                const feedbackSnapshot = await getDocs(feedbackCollection);
                const feedbackList = feedbackSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Feedback[];

                setFeedbacks(feedbackList);
            } catch (err) {
                console.error(err instanceof Error ? err.message : String(err));
            }
        };

        if (user) {
            fetchFeedbacks();
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <div>
                <h2>Please log in to access your dashboard.</h2>
                <Link href="/auth/login">Login</Link>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h1>Welcome to QAify, {user.email}</h1>
            <h2>Revolutionize Your AI Quality Assurance in Minutes!</h2>

            <section>
                <h3>Your Feedback</h3>
                {feedbacks.length > 0 ? (
                    <ul>
                        {feedbacks.map(feedback => (
                            <li key={feedback.id}>
                                <p>{feedback.message}</p>
                                <small>{new Date(feedback.createdAt).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No feedback available.</p>
                )}
            </section>

            <section>
                <h3>Explore Features</h3>
                <ul>
                    <li>Automated testing scripts generation for specific AI interactions</li>
                    <li>User-friendly interface for non-technical QA team members</li>
                    <li>Integration with popular AI platforms (e.g., Dialogflow, Rasa)</li>
                    <li>Real-time performance metrics and reports</li>
                    <li>Collaboration tools for feedback and issue tracking among team members</li>
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;