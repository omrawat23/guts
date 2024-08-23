import Header from "../components/Header";
import Post from "../Post";
import { useEffect, useState } from "react";
import Intro from "./Intro";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/post`)
      .then(response => response.json())
      .then(posts => setPosts(posts))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div className="bg-dark p-6 min-h-screen">
      <Intro />
      <div className="grid grid-cols-1 gap-6">
        {posts.length > 0 &&
          posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
      </div>
    </div>
  );
}