"use client";

import { useCallback, useEffect, useState } from "react";
import ContentEditor from "./ContentEditor";

type ContentItem = {
  id: number;
  title: string;
  body: string;
};

type FetchState = "idle" | "loading" | "error";

export default function ContentList() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [status, setStatus] = useState<FetchState>("idle");

  const loadContent = useCallback(async () => {
    try {
      setStatus("loading");
      const response = await fetch("/api/content");
      if (!response.ok) {
        throw new Error("Failed to load content");
      }
      const data: ContentItem[] = await response.json();
      setItems(data);
      setSelected((current) =>
        current ? data.find((item) => item.id === current.id) ?? null : data[0] ?? null,
      );
      setStatus("idle");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Content Items</h2>
            <p className="text-sm text-slate-500">
              Select an item to edit. Changes will sync across dashboards.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-sm font-medium text-sky-600 hover:text-sky-500"
          >
            + New
          </button>
        </header>
        {status === "loading" && <p className="text-sm text-slate-500">Loading content…</p>}
        {status === "error" && (
          <p className="text-sm text-rose-500">
            Failed to load content. Please refresh or try again later.
          </p>
        )}
        <ul className="space-y-3">
          {items.map((item) => {
            const isActive = selected?.id === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className={`flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-sky-500 bg-sky-500/10 text-sky-700"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className="text-sm font-semibold">{item.title}</span>
                  <span className="line-clamp-2 text-xs text-slate-500">{item.body}</span>
                </button>
              </li>
            );
          })}
          {status === "idle" && items.length === 0 && (
            <li className="text-sm text-slate-500">No content items yet. Create your first entry.</li>
          )}
        </ul>
      </section>
      <section>
        <ContentEditor selected={selected} onRefresh={loadContent} />
      </section>
    </div>
  );
}
