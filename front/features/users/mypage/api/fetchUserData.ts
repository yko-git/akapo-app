import { fetchUserData as fetchUserDataApi } from "@/shared/api/fetchData";
import { UserProfile } from "@/shared/types";

export const fetchUserData = (): Promise<UserProfile | null> => {
  return fetchUserDataApi();
};
