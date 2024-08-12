import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Secret key for encoding/decoding
const SECRET_KEY = 'sample-emt-key';

// Convert a numeric ID to a UUID-like string using HMAC
export function idToUuid(id: number): string {
  const uuid = uuidv4();
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(id.toString());
  const idHash = hmac.digest('hex').slice(0, 8);
  return uuid.replace(/^[0-9a-f]{8}/, idHash);
}

// Convert a UUID-like string back to a numeric ID (requires secret key)
export function uuidToId(uuid: string | string[] | undefined): number | null {
  // Ensure that uuid is a string
  const uuidStr = Array.isArray(uuid) ? uuid[0] : uuid;

  // Check if uuidStr is actually a string
  if (typeof uuidStr !== 'string') {
    return null;
  }

  if (uuid !== undefined) {
      const idHash = uuid.slice(0, 8);
      for (let i = 0; i < 1000000; i++) {
        const hmac = crypto.createHmac('sha256', SECRET_KEY);
        hmac.update(i.toString());
        const testHash = hmac.digest('hex').slice(0, 8);
        if (testHash === idHash) {
          return i;
        }
      }
  }
  return null;
}
