import { jwtVerify, SignJWT } from "jose";

type JwtPayload = {
  userId: string;
  email: string;
};

// Next.js Edge runtime (which Middleware uses) requires standard Web Crypto API.
// "jose" handles this automatically if we pass encoded secrets.
const getAccessSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || "fallback_access_secret_for_dev_only");
const getRefreshSecret = () => new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_for_dev_only");

export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getAccessSecret());
}

export async function signRefreshToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getRefreshSecret());
}

export async function verifyAccessToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret());
    return payload as JwtPayload;
  } catch (error) {
    return null; // Invalid, expired, etc.
  }
}

export async function verifyRefreshToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret());
    return payload as JwtPayload;
  } catch (error) {
    return null;
  }
}
