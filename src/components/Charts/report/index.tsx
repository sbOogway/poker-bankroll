import { cn } from "@/lib/utils";
import { JSX } from "react";
type PropsType = {
  className: string;
  data: { [key: string]: any };
};
export async function SessionsReport({ className, data }: PropsType) {
  const reportElements: JSX.Element[] = [];

  Object.entries(data).map(([key, value]) => {
    reportElements.push(
      <div key={key} className="flex">
        <span>{key}</span>

        <span className="ml-auto">{value}</span>
      </div>,
    );
  });
  return (
    <div
      className={cn(
        "space-between flex flex-col rounded-[10px] bg-white px-7.5 pb-7.5 pt-7.5 text-2xl shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="text-body-2xlg font-bold text-dark dark:text-white pb-4">
        Stats
      </h2>
      <div className="mt-auto flex flex-col gap-2">
        {reportElements}
      </div>
    </div>
  );
}
