import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader } from "../src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../src/components/ui/avatar"
import { CalendarIcon, Clock, MessageCircle } from "lucide-react"
import { Badge } from "../src/components/ui/badge"
import Button from "../src/components/ui/button"

export default function PostCard({ _id, title, summary, cover, createdAt, author, category, readTime, commentCount }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
      <Link to={`/post/${_id}`} className="block flex-shrink-0">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={cover}
            alt={title}
            onError={(e) => {
              e.target.src = '/placeholder.svg?height=400&width=600'
            }}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="space-y-2 flex-grow">
        {category && (
          <Badge variant="secondary" className="w-fit">
            {category}
          </Badge>
        )}
        <Link to={`/post/${_id}`} className="block">
          <h2 className="text-2xl font-bold leading-tight text-primary hover:underline line-clamp-2">{title}</h2>
        </Link>
        <p className="line-clamp-3 text-muted-foreground">{summary}</p>
      </CardHeader>
      <CardFooter className="flex flex-col space-y-4 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${author.username}`} alt={author.username} />
              <AvatarFallback>{author.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Link to={`/author/${author.username}`} className="text-sm font-medium text-primary hover:underline">
              {author.username}
            </Link>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {readTime && (
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{readTime} min read</span>
              </div>
            )}
            {commentCount !== undefined && (
              <div className="flex items-center">
                <MessageCircle className="mr-1 h-4 w-4" />
                <span>{commentCount}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-4 w-4" />
            <time dateTime={createdAt}>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</time>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/post/${_id}`}>Read More</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}