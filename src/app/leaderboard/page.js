"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LeaderboardPage() {
  const [topMemes, setTopMemes] = useState([]);
  const [userRankings, setUserRankings] = useState([]);

  useEffect(() => {
    // Load liked memes from Local Storage
    const likedMemes = JSON.parse(localStorage.getItem("likedMemes")) || [];
    const memeLikes = JSON.parse(localStorage.getItem("memeLikes")) || {};

    // Sort memes by likes (Top 10)
    const sortedMemes = likedMemes
      .map((meme) => ({
        ...meme,
        likes: memeLikes[meme.id] || 0,
      }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);

    setTopMemes(sortedMemes);

    // User Rankings based on Engagement
    const userEngagement = JSON.parse(localStorage.getItem("userEngagement")) || {};
    const sortedUsers = Object.entries(userEngagement)
      .map(([username, score]) => ({ username, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setUserRankings(sortedUsers);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Leaderboard 🏆</h1>

      {/* Top 10 Memes */}
      <div className="w-full max-w-5xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">🔥 Top 10 Memes</h2>
        {topMemes.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 mt-2">No memes have been liked yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {topMemes.map((meme, index) => (
              <Link key={meme.id} href={`/meme/${meme.id}`}>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer">
                  <Image src={meme.url} alt="Meme" width={500} height={500} className="rounded-lg" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">{meme.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">❤️ {meme.likes} Likes</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Top Users */}
      <div className="mt-6 w-full max-w-5xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">🏅 Top Engaged Users</h2>
        {userRankings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 mt-2">No user rankings yet.</p>
        ) : (
          <ol className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            {userRankings.map((user, index) => (
              <li key={index} className="text-lg font-semibold text-gray-900 dark:text-white">
                #{index + 1} {user.username} - {user.score} Points
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Back to Home */}
      <Link href="/">
        <button className="mt-6 px-4 py-2 bg-gray-500 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600">
          ⬅ Back to Home
        </button>
      </Link>
    </div>
  );
}
