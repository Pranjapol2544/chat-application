export interface RoomSummary {
  id: string;
  name: string;
  memberCount: number;
  messageCount: number;
  lastMessageAt: string | null;
}
