// useUserQuery.ts
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { BASE_URL } from "@/constants/constants";

interface UserData {
  id: string;
  email: string;
  name: string;
  last_name: string;
  grant_types: string[]; // updated from "grant_types:" - removed the accidental colon
  user_type: string;
  organisation_name: string;
  organisation_description: string;
  list_of_file_names: string[];
}

const fetchUser = async (): Promise<UserData> => {
  const token = Cookies.get("authToken");
  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return await response.json();
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });
};
