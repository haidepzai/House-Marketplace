// hooks/useFetchListings.js

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function useFetchListings({ collectionName = "listings", constraints = [], startFrom }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, collectionName);
        let q = query(listingsRef, ...constraints);
        if (startFrom) {
          q = query(listingsRef, ...constraints, startAfter(startFrom));
        }

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const newFetchedListings = querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          }));

          if (startFrom) {
            setListings(prev => [...prev, ...newFetchedListings]);
          } else {
            setListings(newFetchedListings);
          }

          const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastFetchedListing(lastVisible);
        }
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings.");
        setLoading(false);
      }
    };

    fetchListings();
  }, [collectionName, constraints, startFrom]); // Ensure dependencies are correctly listed

  return { listings, loading, lastFetchedListing };
}

export default useFetchListings;
