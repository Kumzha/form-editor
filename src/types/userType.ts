export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  grant_types: GrantType[]; // now each grant type must be of type GrantType
  user_type: string;
  organisation_name: string;
  organisation_description: string;
  list_of_file_names: string[];
}

export const GRANT_TYPE_OPTIONS = [
  "Erasmus+",
  "Horizon Europe",
  "Creative Europe",
  "LIFE Programme",
  "Digital Europe",
] as const;

export type GrantType = (typeof GRANT_TYPE_OPTIONS)[number] | string;
