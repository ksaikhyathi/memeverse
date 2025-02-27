"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function MemeUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loadingCaption, setLoadingCaption] = useState(false);
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    // Load existing memes from localStorage
    const storedMemes = JSON.parse(localStorage.getItem("uploadedMemes")) || [];
    setMemes(storedMemes);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file); // Convert file to base64 for storage
    }
  };

  // 📌 Generate Meme Caption using AI (Joke API)
  const generateCaption = async () => {
    if (!selectedFile) {
      alert("Please upload a meme first.");
      return;
    }

    setLoadingCaption(true);

    try {
      // Fetch a random joke to use as a meme caption
      const response = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
      setCaption(response.data.joke); // Use joke as the meme caption
    } catch (error) {
      console.error("Error generating caption:", error);
      setCaption("When life gives you memes, share them! 😆");
    } finally {
      setLoadingCaption(false);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select an image or GIF to upload.");
      return;
    }

    const newMeme = { url: selectedFile, caption };

    // Save to localStorage
    const updatedMemes = [...memes, newMeme];
    setMemes(updatedMemes);
    localStorage.setItem("uploadedMemes", JSON.stringify(updatedMemes));

    // Reset fields
    setSelectedFile(null);
    setCaption("");

    alert("Meme uploaded successfully! 🚀");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Upload Your Meme 🚀</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

        {selectedFile && (
          <img src={selectedFile} alt="Meme Preview" className="w-full rounded-lg mb-4" />
        )}

        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Enter a funny caption..."
            className="p-2 w-full border rounded-lg dark:bg-gray-700 dark:text-white"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Generate AI Caption Button */}
          <button
            onClick={generateCaption}
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700"
            disabled={loadingCaption}
          >
            {loadingCaption ? "Generating..." : "✨ Generate AI Caption"}
          </button>
        </div>

        <button
          onClick={handleUpload}
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 w-full"
        >
          Upload Meme 🎉
        </button>
      </div>
    </div>
  );
}
