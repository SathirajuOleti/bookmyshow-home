import { useRef } from "react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateSelectorProps {
  dates: Date[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const DateSelector = ({ dates, selectedDate, onSelectDate }: DateSelectorProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (dates.length === 0) return null;

  return (
    <div className="relative">
      {/* Left scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 backdrop-blur-sm shadow-md hidden md:flex"
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Scrollable date container */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-2 py-2 md:px-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dates.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 rounded-lg border-2 transition-all min-w-[72px]",
                isSelected
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-border hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              <span className={cn(
                "text-xs font-medium uppercase",
                isSelected ? "text-primary-foreground" : "text-muted-foreground"
              )}>
                {format(date, "EEE")}
              </span>
              <span className={cn(
                "text-xl font-bold",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}>
                {format(date, "dd")}
              </span>
              <span className={cn(
                "text-xs",
                isSelected ? "text-primary-foreground" : "text-muted-foreground"
              )}>
                {format(date, "MMM")}
              </span>
              {isToday && (
                <span className={cn(
                  "text-[10px] font-semibold mt-0.5",
                  isSelected ? "text-primary-foreground" : "text-primary"
                )}>
                  TODAY
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right scroll button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 backdrop-blur-sm shadow-md hidden md:flex"
        onClick={() => scroll("right")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateSelector;
