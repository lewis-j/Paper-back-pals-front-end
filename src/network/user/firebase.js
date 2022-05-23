//https://blog.logrocket.com/user-authentication-firebase-react-apps/
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";

import * as userServices from "./userApi";

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const firebaseParseErrorMsg = (err, defualtMsg) => {
  let message = null;
  const reg = /(?<=(auth\/)).*(?=\))/;
  message = err.message.match(reg);
  message = message ? message[0].split("-").join(" ") : defualtMsg;
  return message;
};

const observeUser = (userExist, noUser) => {
  return new Promise((resolve, reject) => {
    try {
      const unsubscribe = async () =>
        onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            userExist(currentUser.accessToken).then((user) => {
              resolve({ user });
            });
          } else {
            noUser();
            resolve({ user: null });
          }
        });
      unsubscribe();
    } catch (error) {
      reject(error);
    }
  });
};

const loginGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.log(err);
    return Promise.reject(
      firebaseParseErrorMsg(err, "Could not log in to google")
    );
  }
};

const loginWithForm = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    return Promise.reject(firebaseParseErrorMsg(err, "Failed to login"));
  }
};

const registerWithEmailAndPassword = async (email, password) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (err) {
    console.log("error in register form", err);
    return Promise.reject(
      firebaseParseErrorMsg(err, "Failed to register new user")
    );
  }
};

const sendPasswordReset = async (email) => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = async () => {
  await signOut(auth);
};

const setNewEmail = async (user, email) => {
  try {
    const res = await updateEmail(user, email);
    return userServices.updateOneUser(res.user.accessToken);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const setNewPsw = async (user, password) => {
  try {
    return await updatePassword(user, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export {
  auth,
  observeUser,
  loginGoogle,
  loginWithForm,
  registerWithEmailAndPassword,
  sendPasswordReset,
  setNewEmail,
  setNewPsw,
  logout,
};