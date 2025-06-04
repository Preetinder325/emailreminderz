import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../firebase/firebaseConfig.json'; // ✅ Points to your downloaded service account JSON

const app = getApps().length === 0
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

export const db = getFirestore(app); // ✅ This gives you admin access to Firestore
