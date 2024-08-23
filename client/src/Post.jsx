import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({_id, title, summary, cover, createdAt, author }) {

  return (
    <div className="card flex flex-col md:flex-row items-start gap-6 shadow-dark hover:shadow-lg transition-shadow duration-300">
      <div className="md:w-1/3 w-full">
        <Link to={`/post/${_id}`}>
          <img
            src={cover}
            alt={title}
            onError={(e) => e.target.src = '/path/to/placeholder-image.png'}
            className="w-full h-48 md:h-full object-cover rounded-lg"
          />
        </Link>
      </div>
      <div className="card-body flex flex-col justify-between md:w-2/3 w-full">
        <div>
          <Link to={`/post/${_id}`}>
            <h2 className="card-header text-2xl md:text-xl font-bold">{title}</h2>
          </Link>
          <p className="text-sm text-gray-500 mt-2">
           <Link to={`/author/${author.username}`} className="author">{author.username}</Link>
          <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="text-gray-300 mt-4">{summary}</p>
        </div>
      </div>
    </div>
  );
}
