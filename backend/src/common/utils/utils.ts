import { z } from 'zod';

export function isStringInArrayCaseInsensitive(
  str: string,
  arr: string[],
): boolean {
  return arr.some((item) => item.toLowerCase() === str.toLowerCase());
}

type EnumLike = {
  [k: string]: string | number;
  [nu: number]: string;
};

export const zCoercedEnum = <T extends EnumLike>(e: T) =>
  z.preprocess((val) => {
    const target = String(val)?.toLowerCase();
    for (const key in Object.values(e)) {
      if (String(key)?.toLowerCase() === target) {
        return key;
      }
    }
    return null;
  }, z.nativeEnum(e));
