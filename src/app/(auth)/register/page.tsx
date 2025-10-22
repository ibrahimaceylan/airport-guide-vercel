"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = await response.json();
        setErrorMessage(payload?.error ?? "Registration failed. Please try again.");
        return;
      }

      reset();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Registration failed", error);
      setErrorMessage("Something went wrong while creating your account.");
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-slate-100 shadow-2xl backdrop-blur"
      >
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
            Istanbul Airport Guide
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Create your account</h1>
          <p className="mt-2 text-sm text-slate-300">
            Join the team to curate airport journeys and transport updates.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">Name</label>
          <input
            type="text"
            autoComplete="name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Enter at least 2 characters" },
            })}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            placeholder="First Last"
          />
          {errors.name && (
            <p className="text-sm text-rose-400">{errors.name.message}</p>
          )}
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
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-rose-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200">Password</label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            placeholder="Create a secure password"
          />
          {errors.password && (
            <p className="text-sm text-rose-400">{errors.password.message}</p>
          )}
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-slate-300">
          Already registered?{" "}
          <Link href="/(auth)/login" className="text-sky-300 hover:text-sky-200">
            Sign in
          </Link>
        </p>
      </form>
    </section>
  );
}
