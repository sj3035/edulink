
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  SlidersHorizontal, 
  Book, 
  Clock, 
  Brain, 
  BadgePercent,
  Users,
  X
} from "lucide-react";
import { MatchingHeader } from "./MatchingHeader";
import { MatchedUserCard } from "./MatchedUserCard";
import { SchedulingAndResources } from "./SchedulingAndResources";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "./ui/popover";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

// Type for our match data
interface Match {
  id: number;
  name: string;
  subjects: string[];
  learningStyle: string;
  studyTimes: string;
  compatibilityScore: number;
  avatarUrl?: string;
}

// Extract all possible subjects from our matches
const getAllSubjects = (matches: Match[]) => {
  const subjectsSet = new Set<string>();
  matches.forEach(match => {
    match.subjects.forEach(subject => {
      subjectsSet.add(subject);
    });
  });
  return Array.from(subjectsSet);
};

// Extract all possible learning styles from our matches
const getAllLearningStyles = (matches: Match[]) => {
  const stylesSet = new Set<string>();
  matches.forEach(match => {
    stylesSet.add(match.learningStyle);
  });
  return Array.from(stylesSet);
};

// Extract all possible study times from our matches
const getAllStudyTimes = (matches: Match[]) => {
  const timesSet = new Set<string>();
  matches.forEach(match => {
    timesSet.add(match.studyTimes);
  });
  return Array.from(timesSet);
};

