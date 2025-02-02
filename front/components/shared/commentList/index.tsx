import { CommentProps } from "@/api/fetchData";

interface CommentListProps {
  comments: CommentProps[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className="my-5">
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="bg-white py-2 px-4 my-3">
            <h3>{comment.userId}</h3>
            {comment.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
