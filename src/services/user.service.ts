import type { User } from "../types/user";

const API_URL = "http://localhost:3000/users";

export async function getUsers(): Promise<User[]> {
  const res = await fetch(API_URL);
  return await res.json();
}
