import React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import GoogleMaps from "../components/GoogleMaps";
//import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getAuth } from "firebase/auth";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import useFetchListing from "../hooks/useFetchListing";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Listing() {
  const { listingId } = useParams();
  const { listing, loading } = useFetchListing(listingId);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const auth = getAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        style={{ height: "300px" }}
      >
        {listing.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <div className="listingDetails">
        <div className="card">
          <p className="listingName">
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          <p className="listingLocation">{listing.location}</p>
          <p className="listingType">
            For {listing.type === "rent" ? "Rent" : "Sale"}
          </p>
          {listing.offer && (
            <p className="discountPrice">
              $
              {(listing.regularPrice - listing.discountedPrice)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              discount
            </p>
          )}

          <ul className="listingDetailsList">
            <li>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </li>
            <li>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : "1 Bathroom"}
            </li>
            <li>{listing.parking ? "Parking Spot" : "No Parking"}</li>
            <li>{listing.furnished ? "Furnished" : "Not Furnished"}</li>
          </ul>
        </div>

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <GoogleMaps
            lat={listing.geolocation.lat}
            lng={listing.geolocation.lng}
          />

          {/*     Leaflet      
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer> */}
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
