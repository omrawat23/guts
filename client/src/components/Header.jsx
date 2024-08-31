import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import logo from "../assets/log.svg";
import menu from "../assets/mi.png";
import Button from "./ui/button"; // Updated import statement

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    if (!userInfo) {
      fetch(`/api/profile`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to load profile");
          }
        })
        .then((userInfo) => {
          setUserInfo(userInfo);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [setUserInfo, userInfo]);

  const logout = () => {
    fetch(`/api/logout`, {
      credentials: "include",
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          setUserInfo(null);
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
      <a href="/" aria-label="Home">
        <div className="flex items-center">
          <Button>
            <img src={logo} alt="logo" className="h-6 w-6" /> {/* Adjusted size */}
          </Button>
        </div>
      </a>

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
        <img src={menu} alt="Menu" className="h-6 w-6" /> {/* Consistent size */}
      </Button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute bg-black top-full right-12 shadow-md rounded-3xl md:hidden transition-transform duration-300">
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
