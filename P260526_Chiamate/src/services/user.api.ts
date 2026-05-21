import { delay } from "../utils/delay.utils";
import type { UserApiResponse } from "../model/user.type";

const LIST_OF_USERS: UserApiResponse[] = [
  {
    id: 1,
    first_name: "Mario",
    email: "mario@email.com",
  },
  {
    id: 2,
    first_name: "Luigi",
    email: "luigi@email.com",
  },
  {
    id: 3,
    first_name: "Peach",
    email: "peach@email.com",
  },
];

function getRandomDelay(): number {
  return Math.floor(Math.random() * 2000) + 1000;
}

function shouldSimulateError(): boolean {
  return Math.random() < 0.05;
}

function shouldSimulateEmptyList(): boolean {
  return Math.random() < 0.05;
}

export async function fetchMockUsers(): Promise<UserApiResponse[]> {
  const randomDelay = getRandomDelay();

  await delay(randomDelay);

  if (shouldSimulateError()) {
    throw new Error("Richiesta fallita");
  }

  if (shouldSimulateEmptyList()) {
    return [];
  }

  return LIST_OF_USERS;
}