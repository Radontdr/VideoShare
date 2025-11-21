import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js"; // Adjust the import path as needed

const AiHelper = () => {
  const [trending, setTrending] = useState([]);
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await axiosInstance.get("/api/ai/trending");
      setTrending(res.data);
    };
    fetchTrending();
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    const res = await axiosInstance.post("/api/ai/generate", { topic });
    setIdeas(res.data);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">AI Video Idea Generator</h2>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your topic..."
        className="w-full p-3 border border-gray-300 rounded"
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Generate Ideas
      </button>

      {trending.length > 0 && (
        <div>
          <h4 className="text-lg mt-6 font-medium">🔥 Trending Topics:</h4>
          <ul className="list-disc ml-5 text-sm text-gray-600">
            {trending.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {ideas && (
        <div className="bg-gray-100 p-6 rounded mt-8">
          <h3 className="text-xl font-bold mb-4">AI Suggestions</h3>
          <div>
            <h4 className="font-semibold">Titles:</h4>
            <ul>{ideas.titles.map((t, i) => <li key={i}>• {t}</li>)}</ul>

            <h4 className="font-semibold mt-4">Descriptions:</h4>
            <ul>{ideas.descriptions.map((d, i) => <li key={i}>• {d}</li>)}</ul>

            <h4 className="font-semibold mt-4">Tags:</h4>
            <ul>{ideas.tags.map((tag, i) => <li key={i}>• {tag}</li>)}</ul>

            <h4 className="font-semibold mt-4">Scripts:</h4>
            <ul>{ideas.scripts.map((s, i) => <li key={i}>• {s}</li>)}</ul>

            <h4 className="font-semibold mt-4">Thumbnail Prompts:</h4>
            <ul>{ideas.thumbnails.map((t, i) => <li key={i}>• {t}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiHelper;