export const MatchingModule = () => {
  // Initial match data
  const initialMatches: Match[] = [
    {
      id: 1,
      name: "Alex Johnson",
      subjects: ["Mathematics", "Physics"],
      learningStyle: "Visual",
      studyTimes: "Evenings",
      compatibilityScore: 85
    },
    {
      id: 2,
      name: "Emily Smith",
      subjects: ["Biology", "Chemistry"],
      learningStyle: "Auditory",
      studyTimes: "Weekends",
      compatibilityScore: 78
    },
    {
      id: 3,
      name: "Michael Brown",
      subjects: ["Computer Science", "Mathematics"],
      learningStyle: "Kinesthetic",
      studyTimes: "Afternoons",
      compatibilityScore: 92
    },
    {
      id: 4,
      name: "Sarah Davis",
      subjects: ["History", "Literature"],
      learningStyle: "Visual",
      studyTimes: "Mornings",
      compatibilityScore: 75
    },
    {
      id: 5,
      name: "David Wilson",
      subjects: ["Physics", "Mathematics"],
      learningStyle: "Auditory",
      studyTimes: "Evenings",
      compatibilityScore: 88
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [showScheduling, setShowScheduling] = useState(false);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>(initialMatches);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [filterSubjects, setFilterSubjects] = useState<string[]>([]);
  const [filterLearningStyles, setFilterLearningStyles] = useState<string[]>([]);
  const [filterStudyTimes, setFilterStudyTimes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Floating action button ref
  const fabRef = useRef<HTMLDivElement>(null);

  // Get all filter options from our matches
  const allSubjects = getAllSubjects(matches);
  const allLearningStyles = getAllLearningStyles(matches);
  const allStudyTimes = getAllStudyTimes(matches);

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...matches];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(match => 
        match.name.toLowerCase().includes(query) ||
        match.subjects.some(subj => subj.toLowerCase().includes(query))
      );
    }
    
    // Apply subject filter
    if (filterSubjects.length > 0) {
      result = result.filter(match => 
        match.subjects.some(subj => filterSubjects.includes(subj))
      );
    }
    
    // Apply learning style filter
    if (filterLearningStyles.length > 0) {
      result = result.filter(match => 
        filterLearningStyles.includes(match.learningStyle)
      );
    }
    
    // Apply study time filter
    if (filterStudyTimes.length > 0) {
      result = result.filter(match => 
        filterStudyTimes.includes(match.studyTimes)
      );
    }
    
    // Apply sorting
    if (sortBy === "score") {
      result.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    setFilteredMatches(result);
  }, [
    matches, 
    searchQuery, 
    sortBy, 
    filterSubjects, 
    filterLearningStyles, 
    filterStudyTimes
  ]);

  const handleFindMatches = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleConnect = (name: string) => {
    setSelectedMatch(name);
    setShowScheduling(true);
  };

  const toggleSubjectFilter = (subject: string) => {
    setFilterSubjects(prev => 
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleLearningStyleFilter = (style: string) => {
    setFilterLearningStyles(prev => 
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const toggleStudyTimeFilter = (time: string) => {
    setFilterStudyTimes(prev => 
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterSubjects([]);
    setFilterLearningStyles([]);
    setFilterStudyTimes([]);
    setSortBy("score");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <div className="mb-12">
        <MatchingHeader onFindMatches={handleFindMatches} isLoading={isLoading} />
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {(filterSubjects.length > 0 || filterLearningStyles.length > 0 || filterStudyTimes.length > 0) && (
                  <Badge className="ml-1 bg-primary text-white h-5 w-5 flex items-center justify-center p-0">
                    {filterSubjects.length + filterLearningStyles.length + filterStudyTimes.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-5" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">Filter & Sort</h3>
                  {(filterSubjects.length > 0 || filterLearningStyles.length > 0 || filterStudyTimes.length > 0 || sortBy !== "score") && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="h-8 text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-2">
                    <BadgePercent className="h-3 w-3" />
                    Sort By
                  </Label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as "score" | "name")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Compatibility Score</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-2">
                    <Book className="h-3 w-3" />
                    Subjects
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {allSubjects.map(subject => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`subject-${subject}`} 
                          checked={filterSubjects.includes(subject)}
                          onCheckedChange={() => toggleSubjectFilter(subject)}
                        />
                        <label 
                          htmlFor={`subject-${subject}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {subject}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-2">
                    <Brain className="h-3 w-3" />
                    Learning Styles
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {allLearningStyles.map(style => (
                      <div key={style} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`style-${style}`} 
                          checked={filterLearningStyles.includes(style)}
                          onCheckedChange={() => toggleLearningStyleFilter(style)}
                        />
                        <label 
                          htmlFor={`style-${style}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {style}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Study Times
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {allStudyTimes.map(time => (
                      <div key={time} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`time-${time}`} 
                          checked={filterStudyTimes.includes(time)}
                          onCheckedChange={() => toggleStudyTimeFilter(time)}
                        />
                        <label 
                          htmlFor={`time-${time}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {time}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Selected filters display */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {filterSubjects.map(subject => (
              <Badge 
                key={`filter-${subject}`}
                variant="secondary"
                className="flex items-center gap-1 hover:bg-secondary/80 cursor-pointer"
                onClick={() => toggleSubjectFilter(subject)}
              >
                {subject}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            
            {filterLearningStyles.map(style => (
              <Badge 
                key={`filter-${style}`}
                variant="secondary"
                className="flex items-center gap-1 hover:bg-secondary/80 cursor-pointer"
                onClick={() => toggleLearningStyleFilter(style)}
              >
                {style} Learner
                <X className="h-3 w-3" />
              </Badge>
            ))}
            
            {filterStudyTimes.map(time => (
              <Badge 
                key={`filter-${time}`}
                variant="secondary"
                className="flex items-center gap-1 hover:bg-secondary/80 cursor-pointer"
                onClick={() => toggleStudyTimeFilter(time)}
              >
                {time}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results count and sorting options */}
      {filteredMatches.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
          </p>
        </div>
      )}
      
      {/* Matches Grid */}
      <AnimatePresence>
        {filteredMatches.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
          >
            {filteredMatches.map((match, index) => (
              <div key={match.id} className="h-full">
                <MatchedUserCard 
                  match={match} 
                  index={index} 
                  onConnect={handleConnect}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="h-12 w-12 mx-auto text-primary/40 mb-4" />
            <h3 className="text-lg font-medium text-primary-dark mb-2">No matches found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search criteria
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Action Button */}
      <motion.div
        ref={fabRef}
        className="fixed bottom-8 right-8 z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="icon"
            >
              <SlidersHorizontal className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="end" className="w-64">
            <div className="space-y-2">
              <h3 className="font-medium">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSortBy("score")}
                >
                  <BadgePercent className="h-4 w-4 mr-2" />
                  Sort by Match
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSortBy("name")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Sort by Name
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={clearAllFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </motion.div>
      
      {/* Connect dialog */}
      <SchedulingAndResources
        isOpen={showScheduling}
        onClose={() => setShowScheduling(false)}
        matchName={selectedMatch || ""}
      />
    </div>
  );
};
