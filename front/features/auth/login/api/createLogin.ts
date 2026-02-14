import { createLogin as createLoginApi } from "@/shared/api/fetchData";
import { NewLogin } from "@/schemas/user.schema";

export const createLogin = (postData: NewLogin) => {
  return createLoginApi(postData);
};
