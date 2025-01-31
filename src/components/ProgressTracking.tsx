import { useState } from "react";
import { Trophy, Target, Award, History, Plus } from "lucide-react";
import { Progress } from "./ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
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

  const updateProgress = (goalId: number, increment: number) => {
    const updatedGoals = activeGoals.map((goal) => {
      if (goal.id === goalId) {
        const newProgress = Math.min(100, Math.max(0, goal.progress + increment));
        if (newProgress === 100) {
          const completedGoal = { ...goal, progress: 100, completedAt: new Date() };
          setCompletedGoals([...completedGoals, completedGoal]);
          toast({
            title: "Goal Completed! 🎉",
            description: "Congratulations on completing your goal!",
          });
          return null;
        }
        return { ...goal, progress: newProgress };
      }
      return goal;
    });

    setActiveGoals(updatedGoals.filter((goal): goal is Goal => goal !== null));
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

      {activeGoals.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first goal and track your progress!
            </p>
            <Button onClick={() => document.getElementById('newGoalInput')?.focus()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Set New Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            id="newGoalInput"
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
          <Card key={goal.id} className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{goal.title}</span>
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{goal.progress}%</span>
                  </div>
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      className="text-gray-200"
                      strokeWidth="5"
                      stroke="currentColor"
                      fill="transparent"
                      r="30"
                      cx="32"
                      cy="32"
                    />
                    <circle
                      className="text-primary"
                      strokeWidth="5"
                      strokeDasharray={188.5}
                      strokeDashoffset={188.5 - (188.5 * goal.progress) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="30"
                      cx="32"
                      cy="32"
                    />
                  </svg>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => updateProgress(goal.id, -10)}
                  className="w-20"
                >
                  -10%
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateProgress(goal.id, 10)}
                  className="w-20"
                >
                  +10%
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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