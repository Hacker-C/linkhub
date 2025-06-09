import { PlusSquare, Share2, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from "@/components/ModeToggle";
import React from "react";

export default function Home() {
  return (
    <main className="container mx-auto flex flex-col items-center font-sans px-4">
      <div className='absolute right-6 top-4'>
        <ModeToggle/>
      </div>
      {/* Hero Section */}
      <header className="py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">LinkHub: Your Links, Simplified.</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Effortlessly collect, organize, and share all your important links in one place. Access them anytime, anywhere.
        </p>
        <Link href="/sign-up">
          <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get Started Free
          </button>
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-12 w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Everything You Need, All in One Place</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Collect Links */}
          <div className="flex flex-col items-center text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full mb-6 flex items-center justify-center text-blue-600 dark:text-blue-300">
              <PlusSquare size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Capture Every Link, Effortlessly</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Save articles, videos, tools, and inspiration from across the web with our intuitive collection tools.
            </p>
          </div>

          {/* Feature 2: Share Links */}
          <div className="flex flex-col items-center text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full mb-6 flex items-center justify-center text-green-600 dark:text-green-300">
              <Share2 size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Your Collections, Seamlessly</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Easily share your curated link collections with friends, colleagues, or the world.
            </p>
          </div>

          {/* Feature 3: Centralized Management */}
          <div className="flex flex-col items-center text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full mb-6 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <FolderKanban size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">All Your Links, Perfectly Organized</h3>
            <p className="text-gray-600 dark:text-gray-400">
              No more scattered bookmarks. Find what you need, when you need it, with powerful search and organization.
            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-6 text-center w-full text-gray-500 dark:text-gray-400 mt-12 ">
        &copy; {new Date().getFullYear()} <Link href='https://github.com/Hacker-C/linkhub' className='underline' target='_blank'>LinkHub</Link>. All rights reserved.
      </footer>
    </main>
  );
}
