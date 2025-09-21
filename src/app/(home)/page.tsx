import { BankrollGrowth } from "@/components/Charts/bankroll-growth";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { TopChannels } from "@/components/Tables/top-channels";
import { SessionsSkeleton } from "@/components/Tables/sessions/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { ChatsCard } from "./_components/chats-card";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { RegionLabels } from "./_components/region-labels";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TimeInterval } from "@/components/Layouts/header/time-interval";
import { SessionsTable } from "@/components/Tables/sessions";
// import { useState } from "react";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  const supabase = await createClient();
  const sess = await supabase.auth.getSession();

  if (!sess.data.session) {
    return redirect("/auth/login");
  }

  // console.debug("sess debug");
  // console.debug(sess);

  const { data: sessions } = await supabase.from("sessions").select();
  const { data: games } = await supabase.from("games").select();
  const { data: accounts } = await supabase.from("accounts").select();

  if (!sessions) {
    return "Error fetching data from db";
  }

  const totalBuyIn = sessions.reduce((sum, session) => sum + session.buy_in, 0);
  const totalCashOut = sessions.reduce(
    (sum, session) => sum + session.cash_out,
    0,
  );

  const datetimeChartData = sessions.map((session) => {
    return {
      account: session.account,
      x: session.end_time,
      y: session.cash_out - session.buy_in,
    };
  });

  const startingBalances = accounts?.map((account) => {
    return { [account.name]: account.initial_balance };
  });

  // console.debug(datetimeChartData)

  // console.log(sessions)
  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <BankrollGrowth
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("payments_overview")}
          dataPoints={datetimeChartData}
          startingBalance={startingBalances}
        />

        <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-5"
          dataPoints={{ buy_in: totalBuyIn, cash_out: totalCashOut }}
        />

        <div className="col-span-12 grid xl:col-span-12">
          <Suspense fallback={<SessionsSkeleton />}>
            <SessionsTable className="" data={sessions} />
          </Suspense>
        </div>
        <UsedDevices
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        />

        {/* <RegionLabels /> */}

        {/* <Suspense fallback={null}>
          <ChatsCard />
        </Suspense> */}
      </div>
    </>
  );
}
