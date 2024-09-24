import { formatISO9075 } from 'date-fns'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader } from "../src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../src/components/ui/avatar"
import { CalendarIcon } from "lucide-react"

export default function Post({ _id, title, summary, cover, createdAt, author }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/post/${_id}`} className="block">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={cover}
            alt={title}
            onError={(e) => e.target.src = '/placeholder.svg?height=400&width=600'}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader>
        <Link to={`/post/${_id}`} className="block">
          <h2 className="text-2xl font-bold leading-tight text-primary hover:underline">{title}</h2>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="mt-2 line-clamp-3 text-muted-foreground">{summary}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${author.username}`} alt={author.username} />
            <AvatarFallback>{author.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Link to={`/author/${author.username}`} className="text-sm font-medium text-primary hover:underline">
            {author.username}
          </Link>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          <time dateTime={createdAt}>{formatISO9075(new Date(createdAt))}</time>
        </div>
      </CardFooter>
    </Card>
  )
}