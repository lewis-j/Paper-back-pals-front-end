import React, { useCallback, useState } from "react";
import { debounce } from "../../../../../utilities/debounce";

const useLocationSearch = () => {
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  const debouncedSearchLocation = useCallback(
    debounce(async (query) => {
      if (query.length < 3) return;

      setIsLoadingLocations(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        );
        const data = await response.json();
        setLocationSuggestions(
          data.map((item) => ({
            description: item.display_name,
            place_id: item.place_id,
          }))
        );
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoadingLocations(false);
      }
    }, 300),
    []
  );
  return { debouncedSearchLocation, isLoadingLocations, locationSuggestions };
};

export default useLocationSearch;
