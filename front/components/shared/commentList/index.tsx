import { CommentProps } from "@/api/fetchData";

interface CommentListProps {
  comments: CommentProps[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>{comment.content}</li>
      ))}
    </ul>
  );
}
