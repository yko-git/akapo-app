import { jost } from "@/components/shared/font";
import CommentList from "../commentList";
import { CommentProps } from "@/api/fetchData";

interface CommentsProps {
  comments: CommentProps[];
}

export default function Comment({ comments }: CommentsProps) {
  return (
    <>
      <div className="py-20 text-center bg-[#F5F8FD] -mt-8">
        <div className="wrapper">
          <h2
            className={`${jost.className} jost text-[#6C9FE0] tracking-[.2rem] font-bold`}
          >
            COMMENTS
          </h2>
          <CommentList comments={comments} />
        </div>
      </div>
    </>
  );
}
