import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SeatSelectorProps {
  totalSeats: number;
  bookedSeats: string[];
  maxSelectable: number;
  onSelectionChange: (selectedSeats: string[]) => void;
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 12;

const SeatSelector = ({
  totalSeats,
  bookedSeats,
  maxSelectable,
  onSelectionChange,
}: SeatSelectorProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Calculate actual rows based on total seats
  const totalRows = Math.ceil(totalSeats / SEATS_PER_ROW);
  const activeRows = ROWS.slice(0, totalRows);

  useEffect(() => {
    onSelectionChange(selectedSeats);
  }, [selectedSeats, onSelectionChange]);

  const handleSeatClick = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      }
      if (prev.length >= maxSelectable) {
        // Replace the first selected seat
        return [...prev.slice(1), seatId];
      }
      return [...prev, seatId];
    });
  };

  const getSeatStatus = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  return (
    <div className="w-full">
      {/* Screen indicator */}
      <div className="mb-8">
        <div className="w-3/4 mx-auto h-2 bg-primary/60 rounded-t-full" />
        <p className="text-center text-sm text-muted-foreground mt-2">SCREEN</p>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col items-center gap-2">
        {activeRows.map((row) => (
          <div key={row} className="flex items-center gap-1">
            <span className="w-6 text-sm font-medium text-muted-foreground">{row}</span>
            <div className="flex gap-1">
              {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                const seatNum = i + 1;
                const seatId = `${row}${seatNum}`;
                const seatIndex = ROWS.indexOf(row) * SEATS_PER_ROW + i;
                
                // Don't render seats beyond total
                if (seatIndex >= totalSeats) {
                  return <div key={seatId} className="w-8 h-8" />;
                }

                const status = getSeatStatus(seatId);

                return (
                  <button
                    key={seatId}
                    onClick={() => handleSeatClick(seatId)}
                    disabled={status === "booked"}
                    className={cn(
                      "w-8 h-8 rounded text-xs font-semibold transition-all duration-200 flex items-center justify-center",
                      status === "booked" && "bg-muted text-muted-foreground cursor-not-allowed",
                      status === "available" && "border-2 border-accent text-accent hover:bg-accent/20 cursor-pointer",
                      status === "selected" && "bg-accent text-accent-foreground border-2 border-accent cursor-pointer"
                    )}
                    title={status === "booked" ? "Seat unavailable" : `Seat ${seatId}`}
                  >
                    {seatNum}
                  </button>
                );
              })}
            </div>
            <span className="w-6 text-sm font-medium text-muted-foreground">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded border-2 border-accent" />
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent" />
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-muted" />
          <span className="text-sm text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Selection info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-semibold text-foreground">{selectedSeats.length}</span> / {maxSelectable} seats
        </p>
        {selectedSeats.length > 0 && (
          <p className="text-sm text-primary mt-1">
            Seats: {selectedSeats.sort().join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default SeatSelector;
