"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckout } from "@/context/checkout-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// A simple SVG for the Google G logo
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
      c-6.627,0-12-5.373-12-12s5.373-12,12-12
      c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      s8.955,20,20,20s20-8.955,20-20
      C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
      c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4
      C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
      C29.211,35.091,26.715,36,24,36
      c-5.222,0-9.519-3.487-11.011-8.422l-6.522,5.025
      C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303
      c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238
      C43.021,36.251,44,30.651,44,24
      C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

const customerInfoSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
});

type CustomerInfoData = z.infer<typeof customerInfoSchema>;

export function CustomerInfoStep() {
  const { checkoutData, updateCheckoutData, goToNextStep, goToPreviousStep } =
    useCheckout();

  const form = useForm<CustomerInfoData>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: checkoutData.customerInfo,
  });

  const onSubmit = (data: CustomerInfoData) => {
    updateCheckoutData({ customerInfo: data });
    goToNextStep();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Customer Information</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your details below.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="080 1234 5678"
                    {...field}
                    className="bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 transition-colors"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={goToPreviousStep}>
              Back to Cart
            </Button>
            <Button type="submit">Continue to Shipping</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
