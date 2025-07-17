export interface ActiveSession {
  userId: number;
  username: string;
  sessions: Session[];
}

export interface Session {
  sessionId: number;
  expiry: string;
  createdAt: string;
}
