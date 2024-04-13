
import {
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import React, { useState, useMemo } from "react";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import useFetchListings from "../hooks/useFetchListings";

function Offers() {
  const [startFrom, setStartFrom] = useState(null);

  const constraints = useMemo(() => [
    where("offer", "==", true),
    orderBy("timestamp", "desc"),
    limit(1)
  ], []);

  const { listings, loading, lastFetchedListing } = useFetchListings({
    constraints: constraints,
    startFrom: startFrom
  });

  const onFetchMoreListings = () => {
    setStartFrom(lastFetchedListing);
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {listings.length > 0 ? (
            <main>
              <ul className="categoryListings">
                {listings.map(listing => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                ))}
              </ul>
              {lastFetchedListing && (
                <p className="loadMore" onClick={onFetchMoreListings}>
                  Load More
                </p>
              )}
            </main>
          ) : (
            <p>There are no current offers</p>
          )}
        </>
      )}
    </div>
  );
}

export default Offers;