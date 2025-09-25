import { cn } from "@/lib/utils";
import { BarChart} from "./chart";

type PropsType = {
  className?: string;
  dataPoints?: any;
  label?: string;
  barColor?: string;
  total: any;
};

export async function BarChartContainer({ className, total, dataPoints, label, barColor }: PropsType) {

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card ",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          {label}
        </h2>
        <span className="text-3xl">{total}</span>

        {/* <PeriodPicker
          items={["this week", "last week"]}
          defaultValue={timeFrame || "this week"}
          sectionKey="weeks_profit"
        /> */}
      </div>

      <BarChart data={dataPoints} color={barColor}/>
    </div>
  );
}
