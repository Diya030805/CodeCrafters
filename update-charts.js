const fs = require('fs');
let code = fs.readFileSync('components/dashboard/analytics-view.tsx', 'utf8');

// For ReBarChart
code = code.replace(
  /<Bar dataKey="focus" fill="#3B82F6" radius=\{\[6, 6, 0, 0\]\} name="Focus Hours" \/>/,
  `<Bar dataKey="focus" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Focus Hours" />
                      {isComparing && (
                        <>
                          <Bar dataKey="prevHours" fill="#F59E0B" fillOpacity={0.3} radius={[6, 6, 0, 0]} name="Prev Total" />
                          <Bar dataKey="prevFocus" fill="#3B82F6" fillOpacity={0.3} radius={[6, 6, 0, 0]} name="Prev Focus" />
                        </>
                      )}`
);

// For AreaChart (Monthly Learning Progress)
code = code.replace(
  /<Line type="monotone" dataKey="topics" stroke="#3B82F6" strokeWidth=\{2\} name="Topics" \/>/,
  `<Line type="monotone" dataKey="topics" stroke="#3B82F6" strokeWidth={2} name="Topics" />
                      {isComparing && (
                        <Area type="monotone" dataKey="prevHours" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth={2} fillOpacity={0.1} fill="#94A3B8" name="Prev Hours" />
                      )}`
);

// For LineChart (Quiz Score Trend)
code = code.replace(
  /<Line type="monotone" dataKey="score" stroke="#06B6D4" strokeWidth=\{3\} dot=\{\{ r: 5, fill: '#06B6D4' \}\} activeDot=\{\{ r: 7 \}\} name="Score %" \/>/,
  `<Line type="monotone" dataKey="score" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5, fill: '#06B6D4' }} activeDot={{ r: 7 }} name="Score %" />
                      {isComparing && (
                        <Line type="monotone" dataKey="prevScore" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4, fill: '#94A3B8' }} activeDot={{ r: 6 }} name="Prev Score %" />
                      )}`
);

fs.writeFileSync('components/dashboard/analytics-view.tsx', code);
