// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { v4 as uuid } from "uuid";

initializeApp({
  apiKey: "AIzaSyCdpbCG21sdpJ5cZw-P_tTiFDCvILkheFc",
  authDomain: "places-45dcd.firebaseapp.com",
  projectId: "places-45dcd",
  storageBucket: "places-45dcd.appspot.com",
  messagingSenderId: "808239319666",
  appId: "1:808239319666:web:55be5c555cf4ea8ebe90eb",
  measurementId: "G-T2WG3Y2P33",
});

export const db = getFirestore(); //firestore database

export const signUp = async (email, password, username) => {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  // Signed up
  const { user } = userCredential;
  return await generateDocument("users", user.uid, {
    id: user.uid,
    username,
    email: user.email,
  });
};

export const signIn = async (email, password) => {
  const auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  // Signed in
  return userCredential.user;
};

export const logOut = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    return "Signed out succesfully";
  } catch (e) {
    return `An error occured: ${e.code}`;
  }
};

export const generateDocument = async (coll, id = undefined, data) => {
  if (!coll) return null; //must provide a collection to generate the document

  const docRef = id
    ? await setDoc(doc(db, coll, id), data) //give the id with the data
    : await addDoc(collection(db, coll), data); //automatically generate a random id
  return docRef ? docRef.id : id;
};
export const getDocument = async (coll, id) => {
  if (!id || !coll) return null;
  const docSnap = await getDoc(doc(db, coll, id));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return undefined;
  }
};

export const getDocuments = async (query) => {
  if (!query) return null;
  const querySnapshot = await getDocs(query);
  const results = [];
  querySnapshot.forEach((doc) => {
    results.push({ id: doc.id, data: doc.data() });
  });
  return results;
};

export const uploadImage = (file, extension) => {
  const storage = getStorage();
  const fileName = `${uuid()}.${extension}`;
  const storageRef = ref(storage, `images/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return {
    uploadTask,
    fileName,
  };
};

export const deleteImage = async (fileName) => {
  const storage = getStorage();
  // Create a reference to the file to delete
  const desertRef = ref(storage, `images/${fileName}`);
  // Delete the file
  await deleteObject(desertRef); //handle error in parent function
  return fileName;
};
