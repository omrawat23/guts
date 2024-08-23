import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import { Button } from "../components/ui/button"; // Assuming you have a Button component in your project
import vid from "../assets/guts1.mp4"; // Video asset

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/post/` + id)
      .then(response => response.json())
      .then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files[0]);
    }
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  const Delete = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/post/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
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
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Edit Post</h1>
        <form onSubmit={updatePost} className="space-y-4">
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
          <Button type="submit" style={{ marginTop: '5px' }}>Update Post</Button>
          <Button type="button" onClick={Delete} style={{ marginTop: '5px' }}>Delete Post</Button>
        </form>
      </div>
    </div>
  );
}
