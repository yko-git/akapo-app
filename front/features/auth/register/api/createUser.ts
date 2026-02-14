import { createUser as createUserApi } from "@/shared/api/fetchData";
import { NewUser } from "@/schemas/user.schema";

export const createUser = (file: File, userData: NewUser) => {
  return createUserApi(file, userData);
};
