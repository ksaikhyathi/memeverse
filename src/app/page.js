"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [memes, setMemes] = useState([]);
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemes();
    loadLikedMemes();
  }, []);

  // Fetch Memes from API
  const fetchMemes = async () => {
    try {
      const response = await axios.get("https://api.imgflip.com/get_memes");
      const memeData = response.data.data.memes;

      if (memeData.length === 0) {
        setHasMore(false);
        return;
      }

      setMemes(memeData);
      setFilteredMemes(memeData);
    } catch (error) {
      console.error("Error fetching memes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load liked memes from LocalStorage
  const loadLikedMemes = () => {
    const storedLikes = JSON.parse(localStorage.getItem("likedMemes")) || [];
    setLikedMemes(storedLikes);
  };

  // Toggle Like Meme
  const toggleLike = (meme) => {
    let updatedLikes = [...likedMemes];
    const memeIndex = updatedLikes.findIndex((m) => m.id === meme.id);

    if (memeIndex !== -1) {
      updatedLikes.splice(memeIndex, 1);
    } else {
      updatedLikes.push(meme);
    }

    setLikedMemes(updatedLikes);
    localStorage.setItem("likedMemes", JSON.stringify(updatedLikes));
  };

  // Infinite Scrolling
  const fetchMoreMemes = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Search Filter
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query) {
        const results = memes.filter((meme) =>
          meme.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredMemes(results);
      } else {
        setFilteredMemes(memes);
      }
    }, 500),
    [memes]
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">MemeVerse 🎭</h1>
        <div className="flex gap-4">
          <Link href="/leaderboard">
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600">
              Leaderboard 🏆
            </button>
          </Link>
          <Link href="/profile">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700">
              Profile 🏆
            </button>
          </Link>
          <Link href="/meme-upload">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
              Upload Meme 🚀
            </button>
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-md"
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center p-6">
        <input
          type="text"
          placeholder="Search memes..."
          className="p-2 w-full md:w-1/2 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Meme List with Infinite Scroll */}
      <motion.div
        className="flex-grow overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 w-full max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {loading ? (
          <p className="text-gray-900 dark:text-gray-300 text-center">Loading memes...</p>
        ) : (
          <InfiniteScroll
            dataLength={filteredMemes.length}
            next={fetchMoreMemes}
            hasMore={hasMore}
            loader={<h4 className="text-center text-gray-700 dark:text-white">Loading more memes...</h4>}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {filteredMemes.map((meme, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                <Link href={`/meme/${meme.id}`}>
                  <Image
                    src={meme.url}
                    alt={meme.name}
                    width={500}
                    height={500}
                    className="rounded-lg cursor-pointer hover:opacity-80"
                  />
                </Link>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-2">{meme.name}</h3>

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(meme)}
                  className={`mt-2 px-4 py-2 font-bold rounded-lg shadow-md 
                    ${likedMemes.some((m) => m.id === meme.id) ? "bg-red-600 text-white" : "bg-gray-300 text-black"}`
                  }
                >
                  {likedMemes.some((m) => m.id === meme.id) ? "❤️ Liked" : "🤍 Like"}
                </button>
              </motion.div>
            ))}
          </InfiniteScroll>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="w-full p-4 bg-white dark:bg-gray-800 shadow-md text-center text-gray-600 dark:text-gray-300">
        © 2025 MemeVerse. All rights reserved.
      </footer>
    </div>
  );
}
