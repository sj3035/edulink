import { useState, useEffect } from "react";
import { Users, MessageSquare, Lock, Plus } from "lucide-react";
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

interface ChatRoom {
  id: string;
  name: string;
  created_at: string;
}

export const Community = () => {
  const [activeTab, setActiveTab] = useState<"forums" | "chats">("forums");
  const [requestedChats, setRequestedChats] = useState<string[]>([]);
  const [acceptedChats, setAcceptedChats] = useState<string[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchChatRooms();
    fetchUserChatStatus();
  }, []);

  const fetchChatRooms = async () => {
    const { data, error } = await supabase
      .from("chat_rooms")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch chat rooms",
        variant: "destructive",
      });
      return;
    }

    setChatRooms(data || []);
  };

  const fetchUserChatStatus = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error } = await supabase
      .from("chat_room_members")
      .select("chat_room_id, status")
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Error fetching chat status:", error);
      return;
    }

    const requested = data
      .filter((member) => member.status === "pending")
      .map((member) => member.chat_room_id);
    const accepted = data
      .filter((member) => member.status === "accepted")
      .map((member) => member.chat_room_id);

    setRequestedChats(requested);
    setAcceptedChats(accepted);
  };

  const handleJoinChat = async (chatId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast({
        title: "Error",
        description: "You must be logged in to join a chat",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("chat_room_members").insert({
      chat_room_id: chatId,
      user_id: userData.user.id,
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
      title: "Success",
      description: "Your request to join the chat has been sent.",
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
          className={activeTab === "forums" ? "bg-purple-500 hover:bg-purple-600" : ""}
        >
          Forums
        </Button>
        <Button
          variant={activeTab === "chats" ? "default" : "outline"}
          onClick={() => setActiveTab("chats")}
          className={activeTab === "chats" ? "bg-purple-500 hover:bg-purple-600" : ""}
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
        <div className="space-y-6">
          {chatRooms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Chat Rooms Available</h3>
              <p className="text-gray-500 mb-4">There are currently no chat rooms. Check back later or create one.</p>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Chat Room
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {chatRooms.map((chatRoom) => (
                <Card key={chatRoom.id} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {chatRoom.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      A secure chat group for focused study discussions.
                    </p>
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
                    {acceptedChats.includes(chatRoom.id) ? (
                      <Button
                        onClick={() => setActiveChatRoom(chatRoom.id)}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        Open Chat
                      </Button>
                    ) : requestedChats.includes(chatRoom.id) ? (
                      <Button variant="outline" className="w-full" disabled>
                        Request Pending
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleJoinChat(chatRoom.id)} 
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        Request to Join
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
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