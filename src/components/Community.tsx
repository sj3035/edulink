import { useState } from "react";
import { Users, MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ForumsList } from "./community/ForumsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Community = () => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in both title and content.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert([{ title, content }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been created.",
      });
      
      setIsCreatingPost(false);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-primary">Community Forum</h2>
          <Users className="h-8 w-8 text-primary" />
        </div>
        <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
          <DialogTrigger asChild>
            <Button className="bg-purple-500 hover:bg-purple-600">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a New Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreatingPost(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Post</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">Recent Discussions</h3>
        </div>
        <ForumsList />
      </div>
    </div>
  );
};