import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { env } from "~/server/env";

export const getCityStateFromAddress = baseProcedure
  .input(z.object({ address: z.string() }))
  .query(async ({ input }) => {
    if (!input.address || input.address.trim().length === 0) {
      return { city: null, state: null };
    }

    try {
      // Call Google Geocoding API
      const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
      url.searchParams.append("address", input.address);
      url.searchParams.append("key", env.GOOGLE_GEOCODING_API_KEY);

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Geocoding API returned status ${response.status}`);
      }

      const data = await response.json();

      // Check if we got results
      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        return { city: null, state: null };
      }

      // Extract city and state from the address components
      const addressComponents = data.results[0].address_components;
      let city: string | null = null;
      let state: string | null = null;

      for (const component of addressComponents) {
        // City can be in locality or sublocality
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        // State is in administrative_area_level_1
        if (component.types.includes("administrative_area_level_1")) {
          state = component.short_name; // Use short_name for state abbreviation (e.g., "CA" instead of "California")
        }
      }

      return { city, state };
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch address information",
      });
    }
  });
