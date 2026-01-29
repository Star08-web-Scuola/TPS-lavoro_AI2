"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export function DatePicker({
  selected,
  onChange,
  className,
  showTimeSelect = false,
}: {
  selected?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
  showTimeSelect?: boolean;
}) {
  const [timeValue, setTimeValue] = React.useState<string>(
    selected ? format(selected, "HH:mm") : "00:00"
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined);
      return;
    }

    if (showTimeSelect) {
      const [hours, minutes] = timeValue.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours || 0, minutes || 0, 0, 0);
      onChange?.(newDate);
    } else {
      onChange?.(date);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);

    if (selected) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDate = new Date(selected);
      newDate.setHours(hours || 0, minutes || 0, 0, 0);
      onChange?.(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            showTimeSelect ? (
              format(selected, "PPP p")
            ) : (
              format(selected, "PPP")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleDateSelect}
          initialFocus
        />
        {showTimeSelect && (
          <div className="p-3 border-t">
            <Input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="w-full"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}