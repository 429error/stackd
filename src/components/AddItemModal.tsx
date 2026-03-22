"use client";

import { useState } from "react";

export default function AddItemModal({
  categoryName,
  onClose,
  onAdd,
}: {
  categoryName: string;
  onClose: () => void;
  onAdd: (name: string, link: string) => void;
}) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), link.trim());
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-xl p-6 w-full max-w-md border border-border" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Add to {categoryName}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
            autoFocus
          />
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Link (optional)"
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
          />
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-card-hover text-foreground hover:bg-border transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
