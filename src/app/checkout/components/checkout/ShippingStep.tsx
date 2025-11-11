"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select, { StylesConfig } from "react-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useCheckout } from "@/context/checkout-context";
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from "country-state-city";

interface FormCountry {
  code: string;
  name: string;
}
interface FormState {
  code: string;
  name: string;
}
interface FormCity {
  name: string;
}

const mapCountryToForm = (c: ICountry): FormCountry => ({
  code: c.isoCode,
  name: c.name,
});
const mapStateToForm = (s: IState): FormState => ({
  code: s.isoCode,
  name: s.name,
});
const mapCityToForm = (c: ICity): FormCity => ({ name: c.name });

const allCountries: FormCountry[] =
  Country.getAllCountries().map(mapCountryToForm);

const countrySchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
});
const stateSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
});
const citySchema = z.object({ name: z.string().min(1) });
const shippingSchema = z.object({
  country: countrySchema,
  state: stateSchema,
  city: citySchema,
  address: z.string().min(5),
  apartment: z.string().optional(),
  zipCode: z.string().optional(),
});
type ShippingFormData = z.infer<typeof shippingSchema>;

// ✅ UPDATED Custom React-Select styles for Dark/Light Mode
const selectStyles: StylesConfig<{ label: string; value: any }, false> = {
  // Container for the entire component
  control: (styles, { isDisabled, isFocused }) => ({
    ...styles,
    // Use theme colors for background and border
    backgroundColor: "var(--background)",
    borderColor: isFocused ? "var(--input)" : "var(--border)",
    boxShadow: isFocused ? "0 0 0 2px var(--ring)" : "none", // Use ring for focus shadow
    color: "var(--foreground)",
    minHeight: "44px",
    borderRadius: "6px", // Changed to 6px to match Input/Textarea's rounded-md
    pointerEvents: isDisabled ? "none" : "auto",
    cursor: "pointer",
    fontSize: "0.95rem",
    "@media (max-width: 640px)": {
      fontSize: "0.875rem",
    },
    "&:hover": { borderColor: isFocused ? "var(--ring)" : "var(--input)" },
  }),

  // Text inside the control
  singleValue: (styles) => ({
    ...styles,
    color: "var(--foreground)", // Text flips color
  }),

  // Placeholder text
  placeholder: (styles) => ({
    ...styles,
    color: "var(--muted-foreground)", // Placeholder text flips color
  }),

  // The dropdown menu itself
  menu: (styles) => ({
    ...styles,
    backgroundColor: "var(--popover)", // Use popover color for menus
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
    zIndex: 50,
  }),

  // Individual options
  option: (styles, { isSelected, isFocused }) => {
    return {
      ...styles,
      backgroundColor: isSelected
        ? "var(--primary)"
        : isFocused
        ? "var(--accent)" // Light hover/Dark hover
        : "var(--popover)",
      color: isSelected ? "var(--primary-foreground)" : "var(--foreground)", // Text color flips
      cursor: "pointer",
      "&:active": {
        backgroundColor: "var(--primary)",
      },
    };
  },

  // Dropdown indicator (arrow)
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "var(--muted-foreground)",
    "&:hover": { color: "var(--foreground)" },
  }),

  // Separator
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: "var(--border)",
  }),
};

