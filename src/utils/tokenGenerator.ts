import crypto from 'crypto';

export function generateRandomString (length: number) {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex') // Convert to hexadecimal format
      .slice(0, length); // Return required number of characters
};