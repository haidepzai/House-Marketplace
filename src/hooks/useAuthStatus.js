import React from "react";
import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [userId, setUserId] = useState(null); // New code

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setUserId(user.uid); // New code
      }
      setCheckingStatus(false);
    });
    // Cleanup the firebase event listener when the component unmounts
    return unsubscribe;
  });

  return { loggedIn, checkingStatus, userId }; // userId Added
};
