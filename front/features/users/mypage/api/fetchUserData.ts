import { fetchUserData as fetchUserDataApi } from "@/api/fetchData";
import { UserProfile } from "@/types";

export const fetchUserData = (): Promise<UserProfile | null> => {
  return fetchUserDataApi();
};
