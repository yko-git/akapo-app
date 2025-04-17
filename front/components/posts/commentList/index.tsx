import { Comment } from "@/api/fetchData";
import Image from "next/image";

interface CommentListProps {
  comments: Comment[];
  postUserId: number;
}

export default function CommentList({
  comments,
  postUserId,
}: CommentListProps) {
  console.log(comments);
  return (
    <div className="my-10">
      <ul>
        {comments.map((comment) => {
          const isOwn = comment.userId === postUserId;
          return (
            <li
              key={comment.id}
              className={`md:my-4 my-8 md:flex items-center ${
                isOwn ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="inline-block text-center md:w-auto w-full shrink-0 md:mb-0 mb-5">
                <Image
                  className="inline-block mr-2 rounded-full object-cover w-[90px] h-[90px] border-[#6C9FE0] border-4"
                  src={comment.user.iconSignedUrl}
                  alt={comment.user.name}
                  width={90}
                  height={90}
                  loading="lazy"
                />
                <p className="text-[12px] mt-1">{comment.user.name}</p>
              </div>

              <div
                className={`relative md:min-w-[450px] mb-5 ${
                  isOwn ? "md:ml-8" : "md:mr-8"
                }`}
              >
                <div
                  className={`absolute top-1/2 w-0 h-0 border-t-[transparent] border-b-[transparent] md:border-[9px] transform -translate-y-1/2 ${
                    isOwn
                      ? "-left-4 border-r-[#6c9fe0] border-l-[transparent]"
                      : "-right-4 border-r-[transparent] border-l-[#6c9fe0]"
                  }`}
                />
                <div
                  className={`py-5 px-4 border-2 border-[#6C9FE0] shadow-md rounded-md bg-white font-bold md:text-center text-sm tracking-widest ${
                    isOwn ? "md:mr-auto" : "md:ml-auto"
                  }`}
                >
                  {comment.body}
                </div>
                <div
                  className={`absolute top-1/2 md:inline-block hidden border-solid ${
                    isOwn
                      ? "-left-4 [transform:translate(9px,-50%)] [border-color:transparent_#fff_transparent_transparent] [border-width:6px_7px_6px_2px]"
                      : "-right-4 [transform:translate(-9px,-50%)] [border-color:transparent_transparent_transparent_#fff] [border-width:6px_2px_6px_7px]"
                  }`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
