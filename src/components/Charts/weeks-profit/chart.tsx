"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: {
    buy_in: number;
    cash_out: number;
  };
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function WeeksProfitChart({ data }: PropsType) {
  const options: ApexOptions = {
    colors: ["#ff0000", "#00ff00"],
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
              columnWidth: "25%",
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 3,
        columnWidth: "25%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },

    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    xaxis: {
      categories: ["buy-in", "cash-out"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    // legend: {
    //   position: "top",
    //   horizontalAlign: "left",
    //   fontFamily: "inherit",
    //   fontWeight: 500,
    //   fontSize: "14px",
    //   markers: {
    //     size: 9,
    //     shape: "circle",
    //   },
    // },
    fill: {
      opacity: 1,
    },
  };
  return (
    <div className="">
      <Chart
        options={options}
        series={[
          {
            name: "Buy-Ins",
            data: [+(data.buy_in.toFixed(2)), 0],
          },
          {
            name: "Cash-Out",
            data: [0, +(data.cash_out.toFixed(2))],
          },
        ]}
        type="bar"
        height={370}
      />
    </div>
  );
}
