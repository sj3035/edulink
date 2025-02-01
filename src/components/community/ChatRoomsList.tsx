import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatRoomCard } from "./ChatRoomCard";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "../ui/button";

interface ChatRoom {
  id: string;
  name: string;
  subjects: string[];
  learning_style: string;
  compatibility_score: number;
}

export const ChatRoomsList = ({
  onOpenChat,
}: {
  onOpenChat: (chatRoomId: string) => void;
}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [requestedChats, setRequestedChats] = useState<string[]>([]);
  const [acceptedChats, setAcceptedChats] = useState<string[]>([]);
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

  const handleJoinRequest = async (chatRoomId: string) => {
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
      chat_room_id: chatRoomId,
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

    setRequestedChats([...requestedChats, chatRoomId]);
    toast({
      title: "Success",
      description: "Your request to join the chat has been sent.",
    });
  };

  if (chatRooms.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Chat Rooms Available
        </h3>
        <p className="text-gray-500 mb-4">
          There are currently no chat rooms. Check back later or create one.
        </p>
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Chat Room
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {chatRooms.map((chatRoom) => (
        <ChatRoomCard
          key={chatRoom.id}
          chatRoom={chatRoom}
          status={
            acceptedChats.includes(chatRoom.id)
              ? "accepted"
              : requestedChats.includes(chatRoom.id)
              ? "pending"
              : "none"
          }
          onJoinRequest={handleJoinRequest}
          onOpenChat={onOpenChat}
        />
      ))}
    </div>
  );
};