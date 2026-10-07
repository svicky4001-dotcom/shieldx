declare module "firebase/app" {
  export function initializeApp(config: Record<string, unknown>): any;
}

declare module "firebase/analytics" {
  export function getAnalytics(app: any): any;
}

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8vEMGOJhLZvejJIdGoAaSy4pVOSWysrs",
  authDomain: "shieldx-89938.firebaseapp.com",
  projectId: "shieldx-89938",
  storageBucket: "shieldx-89938.firebasestorage.app",
  messagingSenderId: "524368142644",
  appId: "1:524368142644:web:3d37326511d5c590b60561",
  measurementId: "G-MS0FQ8B3ZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, analytics };