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

import { useAuth } from "@/context/AuthContext";
import { postSignIn } from "@/lib/SigninApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});
type SignInFormData = z.infer<typeof formSchema>;

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="lg:grid lg:min-h-screen lg:grid-cols-2 w-full">
          {/* Left skeleton */}
          <div className="flex min-h-screen items-center justify-center py-12 px-4 bg-background">
            <div className="mx-auto w-full max-w-sm space-y-6">
              <Skeleton className="h-10 w-3/4 rounded-md" />
              <Skeleton className="h-5 w-full rounded-md" />
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
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useAuth();
  const fromParam = searchParams.get("from");

  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: postSignIn,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }
      setUser(data.user);

      toast.success("Login Successful!", {
        description: "Welcome back. Redirecting...",
      });

      let redirectTo = "https://biscenic-leun.vercel.app//Dashboard";
      if (data.user?.role === "customer" || data.user?.role === "guest") {
        redirectTo = "https://biscenic-leun.vercel.app//collections";
      }
      if (fromParam) redirectTo = fromParam;

      router.push(redirectTo);
      router.refresh();
    },
    onError: (error: any) => {
      toast.error("Login failed", {
        description:
          error?.response?.data?.message || "Something went wrong. Try again.",
      });
    },
  });

  const onSubmit = (values: SignInFormData) => mutate(values);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 transition-colors duration-300">
      {/* Left column */}
      <div className="flex min-h-screen items-center justify-center py-12 px-4 bg-background text-foreground lg:min-h-0">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to log in to your account.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isPending}
              >
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={`https://biscenic-leun.vercel.app/signup?from=${
                fromParam || "/"
              }`}
              className="underline text-primary hover:text-primary/80"
            >
              Sign up
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
              Bringing Comfort & Style to Your Space
            </h2>
            <p className="text-gray-300 dark:text-gray-400">
              Explore a world of modern furniture designed for elegance, comfort
              and durability.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 dark:bg-black/30 px-4 py-2 backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>100% Gurantee</span>
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
