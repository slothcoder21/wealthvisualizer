import Dashboard from "./components/Dashboard";
import SmoothDropdown from "./components/SmoothDropdown";
import DashboardLayout from "./components/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <Dashboard />
      
      <div className="mt-8 space-y-4">
        <SmoothDropdown title="About Salary Visualization">
          <div className="p-4 text-sm">
            <p>This dashboard visualizes how quickly money accumulates based on your salary. Enter any amount and see in real-time how your earnings grow second by second.</p>
          </div>
        </SmoothDropdown>
        
        <SmoothDropdown title="US Salary Trends">
          <div className="p-4 text-sm">
            <p>Median income in the United States has grown significantly over time due to factors like inflation, productivity gains, and economic growth. However, wage growth hasn't been equal across all income levels.</p>
            <p className="mt-2">The charts in this dashboard show historical income patterns and comparisons across different professions.</p>
          </div>
        </SmoothDropdown>
        
        <SmoothDropdown title="How It Works">
          <div className="p-4 text-sm">
            <p>The visualization converts your salary input into a per-second rate based on the selected time period (hourly, daily, weekly, etc). It then calculates how much you would earn as each second passes.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Press the "Start" button to begin the visualization</li>
              <li>Update your salary amount or type at any time</li>
              <li>Press "Stop" to pause the visualization</li>
            </ul>
          </div>
        </SmoothDropdown>
      </div>
    </DashboardLayout>
  );
}