export function ShippingStep() {
  const { checkoutData, updateCheckoutData, goToNextStep, goToPreviousStep } =
    useCheckout();

  const [availableStates, setAvailableStates] = useState<FormState[]>([]);
  const [availableCities, setAvailableCities] = useState<FormCity[]>([]);

  const allStates = useMemo(() => State.getAllStates(), []);
  const allCities = useMemo(() => City.getAllCities(), []);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: checkoutData.shippingInfo
      ? {
          country: allCountries.find(
            (c) => c.name === checkoutData.shippingInfo.country
          ) || { code: "", name: "" },
          state: allStates.find(
            (s) => s.name === checkoutData.shippingInfo.state
          )
            ? mapStateToForm(
                allStates.find(
                  (s) => s.name === checkoutData.shippingInfo.state
                )!
              )
            : { code: "", name: "" },
          city: allCities.find((c) => c.name === checkoutData.shippingInfo.city)
            ? mapCityToForm(
                allCities.find(
                  (c) => c.name === checkoutData.shippingInfo.city
                )!
              )
            : { name: "" },
          address: checkoutData.shippingInfo.address || "",
          apartment: checkoutData.shippingInfo.apartment || "",
          zipCode: checkoutData.shippingInfo.zipCode || "",
        }
      : {
          country: { code: "", name: "" },
          state: { code: "", name: "" },
          city: { name: "" },
          address: "",
          apartment: "",
          zipCode: "",
        },
  });

  const selectedCountry = form.watch("country");
  const selectedState = form.watch("state");

  useEffect(() => {
    if (selectedCountry?.code) {
      const filteredStates = State.getStatesOfCountry(selectedCountry.code).map(
        mapStateToForm
      );
      setAvailableStates(filteredStates);
      form.setValue("state", { code: "", name: "" });
      form.setValue("city", { name: "" });
      setAvailableCities([]);
    } else {
      setAvailableStates([]);
      setAvailableCities([]);
    }
  }, [selectedCountry, form]);

  useEffect(() => {
    if (selectedState?.code && selectedCountry?.code) {
      const filteredCities = City.getCitiesOfState(
        selectedCountry.code,
        selectedState.code
      ).map(mapCityToForm);
      setAvailableCities(filteredCities);
      form.setValue("city", { name: "" });
    } else {
      setAvailableCities([]);
    }
  }, [selectedState, selectedCountry, form]);

  const onSubmit = (data: ShippingFormData) => {
    updateCheckoutData({
      shippingInfo: {
        address: data.address,
        country: data.country.name,
        state: data.state.name,
        city: data.city.name,
        apartment: data.apartment,
        zipCode: data.zipCode,
      },
    });
    goToNextStep();
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto px-4 sm:px-0">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Shipping Information
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your shipping details below.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 sm:space-y-6"
          noValidate
        >
          {/* Responsive Grid for Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    options={allCountries.map((c) => ({
                      label: c.name,
                      value: c,
                    }))}
                    value={
                      field.value?.code
                        ? { label: field.value.name, value: field.value }
                        : null
                    }
                    onChange={(option) => field.onChange(option?.value)}
                    placeholder="Select Country"
                    styles={selectStyles}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / Province</FormLabel>
                  <Select
                    options={availableStates.map((s) => ({
                      label: s.name,
                      value: s,
                    }))}
                    value={
                      field.value?.code
                        ? { label: field.value.name, value: field.value }
                        : null
                    }
                    onChange={(option) => field.onChange(option?.value)}
                    placeholder={
                      availableStates.length
                        ? "Select State"
                        : "Select a country first"
                    }
                    isDisabled={!availableStates.length}
                    styles={selectStyles}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  options={availableCities.map((c) => ({
                    label: c.name,
                    value: c,
                  }))}
                  value={
                    field.value?.name
                      ? { label: field.value.name, value: field.value }
                      : null
                  }
                  onChange={(option) => field.onChange(option?.value)}
                  placeholder={
                    availableCities.length
                      ? "Select City"
                      : "Select a state first"
                  }
                  isDisabled={!availableCities.length}
                  styles={selectStyles}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <Textarea
                  placeholder="123 Main Street"
                  className="resize-none min-h-[80px]"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="apartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apartment / Suite (Optional)</FormLabel>
                  {/* These Input/Textarea components must handle dark mode correctly */}
                  <Input placeholder="Apt #4B" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP / Postal Code</FormLabel>
                  {/* These Input/Textarea components must handle dark mode correctly */}
                  <Input placeholder="Enter postal code" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Buttons - stack on mobile */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              className="w-full sm:w-auto"
            >
              Back to Customer Info
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Continue to Payment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
