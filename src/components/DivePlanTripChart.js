import React from "react";
import ReactECharts from 'echarts-for-react';

function DivePlanTripChart({ trips }) {
  const xAxis = [0];
  const yAxis = [0];
  
  let totalDuration = 1;
  let totalDepth = 0;
  for (let i = 0; i < trips.length; i++) {
    const currentDepth = Number(trips[i].depth);
    const currentDuration = Number(trips[i].duration);

    for (let j = 0; j < currentDuration; j++) {
      yAxis.push(currentDepth * -1);
      xAxis.push(totalDuration);
      totalDuration++;
    }

    totalDepth += currentDepth
  }

  const averageDepth = (totalDepth / trips.length) * -1;
  const averageSeries = Array(totalDuration).fill(averageDepth);

  const chartOption = {
    title: {
      text: 'Dive Plan'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Depth', 'Average Depth']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '2%',
      right: '8%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        name: 'Duration',
        boundaryGap: false,
        data: xAxis,
      }
    ],
    yAxis: [
      {
        type: 'value',
      }
    ],
    series: [
      {
        type: 'line',
        name: 'Depth',
        areaStyle: {},
        data: yAxis,
      },
      {
        type: 'line',
        name: 'Average Depth',
        data: averageSeries,
      }
    ],
  };

  return (trips.length > 0) && (
    <ReactECharts
      option={chartOption}
      style={{ height: 400 }}
    />
  );
}

export default DivePlanTripChart;
