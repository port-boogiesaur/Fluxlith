import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

console.log('ACTUAL CONFIG RUNNING:', firebaseConfig);
console.log('FIRESTORE DATABASE ID:', firebaseConfig.firestoreDatabaseId);

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
