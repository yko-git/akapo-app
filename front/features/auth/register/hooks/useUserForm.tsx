import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewUser, NewUserSchema } from "@/schemas/user.schema";

// ユーザーフォーム用のカスタムフック
export const useUserForm = (defaultValues?: Partial<NewUser>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<NewUser>({
    resolver: zodResolver(NewUserSchema),
    mode: "onBlur",
    defaultValues: defaultValues || {
      loginId: "",
      name: "",
      password: "",
    },
  });

  return { register, handleSubmit, control, errors, reset };
};
