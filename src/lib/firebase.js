import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAw0Ajto1Khy1-P8namr0Umi2grUZKJ7k8",
  authDomain: "friends-against-humanity.firebaseapp.com",
  databaseURL: "https://friends-against-humanity.firebaseio.com",
  projectId: "friends-against-humanity",
  storageBucket: "friends-against-humanity.appspot.com",
  messagingSenderId: "860466282867",
  appId: "1:860466282867:web:103660a5785b990e2a0506",
  measurementId: "G-6GHPB1D4N7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
