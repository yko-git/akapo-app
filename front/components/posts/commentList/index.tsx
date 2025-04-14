import { Comment } from "@/api/fetchData";
import Image from "next/image";

interface CommentListProps {
  comments: Comment[];
  id: number;
}

export default function CommentList({ comments, id }: CommentListProps) {
  return (
    <div className="my-10">
      <ul>
        {comments.map((comment) => {
          const isOwn = comment.user.id === id;

          return (
            <li
              key={comment.id}
              className={`md:my-4 my-8 md:flex items-start ${
                isOwn ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="inline-block text-center md:w-auto w-full">
                <Image
                  className="inline-block mr-2 rounded-full object-cover w-[65px] h-[65px] border-[#6C9FE0] border-2"
                  src={comment.user.iconSignedUrl}
                  alt={comment.user.name}
                  width={65}
                  height={65}
                  loading="lazy"
                />
                <p className="text-[12px] mt-1">{comment.user.name}</p>
              </div>

              <div
                className={`relative w-full ${isOwn ? "md:ml-8" : "md:mr-8"}`}
              >
                <div
                  className={`absolute top-1/2 w-0 h-0 border-transparent md:border-[9px] transform -translate-y-1/2 ${
                    isOwn ? "-left-4 border-r-white" : "-right-4 border-l-white"
                  }`}
                />
                <div
                  className={`py-5 px-4 rounded-md shadow-sm bg-white tracking-widest ${
                    isOwn ? "md:mr-auto" : "md:ml-auto md:text-right"
                  }`}
                >
                  {comment.body}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
