import { BankrollGrowth } from "@/components/Charts/bankroll-growth";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { SessionsSkeleton } from "@/components/Tables/sessions/skeleton";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SessionsTable } from "@/components/Tables/sessions";
import { randomString } from "@/lib/utils";
import { BarChartContainer } from "@/components/Charts/bar-chart";
import config from "../../../tailwind.config";
import { DropdownMenu } from "@/components/ui-elements/dropdown-menu";
import { Button } from "@/components/ui-elements/button";
import { Search } from "lucide-react";

type searchKeys = {
  accounts: string;
  games: string;
  timeFrame: string;
};

type PropsType = {
  searchParams: Promise<searchKeys>;
};

export default async function Home({ searchParams }: PropsType) {
  // console.log(searchParams)

  const {
    accounts: accountsQuery,
    games: gamesQuery,
    timeFrame: timeFrameQuery,
  }: searchKeys = await searchParams;

  // console.debug(gamesQuery);
  // console.debug(timeFrameQuery);

  const supabase = await createClient();
  const sess = await supabase.auth.getSession();

  if (!sess.data.session) {
    return redirect("/auth/login");
  }

  var { data: sessions } = await supabase.from("sessions").select() // .eq("account", accountsQuery === "All"? true: accountsQuery);
  const { data: games } = await supabase.from("games").select();
  var { data: accounts } = await supabase.from("accounts").select() // .eq("name", accountsQuery === "All" ? true : accountsQuery);

  if (!sessions || !accounts || !games) {
    return "Error fetching data from db";
  }

  const allAccounts = accounts.map(account => {return account.name});
  // console.debug(allAccounts)
  
  if (accountsQuery !== "All") {
    sessions = sessions.filter(session => session.account === accountsQuery)
    accounts = accounts.filter(account => account.name === accountsQuery )
  }


  const startingBalances = accounts?.map((account) => {
    return { [account.name]: account.initial_balance };
  });
  const mapStartingBalanaces = Object.assign({}, ...startingBalances);

  const totalBuyIn = sessions.reduce((sum, session) => sum + session.buy_in, 0);
  const totalCashOut = sessions.reduce(
    (sum, session) => sum + session.cash_out,
    0,
  );

  sessions.map((session) => {
    // in millisecs need to convert to min

    session.time =
      // @ts-ignore
      (new Date(session.end_time) - new Date(session.start_time)) / (1000 * 60);
  });

  /*
   here the calculation is not accurate because a session that starts in one day and
   finishes on the next is added entirely on the second day.
   @TODO: evaluate to fix or leave it like this
  */
  const timeSpentPlayingStep1 = sessions.map((session) => {
    return { x: session.end_time.substring(0, 10), y: session.time };
  });

  const timeSpentPlayingStep2 = timeSpentPlayingStep1.reduce(
    (acc: any, { x, y }) => {
      acc[x] = (acc[x] || 0) + y;
      return acc;
    },
    {},
  );

  const timeSpentPlaying = Object.entries(timeSpentPlayingStep2).map(
    ([x, y]) => ({ x, y }),
  );

  const datetimeChartData = sessions.map((session) => {
    return {
      account: session.account,
      x: session.end_time,
      y: session.cash_out - session.buy_in,
    };
  });



  // console.debug(startingBalances);

  const chartLines = startingBalances.map((account: any) => {
    const accName = Object.keys(account)[0];
    const accBal = Object.values(account)[0];
    const accountSessions = datetimeChartData.filter(
      (session: any) => session.account === accName,
    );
    const cleaning = accountSessions.map((sess: any) => {
      return { x: sess.x, y: sess.y };
    });

    // @ts-ignore
    cleaning.sort((a: any, b: any) => new Date(a.x) - new Date(b.x));

    for (let i = 0; i < cleaning.length; i++) {
      if (i === 0) {
        cleaning[i].y = +(cleaning[i].y + accBal).toFixed(2);
      } else {
        cleaning[i].y = +(cleaning[i].y + cleaning[i - 1].y).toFixed(2);
      }
    }

    // console.debug(cleaning)

    return { name: accName, data: cleaning };
  });


  const totalBankroll = chartLines.map((account) => {
    return (
      account.data[account.data.length - 1]?.y ??
      mapStartingBalanaces[account.name]
    );
  });

  // console.log(mapStartingBalanaces);
  // console.log(Object.keys(mapStartingBalanaces));

  return (
    <>
      <div className="flex gap-4 pl-4">
        <DropdownMenu
          items={["All"].concat(allAccounts)}
          query="accounts"
        ></DropdownMenu>
        <DropdownMenu
          items={["All", "MTT", "Cash games"]}
          query="games"
        ></DropdownMenu>
        <DropdownMenu
          items={["All", "Today", "This Week", "Current Month", "Year to date"]}
          query="time_range"
        ></DropdownMenu>

        <Button
          variant={"outlinePrimary"}
          size={"s"}
          shape={"rounded"}
          label={<Search></Search>}
          // onClick={() => {}}
          className="ml-auto"
        ></Button>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <BankrollGrowth
          className="col-span-12 xl:col-span-7"
          key={"bankroll_growth"}
          dataPoints={chartLines}
          totalBankroll={totalBankroll.reduce((total, num) => total + num, 0)}
          // startingBalance={startingBalances}
        />

        <WeeksProfit
          key={"weeks_profit"}
          className="col-span-12 xl:col-span-5"
          dataPoints={{ buy_in: totalBuyIn, cash_out: totalCashOut }}
        />
      </div>

      <div className="mt-8">
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <OverviewCardsGroup />
        </Suspense>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <UsedDevices
          className="col-span-12 xl:col-span-6"
          key={"used_devices"}
          // timeFrame={")?.split(":")[1]}
        />

        <BarChartContainer
          className="col-span-12 xl:col-span-6"
          key={randomString()}
          label="Time spent playing"
          dataPoints={timeSpentPlaying}
          // @ts-ignore
          barColor={config.theme?.extend?.colors.primary}
        />

        <div className="col-span-12 grid xl:col-span-12">
          <Suspense fallback={<SessionsSkeleton />}>
            <SessionsTable className="" data={sessions} />
          </Suspense>
        </div>
        {/* <RegionLabels /> */}

        {/* <Suspense fallback={null}>
          <ChatsCard />
        </Suspense> */}
      </div>
    </>
  );
}
