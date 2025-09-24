import { cn } from "@/lib/utils";
import { WeeksProfitChart } from "./chart";

type PropsType = {
  className?: string;
  dataPoints?: any;
};

export async function WeeksProfit({ className, dataPoints }: PropsType) {
  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Profit
        </h2>
        <div className="ml-auto text-3xl">
          <span
            className={
              "ml-auto text-3xl text-" +
              (dataPoints.cash_out - dataPoints.buy_in >= 0 ? "green" : "red")
            }
          >
            {(dataPoints.cash_out - dataPoints.buy_in).toFixed(2)}
          </span>
        </div>
      </div>

      <WeeksProfitChart data={dataPoints} />

      {/* <div>
        ROI:

      </div> */}
    </div>
  );
}
