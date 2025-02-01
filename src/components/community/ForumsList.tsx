import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const ForumsList = () => {
  return (
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
  );
};