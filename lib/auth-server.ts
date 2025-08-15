// Server-side authentication utilities
import { cookies } from 'next/headers';

// Get the auth token from cookies on the server side
export async function getServerAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    return accessToken;
  } catch (error) {
    console.error('Error getting server auth token:', error);
    return undefined;
  }
}