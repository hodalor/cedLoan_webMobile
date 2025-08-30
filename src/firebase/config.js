// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase config object - these values should be set in environment variables
const firebaseConfig = {
  apiKey: "AIzaSyC7bNVhzAkhN7H0QfcaN-zlPmLpcUx5xvg",
  authDomain: "quickmula.firebaseapp.com",
  projectId: "quickmula",
  storageBucket: "quickmula.firebasestorage.app",
  messagingSenderId: "423575236253",
  appId: "1:423575236253:web:d61c6f9120ca5a03dbae74"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
