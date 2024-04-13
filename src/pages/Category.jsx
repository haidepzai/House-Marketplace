import { where, orderBy, limit } from "firebase/firestore";
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import useFetchListings from "../hooks/useFetchListings";

function Category() {
  const params = useParams();
  const [startFrom, setStartFrom] = useState(null);

  const constraints = useMemo(
    () => [
      where("type", "==", params.categoryName),
      orderBy("timestamp", "desc"),
      limit(1),
    ],
    [params.categoryName]
  );

  const { listings, loading, lastFetchedListing } = useFetchListings({
    constraints: constraints,
    startFrom: startFrom,
  });

  const onFetchMoreListings = () => {
    setStartFrom(lastFetchedListing);
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {listings.length > 0 ? (
            <main>
              <ul className="categoryListings">
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </ul>
              {lastFetchedListing && (
                <p className="loadMore" onClick={onFetchMoreListings}>
                  Load More
                </p>
              )}
            </main>
          ) : (
            <p>No listings found for {params.categoryName}.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Category;
