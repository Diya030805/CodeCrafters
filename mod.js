const fs = require('fs');
let code = fs.readFileSync('components/dashboard/analytics-view.tsx', 'utf8');

// 1. Add isComparing state
code = code.replace(
  /const \[timeRange, setTimeRange\] = React\.useState<TimeRange>\('30days'\);/,
  `const [timeRange, setTimeRange] = React.useState<TimeRange>('30days');\n  const [isComparing, setIsComparing] = React.useState(false);`
);

// 2. Add compare toggle in Time Filters Bar
const compareToggle = `
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsComparing(!isComparing)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 mr-4",
                isComparing
                  ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
                  : "bg-slate-200/40 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-200/70 dark:hover:bg-white/[0.06]"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              Compare Periods
            </button>
`;
code = code.replace(/<div className="flex flex-wrap items-center gap-2">/, compareToggle);


// 3. Add comparative data generation dynamically inside useMemo or just modifying the existing data structure isn't too hard, but wait, the prompt says "overlay performance data from two different date ranges (e.g. 'This Month' vs 'Last Month') on the existing line charts". So we can just add the new line/bar to the chart components when isComparing is true.

fs.writeFileSync('components/dashboard/analytics-view.tsx', code);
