import React from 'react';
import { createRoot } from 'react-dom/client';
import { TopologyViewer } from './Components/TopologyViewer.jsx';
import { DataFlow } from './Components/DataFlow.jsx';
import { PredictionModel } from './Components/PredictionModel.jsx';
import { TimeseriesChart, MetricsDisplay } from './Components/TimeseriesChart.jsx';

const App = () => {
  return (
    <div className="app">
      <h1>topology-analysis Components</h1>
      {/* Render relevant components */}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
