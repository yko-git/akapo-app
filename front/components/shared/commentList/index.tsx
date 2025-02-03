import { CommentProps } from "@/api/fetchData";
import Image from "next/image";

interface CommentListProps {
  comments: CommentProps[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className="my-5">
      <ul>
        {comments.map((comment: CommentProps) => (
          <li key={comment.id} className="my-3 flex items-center">
            <div className="inline-block text-center">
              <Image
                className="inline-block mr-2 rounded-full object-cover w-[50px] h-[50px] border-[#6C9FE0] border-4"
                src={comment.user.iconSignedUrl}
                alt=""
                width={50}
                height={50}
                loading="lazy"
              />
              <p className="text-[12px] mt-1">{comment.user.name}</p>
            </div>
            <div className="bg-white py-3 px-4 w-full rounded-md ml-3">
              {comment.body}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
