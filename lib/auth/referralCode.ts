import { customAlphabet } from "nanoid";

// No 0/O/1/I — avoids ambiguity when someone reads or types a code by hand.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const generate = customAlphabet(ALPHABET, 8);

export function generateReferralCode(): string {
  return generate();
}
