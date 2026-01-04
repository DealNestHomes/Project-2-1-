import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { env } from "~/server/env";

export const getAddressSuggestions = baseProcedure
  .input(z.object({ input: z.string() }))
  .query(async ({ input: queryInput }) => {
    if (!queryInput.input || queryInput.input.trim().length === 0) {
      return { suggestions: [] };
    }

    try {
      // Call Google Places Autocomplete API
      const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
      url.searchParams.append("input", queryInput.input);
      url.searchParams.append("key", env.GOOGLE_GEOCODING_API_KEY);
      url.searchParams.append("types", "address"); // Restrict to addresses only
      url.searchParams.append("components", "country:us"); // Restrict to US addresses

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Places API returned status ${response.status}`);
      }

      const data = await response.json();

      // Check if we got results
      if (data.status !== "OK" || !data.predictions || data.predictions.length === 0) {
        return { suggestions: [] };
      }

      // Map predictions to a simpler format
      const suggestions = data.predictions.map((prediction: any) => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting.main_text,
        secondaryText: prediction.structured_formatting.secondary_text,
      }));

      return { suggestions };
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch address suggestions",
      });
    }
  });
