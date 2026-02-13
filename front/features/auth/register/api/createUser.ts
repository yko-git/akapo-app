import { createUser as createUserApi } from "@/api/fetchData";
import { NewUser } from "@/schemas/user.schema";

export const createUser = (file: File, userData: NewUser) => {
  return createUserApi(file, userData);
};
