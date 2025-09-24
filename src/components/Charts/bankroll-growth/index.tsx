import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getPaymentsOverviewData } from "@/services/charts.services";
import { PaymentsOverviewChart } from "./chart";
import { DatetimeChart } from "./chart-datetime";

type PropsType = {
  className?: string;
  totalBankroll?: any;
  dataPoints?: any;
};

export async function BankrollGrowth({
  dataPoints,
  totalBankroll,
  className,
}: PropsType) {
  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Bankroll 
        </h2>

        <span className={"ml-auto text-3xl" }>
          {totalBankroll.toFixed(2)}
        </span>

        {/* <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" /> */}
      </div>

      <DatetimeChart chartLines={dataPoints} />
      {/* 
      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            ${standardFormat(data.received.reduce((acc, { y }) => acc + y, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Received Amount</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            ${standardFormat(data.due.reduce((acc, { y }) => acc + y, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Due Amount</dd>
        </div>
      </dl> */}
    </div>
  );
}
