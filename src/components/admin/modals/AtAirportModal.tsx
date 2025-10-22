"use client";

import { Dialog } from "@headlessui/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(2, "Description is required"),
  imageUrl: z.string().url("Valid image URL required"),
});

type FormData = z.infer<typeof schema>;

type AtAirportModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void> | void;
  initialValues?: Partial<FormData>;
};

export default function AtAirportModal({ open, onClose, onSubmit, initialValues }: AtAirportModalProps) {
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
          <Dialog.Title className="mb-4 text-lg font-semibold">At the Airport</Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register("name")}
                placeholder="Name"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register("category")}
                placeholder="Category (Shopping/Dining/Services)"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>
            <div>
              <textarea
                {...register("description")}
                placeholder="Description"
                rows={3}
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>
            <div>
              <input
                {...register("imageUrl")}
                placeholder="Image URL"
                className="w-full rounded border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
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
