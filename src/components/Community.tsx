import { useState } from "react";
import { Users, MessageSquare, Lock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "./ui/use-toast";

export const Community = () => {
  const [activeTab, setActiveTab] = useState<"forums" | "chats">("forums");
  const [requestedChats, setRequestedChats] = useState<number[]>([]);
  const [acceptedChats, setAcceptedChats] = useState<number[]>([]);
  const { toast } = useToast();

  const handleJoinChat = (chatId: number) => {
    if (!requestedChats.includes(chatId)) {
      setRequestedChats([...requestedChats, chatId]);
      toast({
        title: "Chat Request Sent",
        description: "Your request to join the chat has been sent to the moderators.",
      });
    }
  };

  // Simulate admin accepting request (in real app this would come from backend)
  const simulateAcceptRequest = (chatId: number) => {
    setRequestedChats(requestedChats.filter(id => id !== chatId));
    setAcceptedChats([...acceptedChats, chatId]);
    toast({
      title: "Request Accepted",
      description: "You can now join the chat group!",
    });
  };

  // ... keep existing code (forums section)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Community</h2>
        <Users className="h-8 w-8 text-primary" />
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === "forums" ? "default" : "outline"}
          onClick={() => setActiveTab("forums")}
        >
          Forums
        </Button>
        <Button
          variant={activeTab === "chats" ? "default" : "outline"}
          onClick={() => setActiveTab("chats")}
        >
          Group Chats
        </Button>
      </div>

      {activeTab === "forums" ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mathematics Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((post) => (
                  <div key={post} className="flex gap-4 items-start">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/40?img=${post}`} />
                      <AvatarFallback>U{post}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">User {post}</p>
                      <p className="text-sm text-muted-foreground">
                        Sample forum post content...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Input placeholder="Write a reply..." className="mr-4" />
              <Button>Post</Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((chat) => (
            <Card key={chat}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Study Group {chat}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  A secure chat group for focused study discussions.
                </p>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((user) => (
                    <Avatar key={user} className="border-2 border-background">
                      <AvatarImage
                        src={`https://i.pravatar.cc/40?img=${user + chat}`}
                      />
                      <AvatarFallback>U{user}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                {acceptedChats.includes(chat) ? (
                  <Button onClick={() => {}} className="w-full bg-green-500 hover:bg-green-600">
                    Join Chat
                  </Button>
                ) : requestedChats.includes(chat) ? (
                  <Button variant="outline" className="w-full" disabled>
                    Requested
                  </Button>
                ) : (
                  <Button onClick={() => handleJoinChat(chat)} className="w-full">
                    Request to Join
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
