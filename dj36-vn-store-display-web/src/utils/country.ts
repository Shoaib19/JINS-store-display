import { COUNTRY_CODE } from "../constants/common";

export const isValidCountryCode = (code: string): boolean => {
  if (code === COUNTRY_CODE) return true;
  console.warn("Invalid country code:", code);
  return false;
};
