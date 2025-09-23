"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from "@/components/ui/dropdown";
import { JSX, useState } from "react";
import { ChevronUpIcon, CalendarIcon } from "@/assets/icons";
import { cn, randomString } from "@/lib/utils";
import { redirect } from "next/navigation";

type PropsType = {
  items: any[];
  query: string;
};

export function DropdownMenu({ items, query }: PropsType) {

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(items[0]);

  const itemsDropdown: JSX.Element[] = [];

  items.forEach((item) => {
    itemsDropdown.push(
      <div
        onClick={() => {
          setIsOpen(false);
          setSelected(item);
          redirect(`/?${query}=${item}`);
        }}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
        key={randomString()}
      >
        {item}
      </div>,
    );
  });

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">Dropdown menu {query}</span>
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
        align="start"
      >
        <h2 className="sr-only">Select dropdown menu {query}</h2>
        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          {itemsDropdown}
          
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
