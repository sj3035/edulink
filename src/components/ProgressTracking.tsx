import { useState } from "react";
import { Trophy, Target, BarChart, Award, History } from "lucide-react";
import { Progress } from "./ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Goal {
  id: number;
  title: string;
  progress: number;
  completedAt?: Date;
}

export const ProgressTracking = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([
    { id: 1, title: "Complete Math Module", progress: 75 },
    { id: 2, title: "Physics Study Group", progress: 45 },
    { id: 3, title: "Programming Project", progress: 90 },
  ]);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const { toast } = useToast();

  const addGoal = () => {
    if (newGoal.trim()) {
      setActiveGoals([
        ...activeGoals,
        { id: Date.now(), title: newGoal, progress: 0 },
      ]);
      setNewGoal("");
      toast({
        title: "Goal Added",
        description: "Your new goal has been added successfully.",
      });
    }
  };

  const updateProgress = (goalId: number, newProgress: number) => {
    const updatedGoals = activeGoals.map((goal) => {
      if (goal.id === goalId) {
        if (newProgress === 100) {
          const completedGoal = { ...goal, progress: 100, completedAt: new Date() };
          setCompletedGoals([...completedGoals, completedGoal]);
          return null;
        }
        return { ...goal, progress: newProgress };
      }
      return goal;
    });

    setActiveGoals(updatedGoals.filter((goal): goal is Goal => goal !== null));

    if (newProgress === 100) {
      toast({
        title: "Goal Completed! 🎉",
        description: "Congratulations on completing your goal!",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Progress Tracking</h2>
        <div className="flex gap-4">
          <Trophy className="h-8 w-8 text-primary" />
          <Button
            variant="outline"
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            View History
          </Button>
        </div>
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
          {activeGoals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{goal.title}</span>
                  {goal.progress === 100 && (
                    <Award className="h-5 w-5 text-yellow-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={goal.progress} />
                <div className="flex items-center gap-4">
                  <Slider
                    value={[goal.progress]}
                    onValueChange={(value) => updateProgress(goal.id, value[0])}
                    max={100}
                    step={5}
                  />
                  <span className="text-sm text-muted-foreground min-w-[3rem]">
                    {goal.progress}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Completed Goals History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{goal.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Completed on:{" "}
                      {goal.completedAt?.toLocaleDateString()}
                    </p>
                  </div>
                  <Award className="h-5 w-5 text-yellow-500" />
                </CardContent>
              </Card>
            ))}
            {completedGoals.length === 0 && (
              <p className="text-center text-muted-foreground">
                No completed goals yet. Keep working towards your goals!
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};