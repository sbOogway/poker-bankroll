"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: {
    x: any;
    y: number;
  }[];
  color: any;
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function BarChart({ data, color }: PropsType) {
  const options: ApexOptions = {
    colors: [color],
    chart: {
      type: "bar",
      stacked: false,
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
      // categories: ["buy-in", "cash-out"],
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
    <div className="-ml-3.5 mt-3">
      <Chart
        options={options}
        series={[
          {
            name: "time in min",
            data: data,
          },
          
        ]}
        type="bar"
        height={370}
      />
    </div>
  );
}
