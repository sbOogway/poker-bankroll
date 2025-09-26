"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function formatSelect(list: Array<any>) {
  return list.map((item) => {
    return { label: item.name, value: item.name };
  });
}


export function SessionForm({ accounts, games, categories }: any) {
  const [account, setAccount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bullets, setBullets] = useState("");
  const [buyIn, setBuyIn] = useState("");
  const [cashOut, setCashOut] = useState("");
  const [game, setGame] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleSubmitForm = async (e: React.FormEvent) => {
    console.debug("entering handleSubmit()")
    e.preventDefault();

    setIsLoading(true);

    const supabase  = createClient()
    
    const session = await supabase.auth.getSession();

    const {data, error} = await supabase.from("sessions").insert({
      start_time: startDate,
      end_time: endDate,
      bullets: Number(bullets),
      account: account,
      buy_in: buyIn,
      cash_out: cashOut,
      game : game
    })

    console.debug(session)
    console.debug(data)
    console.debug(error)

    setIsLoading(false)
    router.push("/sessions")


  };

  accounts = formatSelect(accounts);
  games = formatSelect(games);
  categories = formatSelect(categories);
  

  return (
    <ShowcaseSection title="Create new session" className="!p-6.5">
      <form onSubmit={handleSubmitForm}>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Account"
            placeholder="Select account"
            className="mb-4.5 xl:w-1/2"
            items={accounts}
            setState={setAccount}
            // handleChange={}
            
          />
          <Select
            label="Game"
            placeholder="Select game"
            className="mb-4.5 xl:w-1/2"
            items={games}
            setState={setGame}
          />
        </div>

        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Start time"
            type="datetime-local"
            placeholder="Session start time"
            className="mb-4.5 xl:w-1/2"
            handleChange={(e) => setStartDate(e.target.value)}
            required
          />

          <InputGroup
            label="End time"
            type="datetime-local"
            placeholder="Session end time"
            className="mb-4.5 xl:w-1/2"
            handleChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <InputGroup
          label="Buy in"
          placeholder="Buy in"
          className="mb-4.5"
          type="number"
          handleChange={(e) => setBuyIn(e.target.value)}
        />

        <InputGroup
          label="Cash out"
          placeholder="Cash out"
          className="mb-4.5"
          type="number"
          handleChange={(e) => setCashOut(e.target.value)}
        />

        <InputGroup
          label="Bullets"
          placeholder="Number of bullets"
          className="mb-4.5"
          type="number"
          handleChange={(e) => setBullets(e.target.value)}
        />

        <Button type="submit" className="mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90" >
          {isLoading ? "Adding session to database...": "Create session"}
        </Button>
      </form>
    </ShowcaseSection>
  );
}
