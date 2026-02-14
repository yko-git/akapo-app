"use client";
import { deleteComments } from "@/api/fetchData";
import { useCommentStore } from "@/stores/useCommentStore";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";
import { CommentListProps } from "@/types";

export default function CommentsList({ postUserId, postId }: CommentListProps) {
  const { comments, removeComment } = useCommentStore();
  const { userProfile } = useAuthStore();

  const handleDelete = async (commentId: number) => {
    const confirm = window.confirm("コメントを削除しますか？");
    if (!confirm) return;

    try {
      await deleteComments({ commentId, postId });
      removeComment(commentId);
      toast.success("コメントを削除しました");
    } catch (error) {
      toast.error("コメントの削除に失敗しました");
    }
  };

  // 空チェック
  if (!comments || comments.length === 0) {
    return (
      <div className="mt-20">
        <p className="text-center font-bold tracking-wider">
          コメントをとうこうしてね
        </p>
      </div>
    );
  }

  return (
    <div className="my-10">
      <ul>
        {comments.map((comment) => {
          const isOwn = comment.userId === postUserId;
          const userComment = comment.userId === userProfile?.id;

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
                  className={`py-5 px-4 border-2 border-[#6C9FE0] shadow-md rounded-md bg-white font-bold md:text-center text-sm tracking-widest whitespace-pre-wrap ${
                    isOwn ? "md:mr-auto" : "md:ml-auto"
                  }`}
                >
                  {comment.body}
                  {comments && (
                    <div
                      className="absolute right-2 bottom-2 p-1 border-1 border border-gray-300"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 122.878 122.88"
                        className="fill-current text-gray-500"
                      >
                        <g>
                          <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z" />
                        </g>
                      </svg>
                    </div>
                  )}
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
