import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { env } from "~/server/env";

export const getPlaceDetails = baseProcedure
  .input(z.object({ placeId: z.string() }))
  .query(async ({ input }) => {
    try {
      // Call Google Places Details API
      const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      url.searchParams.append("place_id", input.placeId);
      url.searchParams.append("key", env.GOOGLE_GEOCODING_API_KEY);
      url.searchParams.append("fields", "address_components,formatted_address");

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Places Details API returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK" || !data.result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Place not found",
        });
      }

      // Extract address components
      const addressComponents = data.result.address_components;
      let streetNumber = "";
      let route = "";
      let city = "";
      let state = "";
      let zipCode = "";

      for (const component of addressComponents) {
        if (component.types.includes("street_number")) {
          streetNumber = component.long_name;
        }
        if (component.types.includes("route")) {
          route = component.long_name;
        }
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.short_name;
        }
        if (component.types.includes("postal_code")) {
          zipCode = component.long_name;
        }
      }

      const formattedAddress = data.result.formatted_address || "";
      // Strip ", USA" from the end if present for a cleaner look
      const streetAddress = formattedAddress.replace(/, USA$/, "");

      return {
        streetAddress,
        zipCode,
      };
    } catch (error) {
      console.error("Error fetching place details:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch place details",
      });
    }
  });
