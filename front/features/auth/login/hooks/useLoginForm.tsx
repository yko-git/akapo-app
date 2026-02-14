import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewLogin, NewLoginSchema } from "@/schemas/user.schema";

// ログインフォーム用のカスタムフック
export const useLoginForm = (defaultValues?: Partial<NewLogin>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewLogin>({
    resolver: zodResolver(NewLoginSchema),
    mode: "onBlur",
    defaultValues: defaultValues || {
      loginId: "",
      password: "",
    },
  });

  return { register, handleSubmit, errors, reset };
};
