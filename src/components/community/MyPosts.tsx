import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { supabase } from "@/integrations/supabase/client";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  file_url: string | null;
};

export const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching my posts:', error);
        return;
      }

      setPosts(data || []);
    };

    fetchMyPosts();
  }, []);

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{post.content}</p>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};