'use client'

import { useEffect, useState, useContext } from "react"
import { useInView } from "react-intersection-observer"
import Header from "../components/Header"
import Post from "../Post"
import Intro from "./Intro"
import { Loader2 } from "lucide-react"
import Button from "../components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { UserContext } from "../UserContext" 
import { Link } from "react-router-dom"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export default function IndexPage() {
  const { userInfo } = useContext(UserContext)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  const fetchPosts = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/user/${userInfo.id}/posts?page=${page}&limit=10`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const newPosts = await response.json()
      setPosts((prevPosts) => {
        const uniqueNewPosts = newPosts.filter(
          (newPost) => !prevPosts.some((prevPost) => prevPost._id === newPost._id)
        )
        return [...prevPosts, ...uniqueNewPosts]
      })
      setPage((prevPage) => prevPage + 1)
      setHasMore(newPosts.length === 10)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userInfo.id) {
      fetchPosts()
    }
  }, [userInfo])

  useEffect(() => {
    if (inView && userInfo.id) {
      fetchPosts()
    }
  }, [inView, userInfo])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Intro />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary my-8 text-center">Latest's Blogs</h1>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {(!userInfo.id) && (
          <div className="text-center my-8">
            <p className="text-muted-foreground">You need to sign up or log in to create posts.</p><br></br>
            <Link to="/login">
              <Button>
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button>
                Sign Up
              </Button>
            </Link>
          </div>
        )}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Post key={post._id} {...post} />
            ))}
          </div>
        )}
        {loading && (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {!loading && hasMore && userInfo.id && (
          <div ref={ref} className="flex justify-center my-8">
            <Button onClick={fetchPosts}>Load More</Button>
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-muted-foreground my-8">No more posts to load</p>
        )}
        {!loading && posts.length === 0 && userInfo.id && (
          <p className="text-center text-muted-foreground my-8">No posts available</p>
        )}
      </main>
    </div>
  )
}
