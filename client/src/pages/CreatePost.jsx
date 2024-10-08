import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext"; // Make sure to import your UserContext
import Editor from "../Editor";
import vid from "../assets/guts1.mp4";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function CreatePost() {
  const { userInfo } = useContext(UserContext); // Access userInfo from context
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault(); // Move this line to the top of the function

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    if (files.length > 0) {
      data.set('file', files[0]);
    }

    const response = await fetch(`${apiBaseUrl}/user/${userInfo.id}/post`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-dark max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Create New Post</h1>
        <form onSubmit={createNewPost} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <input
            type="text"
            placeholder="Summary"
            value={summary}
            onChange={ev => setSummary(ev.target.value)}
            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <input
            type="file"
            onChange={ev => setFiles(ev.target.files)}
            className="w-full border border-gray-700 rounded-md bg-gray-900 text-gray-100 focus:outline-none"
          />
          <Editor value={content} onChange={setContent} />
          <button
            type="submit"
            className="w-full bg-gray-700 text-gray-100 py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300 mt-4"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
}
