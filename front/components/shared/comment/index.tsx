import { jost } from "@/components/shared/font";
import CommentList from "../commentList";
import { CommentProps } from "@/api/fetchData";
import CreateComment from "../createComment";

interface CommentsProps {
  comments: CommentProps[];
  postId: number;
}

export default function Comment({ comments, postId }: CommentsProps) {
  return (
    <>
      <div className="py-20 text-center bg-[#F5F8FD] -mt-8">
        <div className="wrapper">
          <h2
            className={`${jost.className} jost text-[#6C9FE0] tracking-[.2rem] font-bold`}
          >
            COMMENTS
          </h2>
          <div className="text-left">
            <CommentList comments={comments} />
            <CreateComment postId={postId} />
          </div>
        </div>
      </div>
    </>
  );
}
