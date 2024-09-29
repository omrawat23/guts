import React, { useState, useEffect } from 'react';

const Homepage = ({ userId }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`/user/${userId}/posts`); // Update to the new API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch user posts');
        }
        const postsData = await response.json();
        setUserPosts(postsData);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setError(error.message); // Set error message to state for user feedback
      }
    };

    fetchUserPosts();
  }, [userId]);

  return (
    <div>
      <h2>Welcome to Your Homepage</h2>
      {error && <p className="error">{error}</p>} {/* Display error message if any */}
      <h3>Your Blog Posts:</h3>
      <ul>
        {userPosts.map(post => (
          <li key={post._id}> {/* Ensure you use the correct key */}
            <h4>{post.title}</h4>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
      {userPosts.length === 0 && <p>No posts available.</p>} {/* Message for no posts */}
    </div>
  );
}

export default Homepage;
