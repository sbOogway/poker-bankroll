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
import {
  LucideClock,
  LucideGamepad,
  LucidePiggyBank,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSessionStorage from "@/hooks/use-session-storage";
import { useValue } from "@/context/ValueContext";

type searchKeys = {
  accounts: string;
  games: string;
  timeFrame: string;
};

type PropsType = {
  searchParams: Promise<searchKeys>;
};

export const revalidate = 60

export default async function Home({ searchParams }: PropsType) {
  // console.log(searchParams)
  // const [value, setValue] = useState<string | null>(null);

  // useEffect(() => {
  //   const time
  // })

  const start = performance.now()

  const {
    accounts: accountsQuery,
    games: gamesQuery,
    timeFrame: timeFrameQuery,
  }: searchKeys = await searchParams;

  // console.debug(gamesQuery);
  // console.debug(timeFrameQuery);
  // console.debug(accountsQuery)

  const startSupa = performance.now()
  const supabase = await createClient();

  const createClientSupa = performance.now()

  const sess = await supabase.auth.getSession();

  const getSessionSupa = performance.now()
  if (!sess.data.session) {
    return redirect("/auth/login");
  }

  

  var { data: sessions } = await supabase.from("sessions").select(); // .eq("account", accountsQuery === "All"? true: accountsQuery);
  const sessionsSupa = performance.now()
  const { data: games } = await supabase.from("games").select();
  const gamesSupa = performance.now()
  const { data: categories } = await supabase.from("categories").select("name");
  const categoriesSupa = performance.now()
  var { data: accounts } = await supabase.from("accounts").select(); // .eq("name", accountsQuery === "All" ? true : accountsQuery);
  const accountsSupa = performance.now()

  console.log('--- Supabase timing report ---');
  console.log(`createClient   : ${(createClientSupa - startSupa).toFixed(2)} ms`);
  console.log(`getSession     : ${(getSessionSupa - startSupa).toFixed(2)} ms`);
  console.log(`load sessions  : ${(sessionsSupa - startSupa).toFixed(2)} ms`);
  console.log(`load games     : ${(gamesSupa - startSupa).toFixed(2)} ms`);
  console.log(`load categories: ${(categoriesSupa - startSupa).toFixed(2)} ms`);
  console.log(`load accounts  : ${(accountsSupa - startSupa).toFixed(2)} ms`);
  console.log(`total elapsed  : ${(performance.now() - startSupa).toFixed(2)} ms`);

  const supabaseFetch = performance.now()

  // const {games, categories , accounts} = null;

  if (!sessions || !accounts || !games || !categories) {
    return "Error fetching data from db";
  }

  const categoriesDropdownMenu = categories?.map((category) => {
    return category.name;
  });

  const allAccounts = accounts.map((account) => {
    return account.name;
  });
  // console.debug(allAccounts)

  if (accountsQuery) {
    sessions = sessions.filter(
      (session) => session.account === accountsQuery || accountsQuery === "all",
    );
    accounts = accounts.filter(
      (account) => account.name === accountsQuery || accountsQuery === "all",
    );
  }

  // console.debug(sessions)
  if (gamesQuery) {
    sessions = sessions.filter(
      (session) =>
        gamesQuery === "all" ||
        (session.category.startsWith("MTT") && gamesQuery === "mtt") ||
        (session.category.startsWith("ZOOM") && gamesQuery === "cash_game"),
    );
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

  const end = performance.now()

  console.log(`${(supabaseFetch - start)} ms excution time fetching supabase` )
  console.log(`${(end - supabaseFetch)} ms excution time calculating stats` )
  console.log(`${(end - start)} ms excution time total` )

  // console.log(mapStartingBalanaces);
  // console.log(Object.keys(mapStartingBalanaces));

  return (
    <>
      <div className="flex gap-4 pl-4">
        <DropdownMenu
          items={["All"].concat(allAccounts)}
          query="accounts"
          icon={<LucidePiggyBank></LucidePiggyBank>}
        ></DropdownMenu>
        <DropdownMenu
          items={["All"].concat(categoriesDropdownMenu)}
          query="games"
          icon={<LucideGamepad></LucideGamepad>}
        ></DropdownMenu>
        <DropdownMenu
          items={["All", "Today", "This Week", "Current Month", "Year to date"]}
          query="time_range"
          icon={<LucideClock></LucideClock>}
        ></DropdownMenu>

        <Link className="ml-auto" href={`/?time_range`}>
          <Button
            variant={"outlinePrimary"}
            size={"s"}
            shape={"rounded"}
            label={<Search></Search>}
          ></Button>
        </Link>
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
