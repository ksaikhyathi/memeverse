"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const memes = [
    { url: "https://i.imgflip.com/30b1gx.jpg", caption: "This page doesn't exist... But why? 🤔" },
    { url: "https://i.imgflip.com/1ur9b0.jpg", caption: "404: This ain't it chief. 🚫" },
    { url: "https://i.imgflip.com/26am.jpg", caption: "Something went wrong... Try again? 🤷‍♂️" },
    { url: "https://i.imgflip.com/4t0m5.jpg", caption: "Maybe you took a wrong turn? 🛑" },
  ];

  const [randomMeme, setRandomMeme] = useState(memes[0]);

  useEffect(() => {
    // Select a random meme on page load
    setRandomMeme(memes[Math.floor(Math.random() * memes.length)]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404 - Page Not Found</h1>
      
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <Image src={randomMeme.url} alt="Funny 404 Meme" width={400} height={400} className="rounded-lg" />
        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-4">{randomMeme.caption}</p>
      </div>

      {/* Go Back Button */}
      <Link href="/">
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700">
          ⬅ Go Home
        </button>
      </Link>
    </div>
  );
}
