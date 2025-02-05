import { CommentProps } from "@/api/fetchData";
import Image from "next/image";

interface CommentListProps {
  comments: CommentProps[];
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
              className={`my-4 flex items-start ${
                isOwn ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="inline-block text-center mt-2">
                <Image
                  className="inline-block mr-2 rounded-full object-cover w-[50px] h-[50px] border-[#6C9FE0] border-4"
                  src={comment.user.iconSignedUrl}
                  alt={comment.user.name}
                  width={50}
                  height={50}
                  loading="lazy"
                />
                <p className="text-[12px] mt-1">{comment.user.name}</p>
              </div>

              <div className={`relative w-full ${isOwn ? "ml-8" : "mr-8"}`}>
                <div
                  className={`absolute top-1/2 w-0 h-0 border-transparent border-[9px] transform -translate-y-1/2 ${
                    isOwn ? "-left-4 border-r-white" : "-right-4 border-l-white"
                  }`}
                />
                <div
                  className={`py-5 px-4 rounded-md shadow-sm bg-white tracking-widest ${
                    isOwn ? "mr-auto" : "ml-auto text-right"
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
