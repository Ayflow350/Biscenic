"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { postSignIn } from "@/lib/SigninApi";
import { AxiosError } from "axios";

// ✅ Validation Schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof formSchema>;

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const fromParam = searchParams.get("from");

  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  // ✅ Type-safe mutation block
  const { mutate, isPending } = useMutation({
    mutationFn: postSignIn,
    onSuccess: (data) => {
      toast.success("Login Successful!", {
        description: "Welcome back. Redirecting...",
      });
      setUser(data.user);
      const fromPage = fromParam || "/Dashboard";
      router.push(fromPage);
      router.refresh();
    },
    onError: (error: unknown) => {
      // ✅ Type guard for better type safety
      let message = "Something went wrong. Try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as AxiosError<{ message?: string }>).response?.data?.message
      ) {
        message = (error as AxiosError<{ message?: string }>).response!.data!
          .message!;
      }

      toast.error("Login failed", { description: message });
    },
  });

  const onSubmit = (values: SignInFormData) => mutate(values);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left section (Form) */}
      <div className="dark flex min-h-screen items-center justify-center py-12 px-4 bg-black text-white lg:min-h-0">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email to login.
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
                    <div className="flex items-center">
                      <Label>Password</Label>
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline hover:text-gray-300"
                      >
                        Forgot your password?
                      </Link>
                    </div>
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
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isPending}
              >
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?from=${fromParam || "/"}`}
              className="underline hover:text-gray-300"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right section (Image) */}
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
            alt="Armchair"
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
              Our practice is designing complete environments, exceptional
              buildings, communities, and places.
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
