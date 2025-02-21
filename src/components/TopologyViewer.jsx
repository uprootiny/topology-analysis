import React from 'react';
import { DataFlow } from '@uprootiny/data-pipeline/DataFlow.jsx';
import { TimeseriesChart } from '@uprootiny/visualization/TimeseriesChart.jsx';

export const TopologyViewer = () => {
  return (
    <div className="topology-viewer">
      <h2>Network Topology</h2>
      <DataFlow />
      <TimeseriesChart />
    </div>
  );
};
