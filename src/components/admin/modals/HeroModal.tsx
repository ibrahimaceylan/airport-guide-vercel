"use client";

import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const heroSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subtitle: z.string().min(3, "Subtitle must be at least 3 characters"),
  imageUrl: z.string().url("Please provide a valid URL"),
  ctaText: z.string().optional(),
  ctaLink: z.string().url("Please provide a valid URL").optional(),
});

export type HeroFormData = z.infer<typeof heroSchema>;

type HeroModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HeroFormData) => Promise<void> | void;
  initialValues?: Partial<HeroFormData>;
  mode?: "create" | "edit";
};

export default function HeroModal({ open, onClose, onSubmit, initialValues, mode = "edit" }: HeroModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: initialValues,
  });

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="mb-4 text-lg font-semibold">
            {mode === "create" ? "Add Hero Section" : "Edit Hero Section"}
          </Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("title")}
                placeholder="Title"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>
            <div>
              <input
                {...register("subtitle")}
                placeholder="Subtitle"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.subtitle && <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>}
            </div>
            <div>
              <input
                {...register("imageUrl")}
                placeholder="Image URL"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
            </div>
            <div>
              <input
                {...register("ctaText")}
                placeholder="CTA Text"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.ctaText && <p className="mt-1 text-sm text-red-600">{errors.ctaText.message}</p>}
            </div>
            <div>
              <input
                {...register("ctaLink")}
                placeholder="CTA Link"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.ctaLink && <p className="mt-1 text-sm text-red-600">{errors.ctaLink.message}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
