import React, { useState, useEffect } from 'react';

const Homepage = ({ userId }) => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Fetch user's blog posts from an API endpoint
    fetch(`/api/posts?userId=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }
        return response.json();
      })
      .then(postsData => {
        setUserPosts(postsData);
      })
      .catch(error => {
        console.error('Error fetching user posts:', error);
      });
  }, [userId]);

  return (
    <div>
      <h2>Welcome to Your Homepage</h2>
      <h3>Your Blog Posts:</h3>
      <ul>
        {userPosts.map(post => (
          <li key={post.id}>
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Homepage;