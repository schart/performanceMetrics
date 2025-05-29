import { parse, isValid } from "date-fns";

export const parseDate = (input: string): Date | null => {
  const date = parse(input);
  return isValid(date) ? date : null;
};
//
