import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "./ui/button";
import { ChatInterface } from "./ChatInterface";
import { ChatRoomsList } from "./community/ChatRoomsList";
import { ForumsList } from "./community/ForumsList";

export const Community = () => {
  const [activeTab, setActiveTab] = useState<"forums" | "chats">("forums");
  const [activeChatRoom, setActiveChatRoom] = useState<string | null>(null);

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
          className={
            activeTab === "forums" ? "bg-purple-500 hover:bg-purple-600" : ""
          }
        >
          Forums
        </Button>
        <Button
          variant={activeTab === "chats" ? "default" : "outline"}
          onClick={() => setActiveTab("chats")}
          className={
            activeTab === "chats" ? "bg-purple-500 hover:bg-purple-600" : ""
          }
        >
          Group Chats
        </Button>
      </div>

      {activeTab === "forums" ? (
        <ForumsList />
      ) : (
        <ChatRoomsList onOpenChat={setActiveChatRoom} />
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