import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar user={null} />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Stack your{" "}
            <span className="text-accent">bucket lists</span>
          </h1>
          <p className="text-lg text-muted mb-10 max-w-lg mx-auto">
            Books to read, places to visit, movies to watch — create custom categories
            and track everything you want to do in life.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-hover transition-colors text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 rounded-xl bg-card border border-border text-foreground font-medium hover:bg-card-hover transition-colors text-lg"
            >
              Login
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="text-3xl mb-3">+</div>
              <h3 className="font-semibold mb-2">Custom Categories</h3>
              <p className="text-sm text-muted">
                Create any category you want — books, movies, recipes, travel spots, anything.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="text-3xl mb-3">&#10003;</div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-muted">
                Mark items as done when you complete them. Come back and update anytime.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="text-3xl mb-3">&#128279;</div>
              <h3 className="font-semibold mb-2">Save Links</h3>
              <p className="text-sm text-muted">
                Attach links to items so you can quickly find that book, movie, or place.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
