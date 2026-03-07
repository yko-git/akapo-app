import { createUser as createUserApi } from "@/shared/api/fetchData";
import { NewUser } from "@/shared/schemas";

export const createUser = (file: File, userData: NewUser) => {
  return createUserApi(file, userData);
};
