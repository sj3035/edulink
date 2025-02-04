import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  file_url: string | null;
};

export const ForumsList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newReply, setNewReply] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:forum_posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'forum_posts' },
        (payload) => {
          setPosts((currentPosts) => [...currentPosts, payload.new as Post]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleReply = async (postId: string) => {
    if (!newReply.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a reply.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert([{
          title: 'Reply',
          content: newReply,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      setNewReply("");
      toast({
        title: "Success!",
        description: "Your reply has been posted.",
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post reply. Please try again.",
      });
    }
  };

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/40?u=${post.user_id}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {post.content}
                  </p>
                  {post.file_url && (
                    <div className="mt-2">
                      {post.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img 
                          src={post.file_url} 
                          alt="Post attachment" 
                          className="max-w-xs rounded-lg"
                        />
                      ) : (
                        <a 
                          href={post.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Attachment
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Input
              placeholder="Write a reply..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="mr-4"
            />
            <Button onClick={() => handleReply(post.id)}>Reply</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};