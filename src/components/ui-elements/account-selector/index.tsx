"use client"

import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from "@/components/ui/dropdown";
import { JSX, useState } from "react";
import { ChevronUpIcon, CalendarIcon } from "@/assets/icons";
import { cn, randomString } from "@/lib/utils";

export function AccountSelector() {
  const timeIntervals = [
    "All",
    "This Week",
    "Today",
    "Current Month",
    "Year to date",
    "All time",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(timeIntervals[0]);

  const timeIntervalsDropdown: JSX.Element[] = [];

  timeIntervals.forEach((interval) => {
    timeIntervalsDropdown.push(
      <div
        onClick={() => {
          setIsOpen(false);
          setSelected(interval);
        }}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
        key={interval}
      >
        {interval}
      </div>,
    );
  });

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">Time Interval</span>
        <figure className="flex items-center gap-3">
          <CalendarIcon />
          
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{selected}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>
      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">Select time interval</h2>
        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          {timeIntervalsDropdown}
          <hr className="border-[#E8E8E8] dark:border-dark-3" />
          <div
            onClick={() => {
              // setIsOpen(false);
              // setSelected("Custom");
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            key={"custom"}
          >
            Custom range
            <div className="flex flex-col gap-1 p-2">
              <input type="date" className="bg-gray-dark p-2" />
              <input type="date" className="bg-gray-dark p-2" />
            </div>
          </div>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
