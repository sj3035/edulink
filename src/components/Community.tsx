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
import { useToast } from "@/hooks/use-toast";
import { ChatInterface } from "./ChatInterface";
import { supabase } from "@/integrations/supabase/client";

export const Community = () => {
  const [activeTab, setActiveTab] = useState<"forums" | "chats">("forums");
  const [requestedChats, setRequestedChats] = useState<string[]>([]);
  const [acceptedChats, setAcceptedChats] = useState<string[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);
  const { toast } = useToast();

  const handleJoinChat = async (chatId: string) => {
    if (!requestedChats.includes(chatId)) {
      const { error } = await supabase.from("chat_room_members").insert({
        chat_room_id: chatId,
        status: "pending",
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to send join request",
          variant: "destructive",
        });
        return;
      }

      setRequestedChats([...requestedChats, chatId]);
      toast({
        title: "Chat Request Sent",
        description:
          "Your request to join the chat has been sent to the moderators.",
      });

      await supabase.from("notifications").insert({
        title: "New Chat Join Request",
        content: `A user has requested to join Study Group ${chatId}`,
        type: "chat_request",
      });
    }
  };

  const handleAcceptRequest = async (chatId: string) => {
    const { error } = await supabase
      .from("chat_room_members")
      .update({ status: "accepted" })
      .eq("chat_room_id", chatId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
      return;
    }

    setRequestedChats(requestedChats.filter((id) => id !== chatId));
    setAcceptedChats([...acceptedChats, chatId]);
    toast({
      title: "Request Accepted",
      description: "You can now join the chat group!",
    });
  };

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
          {["1", "2", "3", "4"].map((chatId) => (
            <Card key={chatId}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Study Group {chatId}
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
                        src={`https://i.pravatar.cc/40?img=${user + Number(chatId)}`}
                      />
                      <AvatarFallback>U{user}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                {acceptedChats.includes(chatId) ? (
                  <Button
                    onClick={() => setActiveChatRoom(chatId)}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    Open Chat
                  </Button>
                ) : requestedChats.includes(chatId) ? (
                  <Button variant="outline" className="w-full" disabled>
                    Requested
                  </Button>
                ) : (
                  <Button onClick={() => handleJoinChat(chatId)} className="w-full">
                    Request to Join
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {activeChatRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl">
            <ChatInterface
              chatRoomId={activeChatRoom}
              onClose={() => setActiveChatRoom(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};