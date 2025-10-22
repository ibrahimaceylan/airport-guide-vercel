"use client";

import { useEffect, useState, useTransition } from "react";

type ContentItem = {
  id: number;
  title: string;
  body: string;
};

export default function ContentEditor({
  selected,
  onRefresh,
}: {
  selected: ContentItem | null;
  onRefresh: () => Promise<void>;
}) {
  const [title, setTitle] = useState(selected?.title ?? "");
  const [body, setBody] = useState(selected?.body ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTitle(selected?.title ?? "");
    setBody(selected?.body ?? "");
    setMessage(null);
  }, [selected]);

  const handleSave = () => {
    startTransition(async () => {
      try {
        setMessage(null);
        const payload = { title, body };
        const response = await fetch(
          selected ? `/api/content/${selected.id}` : "/api/content",
          {
            method: selected ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to save content");
        }

        await onRefresh();
        setMessage("Saved successfully!");
      } catch (error) {
        console.error(error);
        setMessage("Unable to save content. Please try again.");
      }
    });
  };

  const handleDelete = () => {
    if (!selected) {
      return;
    }

    startTransition(async () => {
      try {
        setMessage(null);
        const response = await fetch(`/api/content/${selected.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete content");
        }

        await onRefresh();
        setTitle("");
        setBody("");
        setMessage("Content deleted.");
      } catch (error) {
        console.error(error);
        setMessage("Unable to delete content. Please try again.");
      }
    });
  };

  const isEditing = Boolean(selected);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {isEditing ? "Edit Content" : "Create Content"}
        </h2>
        <p className="text-sm text-slate-500">
          {isEditing
            ? "Update title and body, then save to publish changes."
            : "Draft new content for the dashboard audience."}
        </p>
      </header>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a descriptive title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Body</label>
          <textarea
            className="h-40 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Write the content body here..."
          />
        </div>

        {message && (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            {message}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={!title || !body || isPending}
            className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex items-center rounded-full border border-rose-500 px-5 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
