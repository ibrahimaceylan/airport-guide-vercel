"use client";

import { Dialog } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect } from "react";
import { CAMPAIGN_PLACEMENTS, CAMPAIGN_STATUSES } from "@/lib/campaigns";

const placementOptions = [
  { value: "HERO_TILE", label: "Hero spotlight" },
  { value: "QUICK_LINK", label: "Quick link tile" },
  { value: "BANNER", label: "Banner strip" },
  { value: "FEATURED_SECTION", label: "Featured section card" },
  { value: "FOOTER_TILE", label: "Footer tile" },
] as const;

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "LIVE", label: "Live" },
  { value: "PAUSED", label: "Paused" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

const campaignFormSchema = z.object({
  name: z.string().min(3, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug required")
    .regex(/^[a-z0-9-]+$/i, "Use letters, numbers, and dashes"),
  headline: z.string().min(5, "Headline is required"),
  subheadline: z.string().optional(),
  imageUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  ctaText: z.string().min(2, "CTA text required"),
  destinationUrl: z.string().url("Enter a valid URL"),
  utmSource: z.string().optional().or(z.literal("")),
  utmMedium: z.string().optional().or(z.literal("")),
  utmCampaign: z.string().optional().or(z.literal("")),
  locale: z.string().min(2),
  status: z.enum(CAMPAIGN_STATUSES),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  placements: z
    .array(z.enum(CAMPAIGN_PLACEMENTS))
    .min(1, "Select at least one placement"),
});

export type PartnerCampaignFormValues = z.infer<typeof campaignFormSchema>;

type PartnerCampaignModalProps = {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initialValues?: Partial<PartnerCampaignFormValues>;
  onSubmit: (values: PartnerCampaignFormValues) => Promise<void> | void;
};

const formatDateInput = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
};

export default function PartnerCampaignModal({
  open,
  onClose,
  mode = "create",
  initialValues,
  onSubmit,
}: PartnerCampaignModalProps) {
  const defaultValues = useMemo<PartnerCampaignFormValues>(
    () => ({
      name: initialValues?.name ?? "",
      slug: initialValues?.slug ?? "",
      headline: initialValues?.headline ?? "",
      subheadline: initialValues?.subheadline ?? "",
      imageUrl: initialValues?.imageUrl ?? "",
      ctaText: initialValues?.ctaText ?? "",
      destinationUrl: initialValues?.destinationUrl ?? "",
      utmSource: initialValues?.utmSource ?? "",
      utmMedium: initialValues?.utmMedium ?? "",
      utmCampaign: initialValues?.utmCampaign ?? "",
      locale: initialValues?.locale ?? "en",
      status: initialValues?.status ?? "DRAFT",
      startDate: formatDateInput(initialValues?.startDate),
      endDate: formatDateInput(initialValues?.endDate),
      placements: initialValues?.placements ?? ["FEATURED_SECTION"],
    }),
    [initialValues],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PartnerCampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, open]);

  const selectedPlacements = watch("placements");

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <Dialog.Panel className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold">
            {mode === "create" ? "Create Partner Campaign" : "Edit Partner Campaign"}
          </Dialog.Title>

          <form
            className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
            onSubmit={handleSubmit(async (values) => {
              await onSubmit(values);
              onClose();
            })}
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="name">
                Campaign name
              </label>
              <input
                id="name"
                {...register("name")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                {...register("slug")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="headline">
                Headline
              </label>
              <input
                id="headline"
                {...register("headline")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errors.headline && <p className="text-xs text-red-600">{errors.headline.message}</p>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="subheadline">
                Subheadline
              </label>
              <textarea
                id="subheadline"
                rows={2}
                {...register("subheadline")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errors.subheadline && <p className="text-xs text-red-600">{errors.subheadline.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="imageUrl">
                Image URL
              </label>
              <input
                id="imageUrl"
                {...register("imageUrl")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errors.imageUrl && <p className="text-xs text-red-600">{errors.imageUrl.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="ctaText">
                CTA text
              </label>
              <input
                id="ctaText"
                {...register("ctaText")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errors.ctaText && <p className="text-xs text-red-600">{errors.ctaText.message}</p>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="destinationUrl">
                Destination URL
              </label>
              <input
                id="destinationUrl"
                {...register("destinationUrl")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errors.destinationUrl && <p className="text-xs text-red-600">{errors.destinationUrl.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="utmSource">
                UTM source
              </label>
              <input
                id="utmSource"
                {...register("utmSource")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="utmMedium">
                UTM medium
              </label>
              <input
                id="utmMedium"
                {...register("utmMedium")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="utmCampaign">
                UTM campaign
              </label>
              <input
                id="utmCampaign"
                {...register("utmCampaign")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="locale">
                Locale
              </label>
              <select
                id="locale"
                {...register("locale")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              >
                <option value="en">English (EN)</option>
                <option value="tr">Turkish (TR)</option>
                <option value="ar">Arabic (AR)</option>
                <option value="all">All locales</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="startDate">
                Start date
              </label>
              <input
                id="startDate"
                type="datetime-local"
                {...register("startDate")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700" htmlFor="endDate">
                End date
              </label>
              <input
                id="endDate"
                type="datetime-local"
                {...register("endDate")}
                className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-slate-700">Placements</p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="placements"
                  render={({ field: { value, onChange } }) => (
                    <>
                      {placementOptions.map((option) => {
                        const checked = value.includes(option.value);
                        return (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={checked}
                              onChange={() => {
                                if (checked) {
                                  onChange(value.filter((item) => item !== option.value));
                                } else {
                                  onChange([...value, option.value]);
                                }
                              }}
                            />
                            {option.label}
                          </label>
                        );
                      })}
                    </>
                  )}
                />
              </div>
              {errors.placements && <p className="mt-1 text-xs text-red-600">{errors.placements.message}</p>}
              {selectedPlacements.length > 1 ? (
                <p className="mt-2 text-xs text-slate-500">
                  Once saved, placements are prioritised by the order shown in this list.
                </p>
              ) : null}
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4">
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
                className="rounded bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : mode === "create" ? "Create campaign" : "Save changes"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
