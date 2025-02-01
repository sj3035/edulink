import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Lock } from "lucide-react";

interface ChatRoom {
  id: string;
  name: string;
  subjects: string[];
  learning_style: string;
  compatibility_score: number;
}

interface ChatRoomCardProps {
  chatRoom: ChatRoom;
  status: "none" | "pending" | "accepted";
  onJoinRequest: (chatRoomId: string) => void;
  onOpenChat: (chatRoomId: string) => void;
}

export const ChatRoomCard = ({
  chatRoom,
  status,
  onJoinRequest,
  onOpenChat,
}: ChatRoomCardProps) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          {chatRoom.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          A secure chat group for focused study discussions.
          {chatRoom.compatibility_score && (
            <span className="ml-2 text-primary font-medium">
              {chatRoom.compatibility_score}% Match
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {chatRoom.subjects.map((subject, index) => (
            <span
              key={index}
              className="bg-secondary text-primary px-2 py-1 rounded-full text-sm"
            >
              {subject}
            </span>
          ))}
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((user) => (
            <Avatar key={user} className="border-2 border-background">
              <AvatarImage src={`https://i.pravatar.cc/40?img=${user}`} />
              <AvatarFallback>U{user}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {status === "accepted" ? (
          <Button
            onClick={() => onOpenChat(chatRoom.id)}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Open Chat
          </Button>
        ) : status === "pending" ? (
          <Button variant="outline" className="w-full" disabled>
            Request Pending
          </Button>
        ) : (
          <Button
            onClick={() => onJoinRequest(chatRoom.id)}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Request to Join
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};