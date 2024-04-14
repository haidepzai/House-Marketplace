import { toast } from "react-toastify";

export function validateListing({ discountedPrice, regularPrice, images }) {
  if (discountedPrice >= regularPrice) {
    toast.error("The discounted price cannot be greater than the regular price!");
    return { isValid: false };
  }

  if (images.length > 6) {
    toast.error("You can only upload 6 images!");
    return { isValid: false };
  }

  return { isValid: true };
}
