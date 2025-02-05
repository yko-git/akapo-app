import { CommentProps } from "@/api/fetchData";
import Image from "next/image";

interface CommentListProps {
  comments: CommentProps[];
  isOwn: boolean;
}

export default function CommentList({ comments, isOwn }: CommentListProps) {
  console.log(comments);
  return (
    <div className="my-5">
      <ul>
        {comments.map((comment: CommentProps) => (
          <li
            key={comment.id}
            className={`my-4 flex items-start ${
              isOwn ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div className="inline-block text-center mt-2">
              <Image
                className="inline-block mr-2 rounded-full object-cover w-[50px] h-[50px] border-[#6C9FE0] border-[3.5px]"
                src={comment.user.iconSignedUrl}
                alt=""
                width={50}
                height={50}
                loading="lazy"
              />
              <p className="text-[12px] mt-1">{comment.user.name}</p>
            </div>
            <div className="relative w-full">
              <div
                className={`absolute top-1/2 w-0 h-0 border-transparent border-[9px] transform -translate-y-1/2 ${
                  isOwn
                    ? "ml-1 left-0  border-r-white"
                    : "mr-1 right-0  border-l-white"
                }`}
              />
              <div
                className={`bg-white py-5 px-4 rounded-md shadow-sm ${
                  isOwn ? "ml-5" : "mr-5"
                }`}
              >
                {comment.body}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
