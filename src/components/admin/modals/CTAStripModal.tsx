"use client";

import { Dialog } from "@headlessui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  subtitle: z.string().min(3, "Subtitle is required"),
  buttonText: z.string().min(1, "Button text is required"),
  buttonUrl: z.string().url("Valid button URL required"),
});

type FormData = z.infer<typeof schema>;

type CTAStripModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void> | void;
  initialValues?: Partial<FormData>;
};

export default function CTAStripModal({ open, onClose, onSubmit, initialValues }: CTAStripModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="mb-4 text-lg font-semibold">CTA Strip</Dialog.Title>
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
                {...register("buttonText")}
                placeholder="Button text"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.buttonText && <p className="mt-1 text-sm text-red-600">{errors.buttonText.message}</p>}
            </div>
            <div>
              <input
                {...register("buttonUrl")}
                placeholder="Button URL"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.buttonUrl && <p className="mt-1 text-sm text-red-600">{errors.buttonUrl.message}</p>}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
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
