"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { standardFormat } from "@/lib/format-number";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function DatetimeChart(chartLines: any) {
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


  // console.debug(chartLines)
  

  return (
    <div className="-ml-4 -mr-5 h-[310px]">
      <Chart options={options} series={chartLines.chartLines} type="area" height={310} />
    </div>
  );
}
