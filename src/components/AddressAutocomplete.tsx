import { useState, useEffect, useRef, useMemo } from "react";
import { useTRPC, useTRPCClient } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Loader2 } from "lucide-react";

interface Suggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectAddress: (address: {
    streetAddress: string;
    zipCode: string;
  }) => void;
  error?: string;
  id?: string;
  placeholder?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelectAddress,
  error,
  id = "address",
  placeholder = "Start typing an address...",
}: AddressAutocompleteProps) {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const [debouncedInput, setDebouncedInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // Fetch suggestions
  const { data: suggestionsData, isLoading } = useQuery({
    ...trpc.getAddressSuggestions.queryOptions({
      input: debouncedInput,
    }),
    enabled: debouncedInput.length >= 3,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const suggestions = useMemo(() => suggestionsData?.suggestions || [], [suggestionsData]);

  // Show dropdown when we have suggestions
  useEffect(() => {
    const shouldOpen = suggestions.length > 0 && value.length >= 3;
    if (shouldOpen !== isOpen) {
      setIsOpen(shouldOpen);
    }
    // Only reset index if the suggestions list actually changed
    setSelectedIndex(-1);
  }, [suggestions, value.length > 3]); // Optimized dependency

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selecting a suggestion
  const handleSelectSuggestion = async (placeId: string, description: string) => {
    setIsOpen(false);
    onChange(description);

    // Fetch full address details
    try {
      const response = await trpcClient.getPlaceDetails.query({ placeId });
      onSelectAddress({
        streetAddress: response.streetAddress,
        zipCode: response.zipCode,
      });
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(
            suggestions[selectedIndex].placeId,
            suggestions[selectedIndex].description
          );
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 && value.length > 3) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-black transition-all hover:border-gray-300 px-4 py-3.5 pr-10 text-base min-h-[48px] touch-manipulation"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="max-h-80 overflow-y-auto overscroll-contain">
            {suggestions.map((suggestion: Suggestion, index: number) => (
              <button
                key={suggestion.placeId}
                type="button"
                onClick={() =>
                  handleSelectSuggestion(suggestion.placeId, suggestion.description)
                }
                className={`w-full text-left px-4 py-4 transition-all flex items-start gap-3 min-h-[60px] touch-manipulation ${index === selectedIndex
                  ? "bg-gradient-to-r from-primary-50 to-primary-100/50 border-l-4 border-primary-500"
                  : "hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent border-l-4 border-transparent active:bg-primary-100/50"
                  }`}
              >
                <MapPin className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-base leading-tight">
                    {suggestion.mainText}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 leading-snug">
                    {suggestion.secondaryText}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Powered by Google Places
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
