"use client";
import type { Route } from "next";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

const SUPPORTED_LOCALES = ["en", "tr", "ar"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
const FALLBACK_LOCALE: SupportedLocale = "en";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const localeFromPath = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return SUPPORTED_LOCALES.includes(segments[0] as SupportedLocale)
      ? (segments[0] as SupportedLocale)
      : FALLBACK_LOCALE;
  }, [pathname]);

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage("");

    const response = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (response?.error) {
      setErrorMessage("Invalid email or password. Please try again.");
      return;
    }

    try {
      const sessionResponse = await fetch("/api/auth/session");
      if (!sessionResponse.ok) {
        throw new Error("Session fetch failed");
      }
      const session = await sessionResponse.json();
      const role = session?.user?.role;
      const preferredLocale = localeFromPath;

      if (role === "ADMIN") {
        router.replace(`/${preferredLocale}/admin` as Route);
      } else if (role === "EDITOR") {
        router.replace(`/${preferredLocale}/editor` as Route);
      } else {
        router.replace("/" as Route);
      }
    } catch (error) {
      console.error("Failed to determine user role after sign-in", error);
      router.replace("/" as Route);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-slate-100 shadow-2xl backdrop-blur"
      >
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] text-sky-300 uppercase">Istanbul Airport Guide</p>
          <h1 className="mt-2 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-300">
            Sign in with your credentials to manage travel content and updates.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">Email</label>
          <input
            type="email"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/50 focus:outline-none"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-sm text-rose-400">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/50 focus:outline-none"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-sm text-rose-400">{errors.password.message}</p>}
        </div>

        {errorMessage && (
          <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-300">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-slate-300">
          New here?{" "}
          <Link href="/register" className="text-sky-300 hover:text-sky-200">
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
}
