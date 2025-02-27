"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("/default-avatar.png");
  const [uploadedMemes, setUploadedMemes] = useState([]);
  const [likedMemes, setLikedMemes] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure hydration happens only on the client
  useEffect(() => {
    setIsMounted(true);
    setName(localStorage.getItem("profileName") || "User");
    setBio(localStorage.getItem("profileBio") || "Meme lover!");
    setProfilePic(localStorage.getItem("profilePic") || "/default-avatar.png");

    setUploadedMemes(JSON.parse(localStorage.getItem("uploadedMemes")) || []);
    setLikedMemes(JSON.parse(localStorage.getItem("likedMemes")) || []);
  }, []);

  const handleProfileUpdate = () => {
    localStorage.setItem("profileName", name);
    localStorage.setItem("profileBio", bio);
    alert("Profile updated!");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        setProfilePic(imageData);
        localStorage.setItem("profilePic", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteUploadedMeme = (index) => {
    const updatedMemes = [...uploadedMemes];
    updatedMemes.splice(index, 1);
    setUploadedMemes(updatedMemes);
    localStorage.setItem("uploadedMemes", JSON.stringify(updatedMemes));
  };

  const deleteLikedMeme = (index) => {
    const updatedLikes = [...likedMemes];
    updatedLikes.splice(index, 1);
    setLikedMemes(updatedLikes);
    localStorage.setItem("likedMemes", JSON.stringify(updatedLikes));
  };

  if (!isMounted) {
    return null; // Prevents hydration errors
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">User Profile</h1>

      {/* Profile Info */}
      <div className="w-96 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <Image src={profilePic} alt="Profile Picture" width={100} height={100} className="rounded-full mx-auto" />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} className="mt-2 text-sm" />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Enter your name"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 mt-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Write a short bio..."
        />

        <button
          onClick={handleProfileUpdate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700"
        >
          Save Profile
        </button>
      </div>

      {/* Uploaded Memes */}
      <div className="mt-6 w-full max-w-5xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Uploaded Memes</h2>
        {uploadedMemes.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 mt-2">No memes uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {uploadedMemes.map((meme, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg relative">
                <Image src={meme.url} alt="Uploaded Meme" width={500} height={500} className="rounded-lg shadow-lg" />
                <button
                  onClick={() => deleteUploadedMeme(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liked Memes */}
      <div className="mt-6 w-full max-w-5xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Liked Memes</h2>
        {likedMemes.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 mt-2">You haven't liked any memes yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {likedMemes.map((meme, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg relative">
                <Image src={meme.url} alt="Liked Meme" width={500} height={500} className="rounded-lg shadow-lg" />
                <button
                  onClick={() => deleteLikedMeme(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}