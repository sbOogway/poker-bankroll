"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { standardFormat } from "@/lib/format-number";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function DatetimeChart(data: { sessions: any; accounts: any }) {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },
    grid: {
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      marker: {
        show: true,
      },
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
  };

  // console.debug("yo wassup");
  // console.debug(data.sessions);
  // console.debug(data.accounts);

  const chartLines = data.accounts.map((account: any) => {
    const accName = Object.keys(account)[0];
    const accBal = Object.values(account)[0];
    const accountSessions = data.sessions.filter(
      (session: any) => session.account === accName,
    );
    const cleaning = accountSessions.map((sess: any) => {
      return { x: sess.x, y: sess.y };
    });


    // @ts-ignore
    cleaning.sort((a: any, b: any) => new Date(a.x) - new Date(b.x));

    for (let i = 0; i < cleaning.length; i++) {
      if (i === 0) {
        cleaning[i].y = +((cleaning[i].y + accBal).toFixed(2));
      } else {
        cleaning[i].y = +((cleaning[i].y + cleaning[i - 1].y).toFixed(2));
      }
    }

    return { name: accName, data: cleaning };
  });

  return (
    <div className="-ml-4 -mr-5 h-[310px]">
      <Chart options={options} series={chartLines} type="area" height={310} />
    </div>
  );
}
