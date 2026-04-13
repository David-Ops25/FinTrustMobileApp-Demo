import { DEMO_PASSWORD, DEMO_USERNAME } from '../constants/demoCredentials';

type AuthResult = {
  token: string;
  expiresAt: number;
  user: { name: string; email: string };
};

export async function authenticateDemoUser(username: string, password: string): Promise<AuthResult> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const normalizedUsername = username.trim();
  const normalizedPassword = password.trim();
  if (normalizedUsername !== DEMO_USERNAME || normalizedPassword !== DEMO_PASSWORD) {
    throw new Error('Invalid demo credentials. Use the hint shown on screen.');
  }

  const encodedPayload = encodeURIComponent(`${normalizedUsername}:${Date.now()}`);
  return {
    token: `demo-jwt.${encodedPayload}.signature`,
    expiresAt: Date.now() + 10 * 60 * 1000,
    user: { name: 'Alex Morgan', email: 'alex.morgan@fintrust.demo' },
  };
}
