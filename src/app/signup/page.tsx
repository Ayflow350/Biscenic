"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { postSignUp } from "@/lib/SignupApi";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

type SignUpFormData = z.infer<typeof formSchema>;

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.487-11.011-8.422l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="lg:grid lg:min-h-screen lg:grid-cols-2 w-full">
          {/* Left skeleton */}
          <div className="flex min-h-screen items-center justify-center py-12 px-4 bg-black lg:min-h-0">
            <div className="mx-auto w-full max-w-sm space-y-6">
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Right skeleton */}
          <div className="hidden lg:block relative">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postSignUp,
    onSuccess: () => {
      toast.success("Account Created!", {
        description:
          "Your account was created successfully. Please sign in to continue.",
      });
      form.reset();

      const fromPage = searchParams.get("from");
      const signInUrl = fromPage ? `/signin?from=${fromPage}` : "/signin";

      setTimeout(() => router.push(signInUrl), 1500);
    },
    onError: (error: any) => {
      toast.error("Sign Up Failed", {
        description: error?.message.includes("already exists")
          ? "An account with this email already exists. Please try signing in."
          : "We couldn't create your account. Please try again.",
      });
    },
  });

  const onSubmit = (values: SignUpFormData) => mutate(values);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left column */}
      <div className="dark flex min-h-screen items-center justify-center py-12 px-4 bg-black text-white lg:min-h-0">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="text-balance text-muted-foreground">
              Create an account to save favorites and track orders.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Button variant="outline" className="w-full" type="button">
                <GoogleIcon />
                <span className="ml-2">Sign up with Google</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Name</Label>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                >
                  I agree to all Terms & Conditions
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isPending}
              >
                {isPending ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline hover:text-gray-300">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="hidden bg-muted lg:block relative">
        <div
          className="absolute inset-0"
          style={{
            clipPath:
              "polygon(20% 0, 100% 0, 100% 100%, 0 100%, 20% 75%, 20% 25%)",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2160&auto=format&fit=crop"
            alt="A person relaxing on a beautiful wooden armchair"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <div className="relative z-10 max-w-md space-y-4">
            <h2 className="text-4xl font-bold">
              Discovering the Best Furniture for Your Home
            </h2>
            <p className="text-gray-300">
              Our practice is Designing Complete Environments exceptional
              buildings communities and places in special situations
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>100% Guarantee</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Truck className="h-5 w-5" />
                <span>Free delivery London area</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}
