"use client";

import { useState, useEffect } from "react";
import AddItemModal from "./AddItemModal";

interface Item {
  _id: string;
  name: string;
  status: "pending" | "done";
  link: string;
}

interface CategoryCardProps {
  category: { _id: string; name: string };
  onDelete: (id: string) => void;
}

export default function CategoryCard({ category, onDelete }: CategoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expanded) {
      fetchItems();
    }
  }, [expanded]);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch(`/api/items?categoryId=${category._id}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  async function addItem(name: string, link: string) {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, link, categoryId: category._id }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => [data.item, ...prev]);
      setShowAddItem(false);
    }
  }

  async function toggleStatus(item: Item) {
    const newStatus = item.status === "pending" ? "done" : "pending";
    const res = await fetch(`/api/items/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, status: newStatus } : i))
      );
    }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i._id !== id));
    }
  }

  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div
        className="p-5 cursor-pointer hover:bg-card-hover transition-colors flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {expanded ? "\u25BC" : "\u25B6"}
          </span>
          <h3 className="text-lg font-semibold">{category.name}</h3>
          {expanded && items.length > 0 && (
            <span className="text-xs text-muted bg-background px-2 py-1 rounded-full">
              {doneCount}/{items.length} done
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete "${category.name}" and all its items?`)) {
              onDelete(category._id);
            }
          }}
          className="text-muted hover:text-danger transition-colors p-1 cursor-pointer"
          title="Delete category"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* Items */}
      {expanded && (
        <div className="border-t border-border">
          {loading ? (
            <div className="p-5 text-center text-muted">Loading...</div>
          ) : (
            <>
              {items.length === 0 && (
                <div className="p-5 text-center text-muted text-sm">
                  No items yet. Add your first one!
                </div>
              )}

              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item._id} className="px-5 py-3 flex items-center gap-3 group">
                    <button
                      onClick={() => toggleStatus(item)}
                      className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                        item.status === "done"
                          ? "bg-success border-success"
                          : "border-muted hover:border-accent"
                      }`}
                    >
                      {item.status === "done" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    <span className={`flex-1 ${item.status === "done" ? "line-through text-muted" : ""}`}>
                      {item.name}
                    </span>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent-hover text-sm flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}

                    <button
                      onClick={() => deleteItem(item._id)}
                      className="text-muted hover:text-danger transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add item button */}
              <div className="p-3">
                <button
                  onClick={() => setShowAddItem(true)}
                  className="w-full py-2 rounded-lg border border-dashed border-border text-muted hover:text-foreground hover:border-accent transition-colors text-sm cursor-pointer"
                >
                  + Add Item
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {showAddItem && (
        <AddItemModal
          categoryName={category.name}
          onClose={() => setShowAddItem(false)}
          onAdd={addItem}
        />
      )}
    </div>
  );
}
