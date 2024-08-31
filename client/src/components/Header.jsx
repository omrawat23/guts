import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import logo from "../assets/log.svg";
import menu from "../assets/mi.png";
import Button from "./ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    // Check if session exists in localStorage
    const storedUserInfo = localStorage.getItem("userInfo");

    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      fetch(`/api/profile`, {
        method: "GET",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 401) {
            // Unauthorized access, handle accordingly
            setUserInfo(null);
            localStorage.removeItem("userInfo");
            return null;
          } else {
            throw new Error("Failed to load profile");
          }
        })
        .then((userInfo) => {
          if (userInfo) {
            setUserInfo(userInfo);
            localStorage.setItem("userInfo", JSON.stringify(userInfo)); // Store session in localStorage
          }
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [setUserInfo]);

  const logout = () => {
    fetch(`/api/logout`, { 
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          setUserInfo(null);
          localStorage.removeItem("userInfo"); // Clear session on logout
        } else {
          console.error("Failed to log out");
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const username = userInfo?.username;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-transparent absolute top-0 left-0 right-0 z-10">
      <Link to="/" aria-label="Home">
        <div className="flex items-center">
          <Button>
            <img src={logo} alt="logo" className="h-6 w-6" />
          </Button>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center">
        <ul className="flex space-x-6 mr-6">
          {username ? (
            <>
              <li>
                <Button
                  asChild
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <Link to="/create">Create new post</Link>
                </Button>
              </li>
              <li>
                <Button
                  onClick={logout}
                  className="text-white hover:text-gray-200 focus:outline-none"
                  aria-label={`Logout ${username}`}
                >
                  Logout ({username})
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button
                  asChild
                  className="text-white hover:text-gray-200"
                >
                  <Link to="/login">Log in</Link>
                </Button>
              </li>
              <li>
                <Button
                  asChild
                  className="text-white hover:text-gray-200"
                >
                  <Link to="/register">SIGN IN</Link>
                </Button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <Button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        <img src={menu} alt="Menu" className="h-6 w-6" />
      </Button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute bg-black top-full right-12 shadow-md rounded-3xl md:hidden transition-transform duration-300 w-64">
          <nav className="flex flex-col items-center py-4 px-4">
            <ul className="flex flex-col items-center space-y-4">
              {username ? (
                <>
                  <li>
                    <Button
                      asChild
                      className="text-white hover:text-gray-600"
                    >
                      <Link to="/create">Create new post</Link>
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={logout}
                      className="text-white hover:text-gray-600 focus:outline-none"
                      aria-label={`Logout ${username}`}
                    >
                      Logout ({username})
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Button
                      asChild
                      className="text-white hover:text-gray-600"
                    >
                      <Link to="/login">Log in</Link>
                    </Button>
                  </li>
                  <li>
                    <Button
                      asChild
                      className="text-white hover:text-gray-600"
                    >
                      <Link to="/register">SIGN IN</Link>
                    </Button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
