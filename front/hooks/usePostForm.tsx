import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPost, NewPostSchema } from "@/schemas/post.schema";
// 投稿フォーム用のカスタムフック
export const usePostForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPost>({
    resolver: zodResolver(NewPostSchema),
  });

  // dataはhandleSubmitがバリデーションを通過した後の値
  const onSubmit = (data: NewPost) => {
    console.log(data);
  };

  return { register, onSubmit: handleSubmit(onSubmit), errors };
};
