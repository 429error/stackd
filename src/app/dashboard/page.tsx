"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import AddCategoryModal from "@/components/AddCategoryModal";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) {
        router.push("/login");
        return;
      }
      const userData = await userRes.json();
      setUser(userData.user);

      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      setCategories(catData.categories || []);
      setLoading(false);
    }
    init();
  }, [router]);

  async function addCategory(name: string) {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const data = await res.json();
      setCategories((prev) => [data.category, ...prev]);
      setShowAddCategory(false);
    }
  }

  async function deleteCategory(id: string) {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c._id !== id));
    }
  }

  if (loading) {
    return (
      <>
        <Navbar user={null} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted">Loading...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Your Lists</h1>
          <button
            onClick={() => setShowAddCategory(true)}
            className="px-5 py-2.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-hover transition-colors cursor-pointer"
          >
            + New Category
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">&#128218;</p>
            <p className="text-muted text-lg mb-2">No categories yet</p>
            <p className="text-muted text-sm">
              Create your first category to start tracking things you want to do!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} onDelete={deleteCategory} />
            ))}
          </div>
        )}
      </main>

      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onAdd={addCategory}
        />
      )}
    </>
  );
}
