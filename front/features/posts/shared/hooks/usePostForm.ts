import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPost, NewPostSchema } from "@/shared/schemas";

// 投稿フォーム用のカスタムフック
export const usePostForm = (defaultValues?: Partial<NewPost>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<NewPost>({
    resolver: zodResolver(NewPostSchema),
    mode: "onBlur",
    defaultValues: defaultValues || {
      title: "",
      body: "",
      status: "0",
      categoryIds: [1],
    },
  });

  return { register, handleSubmit, control, errors, reset };
};
