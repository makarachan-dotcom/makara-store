import * as jose from "jose";
import { env } from "./lib/env";

const SECRET = new TextEncoder().encode(env.jwtSecret);

export async function signSessionToken(payload: { unionId?: string; userId?: number; email?: string; role?: string }) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET, { clockTolerance: 60 });
    return payload as { unionId?: string; userId?: number; email?: string; role?: string };
  } catch {
    return null;
  }
}
