import { useState } from "react";
import { Users, MessageSquare, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ForumsList } from "./community/ForumsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MyPosts } from "./community/MyPosts";

export const Community = () => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
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
      let fileUrl = null;
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('forum_attachments')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('forum_attachments')
          .getPublicUrl(fileName);
          
        fileUrl = publicUrl;
      }

      const { error } = await supabase
        .from('forum_posts')
        .insert([{ 
          title, 
          content,
          file_url: fileUrl,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been created.",
      });
      
      setIsCreatingPost(false);
      setTitle("");
      setContent("");
      setFile(null);
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
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
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

      <Tabs defaultValue="discussions" className="w-full">
        <TabsList>
          <TabsTrigger value="discussions">Recent Discussions</TabsTrigger>
          <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="discussions">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Recent Discussions</h3>
            </div>
            <ForumsList />
          </div>
        </TabsContent>
        <TabsContent value="my-posts">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold">My Posts</h3>
            </div>
            <MyPosts />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};