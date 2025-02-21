import React, { useState, useEffect } from 'react';
import { DataFlow } from '@uprootiny/data-pipeline/DataFlow.jsx';
import { TimeseriesChart } from '@uprootiny/visualization/TimeseriesChart.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  ChartLine,
  ChartBar,
  ChartScatter,
  Settings2
} from 'lucide-react';




interface ChartConfig {
  type: 'line' | 'bar' | 'scatter';
  label: string;
  color: string;
}

interface TopologyViewerProps {
  initialData?: number[];
  updateInterval?: number;
  epsilon?: number;
}




const defaultProps: TopologyViewerProps = {
  initialData: Array.from({ length: 20 }, () => Math.random() * 100),
  updateInterval: 5000,
  epsilon: 0.5,
};




const TopologyViewer: React.FC<TopologyViewerProps> = ({
  initialData = defaultProps.initialData,
  updateInterval = defaultProps.updateInterval,
  epsilon = defaultProps.epsilon,
}) => {
  const [data, setData] = useState<number[]>(initialData);
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'line',
    label: 'Topology Data',
    color: '#2563eb',
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  


  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying) {
      intervalId = setInterval(() => {
        setData(prevData => 
          [...prevData.slice(-19), Math.random() * 100]
        );
      }, updateInterval);
    }
    
    return () => clearInterval(intervalId);
  }, [isPlaying, updateInterval]);

  


  const toggleConfig = (key: keyof ChartConfig) => {
    setChartConfig(prev => ({
      ...prev,
      [key]: prev[key] === 'line' ? 'bar' : 
             prev[key] === 'bar' ? 'scatter' : 'line'
    }));
  };

  


  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Network Topology
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleConfig('type')}
                  >
                    {chartConfig.type === 'line' ? (
                      <ChartLine className="h-4 w-4" />
                    ) : chartConfig.type === 'bar' ? (
                      <ChartBar className="h-4 w-4" />
                    ) : (
                      <ChartScatter className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change chart type</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? 'Pause' : 'Play'} updates</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <DataFlow epsilon={epsilon} />
          <TimeseriesChart
            data={data}
            config={chartConfig}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TopologyViewer;
