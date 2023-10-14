import React from "react";
import { auth, db } from "../firebase/config";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { generateKeywords } from "../firebase/services";

const Welcome = () => {
    const googleSignIn = async (event) => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        const { isNewUser } = getAdditionalUserInfo(result)
        // console.log(result.user);
        if (isNewUser) {
            await addDoc(collection(db, "users"), {
                createdAt: serverTimestamp(),
                displayName: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                uid: result.user.uid,
                providerId: result.user.providerId,
                keywords: generateKeywords(result.user.displayName?.toLowerCase()),
            });
        }
    };

    return (
        <main className="welcome">
            <h2>Welcome to Chat Fun App</h2>
            <p>Mời bạn đăng nhập bằng Google để tham gia!</p>
            <button className="sign-in">
                <img
                    onClick={(event) => googleSignIn(event)}
                    src={GoogleSignin}
                    alt="sign in with google"
                    type="button"
                />
            </button>
        </main>
    );
};

export default Welcome;