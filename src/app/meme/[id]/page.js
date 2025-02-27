"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function MemeDetailsPage() {
  const { id } = useParams(); // Get meme ID from URL
  const [meme, setMeme] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch meme details (Mock API for now)
    const fetchMeme = async () => {
      try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        const foundMeme = data.data.memes.find((m) => m.id === id);
        setMeme(foundMeme || null);
      } catch (error) {
        console.error("Error fetching meme:", error);
      }
    };

    // Load meme, likes & comments from local storage
    fetchMeme();
    setLikes(Number(localStorage.getItem(`likes-${id}`)) || 0);
    setComments(JSON.parse(localStorage.getItem(`comments-${id}`)) || []);
  }, [id]);

  const handleLike = () => {
    const newLikes = likes + 1;
    setLikes(newLikes);
    localStorage.setItem(`likes-${id}`, newLikes);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(updatedComments));
    setNewComment("");
  };

  const handleCopyLink = () => {
    const memeUrl = window.location.href;
    navigator.clipboard.writeText(memeUrl);
    alert("Link copied to clipboard!");
  };

  if (!meme) return <p className="text-center text-gray-700 dark:text-white">Loading meme...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{meme.name}</h1>

      {/* Meme Image */}
      <Image src={meme.url} alt={meme.name} width={500} height={500} className="rounded-lg shadow-lg" />

      {/* Likes and Share */}
      <div className="flex gap-4 mt-4">
        <button onClick={handleLike} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600">
          ❤️ {likes} Likes
        </button>
        <button onClick={handleCopyLink} className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600">
          🔗 Copy Link
        </button>
      </div>

      {/* Comment Section */}
      <div className="w-96 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h2>
        <form onSubmit={handleCommentSubmit} className="mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button type="submit" className="mt-2 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
            Comment 💬
          </button>
        </form>
        <div className="mt-4">
          {comments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment, index) => (
              <p key={index} className="bg-white dark:bg-gray-800 p-2 mt-2 rounded-lg shadow-lg">
                {comment}
              </p>
            ))
          )}
        </div>
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
