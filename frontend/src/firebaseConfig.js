// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDyi6qMjkxIn7R8NzD43IMh0cDob8FAG2g",
    authDomain: "flor-da-chapada.firebaseapp.com",
    projectId: "flor-da-chapada",
    storageBucket: "flor-da-chapada.appspot.com",
    messagingSenderId: "625989343713",
    appId: "1:625989343713:web:929e4ca23cde2a9a2f9aa0"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Obtenha a referência de autenticação
const auth = getAuth(app);

// Exporte a instância do auth
export { auth };
