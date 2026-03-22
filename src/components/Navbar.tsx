"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: { user: { name: string; email: string } | null }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={user ? "/dashboard" : "/"} className="text-xl font-bold text-accent">
          Stackd
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-muted text-sm hidden sm:block">Hey, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-lg bg-card-hover text-foreground hover:bg-border transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm rounded-lg text-foreground hover:bg-card-hover transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
