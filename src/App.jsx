import React from 'react';
import Navbar from './components/Navbar';
import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Search } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PacmanLoader from 'react-spinners/PacmanLoader';

import './App.css';

const App = () => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ai = new GoogleGenAI({ apiKey: "YOUR API KEY" });

  const handleSearch = async () => {
    if (!word.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Considered you are a dictionary AI. we will give to a word and you need to Give all the dictionary details in good form 
        including examples also, Meanings, Definitions, Synonyms , Phonetics etc The Word is ${word}`,
      });
      setResult(response.text);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch results. Please try again.");
      console.error("Search error:", error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && word.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="search-box relative">
            <div className="relative flex items-center bg-white rounded-xl shadow-lg">
              <Search 
                color="gray" 
                size={20} 
                className="absolute left-4 text-gray-400" 
              />
              <input 
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyUp={handleKeyPress}
                placeholder="Enter a word to search..."
                className="w-full py-4 px-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border-none text-lg"
              />
            </div>
          </div>

          <div className="result-container bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                  <PacmanLoader color="#9333ea" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : result ? (
                <div className="prose prose-lg max-w-none">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {result}
                  </Markdown>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  Enter a word and press Enter to see its definition
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-6 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-white">
            Made with ❤️ by <span className="text-purple-400 hover:text-purple-300 cursor-pointer transition-colors">SKS</span> all rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
