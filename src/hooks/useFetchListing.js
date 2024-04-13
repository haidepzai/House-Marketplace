// hooks/useFetchListing.js

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

function useFetchListing(listingId) {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!listingId) return;

        const fetchListing = async () => {
            setLoading(true);
            const docRef = doc(db, "listings", listingId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            } else {
                toast.error("Listing not found");
                setLoading(false);
                // navigate to home or another page might be done here or higher in the component chain based on design
            }
        };

        fetchListing();
    }, [listingId]);

    return { listing, loading };
}

export default useFetchListing;
