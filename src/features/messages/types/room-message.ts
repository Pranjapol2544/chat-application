export interface RoomMessage {
  id: string;
  roomId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
  };
}
