"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
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

// --- ADDED: Import for the checkout flow ---
import { useCheckout } from "@/context/checkout-context";

// ---- Your types and data (unchanged) ----
interface Country {
  code: string;
  name: string;
}
interface State {
  code: string;
  name: string;
  countryCode: string;
}
interface City {
  name: string;
  stateCode: string;
  countryCode: string;
}
const countries: Country[] = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
];
const states: State[] = [
  { code: "LA", name: "Lagos", countryCode: "NG" },
  { code: "FC", name: "Abuja", countryCode: "NG" },
  { code: "CA", name: "California", countryCode: "US" },
  { code: "ON", name: "Ontario", countryCode: "CA" },
];
const cities: City[] = [
  { name: "Ikeja", stateCode: "LA", countryCode: "NG" },
  { name: "Victoria Island", stateCode: "LA", countryCode: "NG" },
  { name: "Toronto", stateCode: "ON", countryCode: "CA" },
  { name: "Los Angeles", stateCode: "CA", countryCode: "US" },
];

// ---- Your Zod Schema (unchanged) ----
const countrySchema = z.object({
  code: z.string().min(1, "Country code is required"),
  name: z.string().min(1, "Country name is required"),
});
const stateSchema = z.object({
  code: z.string().min(1, "State code is required"),
  name: z.string().min(1, "State name is required"),
});
const citySchema = z.object({
  name: z.string().min(1, "City name is required"),
});
const shippingSchema = z.object({
  country: countrySchema,
  state: stateSchema,
  city: citySchema,
  address: z.string().min(5, "Please enter a valid street address"),
  apartment: z.string().optional(),
  zipCode: z.string().optional(),
});
type ShippingFormData = z.infer<typeof shippingSchema>;

export function ShippingStep() {
  // --- ADDED: Get checkout context functions ---
  const { checkoutData, updateCheckoutData, goToNextStep, goToPreviousStep } =
    useCheckout();

  const [availableStates, setAvailableStates] = useState<State[]>([]);
  const [availableCities, setAvailableCities] = useState<City[]>([]);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    // This `defaultValues` line is the source of the TypeScript error,
    // as `checkoutData.shippingInfo` may not match the form's expected shape.
    // We are keeping it as is, per your request.
    defaultValues: checkoutData.shippingInfo
      ? {
          country: countries.find(
            (c) => c.name === checkoutData.shippingInfo.country
          ) || { code: "", name: "" },
          state: states.find(
            (s) => s.name === checkoutData.shippingInfo.state
          ) || { code: "", name: "" },
          city: cities.find(
            (c) => c.name === checkoutData.shippingInfo.city
          ) || { name: "" },
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

  // Your dependent dropdown logic (unchanged)
  const selectedCountry = form.watch("country");
  const selectedState = form.watch("state");
  useEffect(() => {
    if (selectedCountry?.code) {
      const filteredStates = states.filter(
        (s) => s.countryCode === selectedCountry.code
      );
      setAvailableStates(filteredStates);
      form.setValue("state", { code: "", name: "" });
      form.setValue("city", { name: "" });
      setAvailableCities([]);
    }
  }, [selectedCountry, form]);
  useEffect(() => {
    if (selectedState?.code) {
      const filteredCities = cities.filter(
        (c) => c.stateCode === selectedState.code
      );
      setAvailableCities(filteredCities);
      form.setValue("city", { name: "" });
    }
  }, [selectedState, form]);

  // --- MODIFIED: Connect onSubmit to the checkout flow ---
  const onSubmit = (data: ShippingFormData) => {
    console.log("✅ Submitted data:", data);
    updateCheckoutData({
      shippingInfo: {
        address: data.address,
        city: data.city.name,
        state: data.state.name,
        apartment: data.apartment,
        zipCode: data.zipCode,
      },
    }); // Save data to the global context
    goToNextStep(); // Go to the 'Payment' step
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Shipping Information</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your shipping details below.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* All your FormField components remain exactly the same */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  options={countries.map((c) => ({
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
                />
                <FormMessage />
              </FormItem>
            )}
          />

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
                  className="resize-none"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apartment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment, suite, etc. (Optional)</FormLabel>
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
                <FormLabel>ZIP / Postal Code (Optional)</FormLabel>
                <Input placeholder="Enter postal code" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* --- ADDED: Navigation buttons --- */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={goToPreviousStep}>
              Back to Customer Info
            </Button>
            <Button type="submit">Continue to Payment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
