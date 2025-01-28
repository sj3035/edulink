import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { calendar, file, link, messageSquare, clock } from "lucide-react";
import { Badge } from "./ui/badge";

interface SchedulingAndResourcesProps {
  isOpen: boolean;
  onClose: () => void;
  matchName: string;
}

export const SchedulingAndResources = ({
  isOpen,
  onClose,
  matchName,
}: SchedulingAndResourcesProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleScheduleMeeting = () => {
    if (!date || !selectedTime) {
      toast({
        title: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Meeting Scheduled!",
      description: `Meeting scheduled with ${matchName} for ${date.toLocaleDateString()} at ${selectedTime}`,
    });
    onClose();
  };

  const handleShareResource = () => {
    if (!resourceUrl) {
      toast({
        title: "Please enter a resource URL",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Resource Shared!",
      description: `Resource has been shared with ${matchName}`,
    });
    setResourceUrl("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Connect with {matchName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Schedule Study Session</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-secondary/50">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Time
                  </label>
                  <div className="flex items-center gap-2">
                    <clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleScheduleMeeting}
                  className="w-full"
                  size="lg"
                >
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <file className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Share Resources</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <link className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Resource URL</label>
                </div>
                <Input
                  placeholder="Enter resource URL"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <messageSquare className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Notes</label>
                </div>
                <Textarea
                  placeholder="Add notes about this resource..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={handleShareResource} className="w-full" size="lg">
                Share Resource
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Badge variant="secondary" className="text-sm">
              All times are in your local timezone
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};