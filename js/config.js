// ==========================================
// FIREBASE CONFIGURATION PLACEHOLDERS
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyAxJKboC5i6sAJ9EZ6K0txiqojOYoPzcsE",
    authDomain: "yt-aimbot-exe--444-sensi-store.firebaseapp.com",
    databaseURL: "https://yt-aimbot-exe--444-sensi-store-default-rtdb.firebaseio.com",
    projectId: "yt-aimbot-exe--444-sensi-store",
    storageBucket: "yt-aimbot-exe--444-sensi-store.firebasestorage.app",
    messagingSenderId: "1040047256444",
    appId: "1:1040047256444:web:838f08043fda599d432af9",
    measurementId: "G-7YHNGNRS7M"
  };

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ==========================================
// IMAGEKIT CONFIGURATION PLACEHOLDERS
// ==========================================
const ImageKitConfig = {
    publicKey: "public_lFl7GM+C1yMGa8OTBxesRGnGfOE=",
    privateKey: "private_pSZR4BsMYUu5/FMH0NflEbL9Zv0=", // <-- ADD THIS
    urlEndpoint: "https://ik.imagekit.io/bauvs4atc",
    authenticationEndpoint: "http://localhost:3000/auth" // Server-side auth endpoint
};