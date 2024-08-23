import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      credentials: 'include',
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to load profile');
      }
    }).then(userInfo => {
      setUserInfo(userInfo);
    }).catch(error => {
      console.error('Error fetching profile:', error);
    });
  }, []);

  function logout() {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    }).then(response => {
      if (response.ok) {
        setUserInfo(null);
      } else {
        console.error('Failed to log out');
      }
    }).catch(error => {
      console.error('Error logging out:', error);
    });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">MyBlog</Link>
      <nav>
        {username ? (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
