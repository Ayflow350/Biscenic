"use client";

import { Suspense } from "react";
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
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignUpFormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="lg:grid lg:min-h-screen lg:grid-cols-2 w-full">
          <div className="flex min-h-screen items-center justify-center py-12 px-4 bg-background">
            <div className="mx-auto w-full max-w-sm space-y-6">
              <div className="h-10 w-3/4 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-5 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-10 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-10 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="h-full w-full bg-slate-200 dark:bg-slate-700" />
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
        description: "Your account was created. Redirecting...",
      });
      form.reset();
      const fromPage = searchParams.get("from");
      const signInUrl = fromPage ? `/signin?from=${fromPage}` : "/signin";
      setTimeout(() => router.push(signInUrl), 1500);
    },
    onError: (error: any) => {
      toast.error("Sign Up Failed", {
        description: error?.message.includes("already exists")
          ? "An account with this email already exists."
          : "We couldn't create your account. Try again.",
      });
    },
  });

  const onSubmit = (values: SignUpFormData) => mutate(values);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 transition-colors duration-300">
      {/* Left column */}
      <div className="flex min-h-screen items-center justify-center py-12 px-4 bg-background text-foreground lg:min-h-0">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Sign up to save favorites and track orders.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
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
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
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
                    <Label>Email</Label>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        {...field}
                        disabled={isPending}
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
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
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground"
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
                  className="text-sm font-medium text-muted-foreground"
                >
                  I agree to Terms & Conditions
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isPending}
              >
                {isPending ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              href={`/signin?from=${searchParams.get("from") || "/"}`}
              className="underline text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="hidden lg:block relative bg-muted dark:bg-muted/20">
        <div
          className="absolute inset-0"
          style={{
            clipPath:
              "polygon(20% 0, 100% 0, 100% 100%, 0 100%, 20% 75%, 20% 25%)",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=2160&auto=format&fit=crop"
            alt="Furniture showroom"
            fill
            className="object-cover"
          />
        </div>

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white dark:text-gray-100">
          <div className="relative z-10 max-w-md space-y-4">
            <h2 className="text-4xl font-bold">
              Discovering the Best Furniture for Your Home
            </h2>
            <p className="text-gray-300 dark:text-gray-400">
              Explore modern furniture designed for elegance, comfort, and
              durability.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 dark:bg-black/30 px-4 py-2 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>100% Guarantee</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 dark:bg-black/30 px-4 py-2 backdrop-blur-sm">
                <Truck className="h-5 w-5" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}
