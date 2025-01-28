import { useState } from "react";
import { Trophy, Target, BarChart, Award } from "lucide-react";
import { Progress } from "./ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

export const ProgressTracking = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: "Complete Math Module", progress: 75 },
    { id: 2, title: "Physics Study Group", progress: 45 },
    { id: 3, title: "Programming Project", progress: 90 },
  ]);
  const [newGoal, setNewGoal] = useState("");
  const { toast } = useToast();

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { id: goals.length + 1, title: newGoal, progress: 0 }]);
      setNewGoal("");
      toast({
        title: "Goal Added",
        description: "Your new goal has been added successfully.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Progress Tracking</h2>
        <Trophy className="h-8 w-8 text-primary" />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Set New Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter your new goal"
              className="flex-1"
            />
            <Button onClick={addGoal}>Add Goal</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{goal.title}</span>
                  {goal.progress === 100 && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={goal.progress} />
                <p className="text-sm text-muted-foreground text-right">
                  {goal.progress}% Complete
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};