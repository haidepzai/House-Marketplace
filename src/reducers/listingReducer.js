// Define the initial state
export const initialState = {
    geolocationEnabled: true,
    loading: false,
    formData: {
      type: "rent",
      name: "",
      bedrooms: 1,
      bathrooms: 1,
      parking: false,
      furnished: false,
      address: "",
      offer: false,
      regularPrice: 0,
      discountedPrice: 0,
      images: {},
      latitude: 0,
      longitude: 0,
    },
  };
  
  // Define the reducer
  export function listingReducer(state, action) {
    switch (action.type) {
      case "SET_LOADING":
        return { ...state, loading: action.payload };
      case "UPDATE_FORM_DATA":
        return { ...state, formData: { ...state.formData, ...action.payload } };
      case "SET_FIELD":
        return {
          ...state,
          formData: { ...state.formData, [action.field]: action.value },
        };
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }