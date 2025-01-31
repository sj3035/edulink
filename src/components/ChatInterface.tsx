import { useState, useEffect, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  file_url?: string;
  created_at: string;
}

interface ChatInterfaceProps {
  chatRoomId: string;
  onClose: () => void;
}

export const ChatInterface = ({ chatRoomId, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [chatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("chat_room_id", chatRoomId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setMessages(data || []);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from("chat_messages").insert({
      chat_room_id: chatRoomId,
      content: newMessage,
    });

    if (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("chat_files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("chat_files")
        .getPublicUrl(filePath);

      await supabase.from("chat_messages").insert({
        chat_room_id: chatRoomId,
        content: `Shared a file: ${file.name}`,
        file_url: urlData.publicUrl,
      });

      toast({
        title: "File uploaded successfully",
        description: "Your file has been shared in the chat.",
      });
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Chat Room</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-start gap-3"
            >
              <Avatar>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="text-sm">{message.content}</p>
                  {message.file_url && (
                    <a
                      href={message.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm mt-2 block"
                    >
                      Download attached file
                    </a>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={isUploading}
          >
            <label className="cursor-pointer">
              <Paperclip className="h-5 w-5" />
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </Button>
          <Button
            onClick={handleSendMessage}
            className="shrink-0"
            disabled={!newMessage.trim() || isUploading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};