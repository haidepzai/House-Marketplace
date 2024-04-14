export async function fetchGeolocation(address, enabled, apiKey, latitude = 0, longitude = 0) {
    if (!enabled) {
      return { lat: latitude, lng: longitude, location: undefined };
    }
  
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await response.json();
  
      if (data.status === "ZERO_RESULTS" || !data.results[0]) {
        return { lat: 0, lng: 0, location: undefined, error: "Please enter a correct address" };
      }
  
      const location = data.results[0]?.formatted_address;
      const lat = data.results[0]?.geometry.location.lat ?? 0;
      const lng = data.results[0]?.geometry.location.lng ?? 0;
  
      return { lat, lng, location, error: null };
    } catch (error) {
      console.error("Failed to fetch geolocation", error);
      return { lat: 0, lng: 0, location: undefined, error: "Failed to fetch geolocation" };
    }
  }
  