
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  File, 
  Link, 
  MessageSquare, 
  Clock, 
  Upload, 
  Check,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "./ui/accordion";

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
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("schedule");
  const [isUrlValid, setIsUrlValid] = useState(true);
  const { toast } = useToast();

  // Validate URL when it changes
  useEffect(() => {
    if (!resourceUrl) {
      setIsUrlValid(true);
      return;
    }
    
    try {
      new URL(resourceUrl);
      setIsUrlValid(true);
    } catch {
      setIsUrlValid(false);
    }
  }, [resourceUrl]);

  const handleScheduleMeeting = () => {
    if (!date || !selectedTime) {
      toast({
        title: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Meeting Scheduled! 🎉",
      description: `Your study session with ${matchName} is set for ${date.toLocaleDateString()} at ${selectedTime}`,
      // We need to pass className as a style prop instead since our ToastProps doesn't properly handle classNames
      style: { background: 'linear-gradient(to bottom right, rgba(var(--primary), 0.1), rgba(var(--secondary), 0.1))', backdropFilter: 'blur(8px)', borderColor: 'rgba(var(--primary), 0.2)', borderWidth: '1px' }
    });
    
    // Show confetti animation
    showConfetti();
    
    setTimeout(() => {
      onClose();
      // Reset form
      setSelectedTime("");
    }, 1500);
  };

  const handleShareResource = () => {
    if (!resourceUrl && !resourceFile) {
      toast({
        title: "Please provide either a URL or upload a file",
        variant: "destructive",
      });
      return;
    }

    if (resourceUrl && !isUrlValid) {
      toast({
        title: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Resource Shared! 📚",
      description: `Your resource has been shared with ${matchName}`,
      // We need to pass className as a style prop instead since our ToastProps doesn't properly handle classNames
      style: { background: 'linear-gradient(to bottom right, rgba(var(--primary), 0.1), rgba(var(--secondary), 0.1))', backdropFilter: 'blur(8px)', borderColor: 'rgba(var(--primary), 0.2)', borderWidth: '1px' }
    });
    
    // Show confetti animation
    showConfetti();
    
    setTimeout(() => {
      onClose();
      // Reset form
      setResourceUrl("");
      setResourceFile(null);
      setNotes("");
    }, 1500);
  };

  const showConfetti = () => {
    // This is a placeholder for a confetti animation
    // In a real implementation, you would use a library like canvas-confetti
    console.log("Showing confetti animation");
    // Example implementation would be:
    // import confetti from 'canvas-confetti';
    // confetti({
    //   particleCount: 100,
    //   spread: 70,
    //   origin: { y: 0.6 }
    // });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-primary/20 shadow-lg rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Connect with {matchName}
          </DialogTitle>
        </DialogHeader>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-6"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger 
              value="schedule" 
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Session
            </TabsTrigger>
            <TabsTrigger 
              value="resources"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <File className="mr-2 h-4 w-4" />
              Share Resources
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent 
              value="schedule" 
              className="mt-0"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="p-4 border rounded-lg bg-white/50 dark:bg-gray-800/50 shadow-sm"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md pointer-events-auto"
                    />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary-dark">
                        Select Time
                      </label>
                      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      {date && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-muted-foreground"
                        >
                          {date && format(date, "EEEE, MMMM do, yyyy")}
                        </motion.div>
                      )}
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleScheduleMeeting}
                        className="w-full bg-gradient-to-r from-primary/90 to-primary transition-all duration-300 hover:shadow-md"
                        size="lg"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Schedule Meeting
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent 
              value="resources"
              className="mt-0"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Accordion type="single" collapsible defaultValue="url" className="w-full">
                  <AccordionItem value="url">
                    <AccordionTrigger className="hover:no-underline py-3 group">
                      <div className="flex items-center gap-2 text-primary-dark">
                        <Link className="h-4 w-4 text-primary group-hover:text-primary/80" />
                        <span>Resource URL</span>
                        <Badge variant={resourceUrl ? (isUrlValid ? "secondary" : "destructive") : "outline"} className="ml-2">
                          {resourceUrl ? (isUrlValid ? "Valid" : "Invalid") : "Optional"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="relative">
                        <Input
                          placeholder="Enter resource URL"
                          value={resourceUrl}
                          onChange={(e) => setResourceUrl(e.target.value)}
                          className={`pr-8 ${!isUrlValid && resourceUrl ? 'border-red-300 focus:border-red-300' : ''}`}
                        />
                        {resourceUrl && (
                          <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            {isUrlValid ? 
                              <Check className="h-4 w-4 text-green-500" /> : 
                              <X className="h-4 w-4 text-red-500" />
                            }
                          </span>
                        )}
                      </div>
                      {!isUrlValid && resourceUrl && (
                        <p className="text-xs text-red-500 mt-1">
                          Please enter a valid URL (e.g., https://example.com)
                        </p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="file">
                    <AccordionTrigger className="hover:no-underline py-3 group">
                      <div className="flex items-center gap-2 text-primary-dark">
                        <Upload className="h-4 w-4 text-primary group-hover:text-primary/80" />
                        <span>Upload File</span>
                        <Badge variant={resourceFile ? "secondary" : "outline"} className="ml-2">
                          {resourceFile ? "Selected" : "Optional"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                        <Input
                          type="file"
                          id="file-upload"
                          onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-primary/70" />
                          <span className="text-sm text-muted-foreground">
                            {resourceFile ? resourceFile.name : "Click to upload or drag and drop"}
                          </span>
                        </label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="notes">
                    <AccordionTrigger className="hover:no-underline py-3 group">
                      <div className="flex items-center gap-2 text-primary-dark">
                        <MessageSquare className="h-4 w-4 text-primary group-hover:text-primary/80" />
                        <span>Notes</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Textarea
                        placeholder="Add notes about this resource..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="resize-none border-gray-200 focus:border-primary"
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6"
                >
                  <Button 
                    onClick={handleShareResource} 
                    className="w-full bg-gradient-to-r from-primary/90 to-primary transition-all duration-300 hover:shadow-md" 
                    size="lg"
                  >
                    <File className="mr-2 h-4 w-4" />
                    Share Resource
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>

        <div className="mt-4">
          <Badge variant="secondary" className="text-sm">
            All times are in your local timezone
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
};
