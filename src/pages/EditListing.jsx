import React from "react";
import { useReducer, useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { storeImage } from "../utils/firebaseStorage";
import { listingReducer, initialState } from "../reducers/listingReducer";
import { fetchGeolocation } from "../actions/GoogleMapsAction";
import useFetchListing from "../hooks/useFetchListing";
import Spinner from "../components/Spinner";

function EditListing() {
  const [state, dispatch] = useReducer(listingReducer, initialState);
  const { listingId } = useParams();
  const { userId } = useOutletContext();
  const { listing } = useFetchListing(listingId);

  const navigate = useNavigate();

  // Destructuring
  const { formData, loading, geolocationEnabled } = state;
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    images,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
  } = formData;

  useEffect(() => {
    // Redirect if listing is not user's
    if (listing && listing.userRef !== userId) {
      toast.error("You cannot edit this listing");
      navigate("/");
      // Update formData once listing data is available
    } else if (listing) {
      dispatch({
        type: "UPDATE_FORM_DATA",
        payload: {
          ...listing,
          address: listing.location,
          images: [],
        },
      });
    }
  }, [listing, navigate, userId]);

  const onMutate = (e) => {
    const { id, value, files } = e.target;
    let newValue =
      id === "images"
        ? files
        : value === "true"
        ? true
        : value === "false"
        ? false
        : value;
    dispatch({ type: "SET_FIELD", field: id, value: newValue });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", payload: true });

    // Perform validations and other logic...
    if (formData.discountedPrice >= formData.regularPrice) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(
        "The discounted price cannot be greater than the regular price!"
      );
      return;
    }

    if (formData.images.length > 6) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("You can only upload 6 images!");
      return;
    }

    const { lat, lng, error } = await fetchGeolocation(
      address,
      geolocationEnabled,
      process.env.REACT_APP_GOOGLE_API,
      latitude,
      longitude
    );

    if (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error(error);
      return;
    }

    let geolocation = { lat, lng };

    // Store images in firebase
    try {
      const imgUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
      ).catch(() => {
        dispatch({ type: "SET_LOADING", payload: false });
        toast.error("There was an error uploading your images!");
        return;
      });

      // Save to DB
      const formDataCopy = {
        ...formData,
        imgUrls,
        geolocation,
        timestamp: serverTimestamp(),
        userRef: userId,
      };

      formDataCopy.location = address;
      delete formDataCopy.images;
      delete formDataCopy.address;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;

      const docRef = doc(db, "listings", listingId);
      await updateDoc(docRef, formDataCopy);

      dispatch({ type: "SET_LOADING", payload: false });
      toast.success("Your listing has been edited!");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      toast.error("Failed to upload images: " + error.message);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />

          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div>
              <label className="formLabel">Bathrooms</label>
              <input
                className="formInputSmall"
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <label className="formLabel">Parking spot</label>
          <div className="formButtons">
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type="button"
              id="parking"
              value={true}
              onClick={onMutate}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type="button"
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Address</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type="button"
              id="offer"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type="button"
              id="offer"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              className="formInputSmall"
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {type === "rent" && <p className="formPriceText">$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                className="formInputSmall"
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={offer}
              />
            </>
          )}

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            className="formInputFile"
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />
          <button type="submit" className="primaryButton createListingButton">
            Edit Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default EditListing;
