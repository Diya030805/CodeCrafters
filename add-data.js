const fs = require('fs');
let code = fs.readFileSync('components/dashboard/analytics-view.tsx', 'utf8');

// For studyHoursData, add prevHours and prevFocus
code = code.replace(
  /\{ day: '8 AM', hours: 0\.8, focus: 0\.7 \}/,
  "{ day: '8 AM', hours: 0.8, focus: 0.7, prevHours: 1.2, prevFocus: 1.0 }"
).replace(
  /\{ day: '10 AM', hours: 1\.5, focus: 1\.4 \}/,
  "{ day: '10 AM', hours: 1.5, focus: 1.4, prevHours: 1.0, prevFocus: 0.8 }"
).replace(
  /\{ day: '1 PM', hours: 0\.5, focus: 0\.4 \}/,
  "{ day: '1 PM', hours: 0.5, focus: 0.4, prevHours: 0.9, prevFocus: 0.7 }"
).replace(
  /\{ day: '3 PM', hours: 1\.2, focus: 1\.1 \}/,
  "{ day: '3 PM', hours: 1.2, focus: 1.1, prevHours: 0.8, prevFocus: 0.6 }"
).replace(
  /\{ day: '6 PM', hours: 0\.5, focus: 0\.4 \}/,
  "{ day: '6 PM', hours: 0.5, focus: 0.4, prevHours: 1.5, prevFocus: 1.2 }"
);

// 7days studyHoursData
const days7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
days7.forEach((day, i) => {
  const prevH = (3 + i * 0.5).toFixed(1);
  const prevF = (2.5 + i * 0.4).toFixed(1);
  code = code.replace(
    new RegExp(`\\{ day: '${day}', hours: ([\\d\\.]+), focus: ([\\d\\.]+) \\}`),
    `{ day: '${day}', hours: $1, focus: $2, prevHours: ${prevH}, prevFocus: ${prevF} }`
  );
});

// 30days studyHoursData
const weeks = ['W1', 'W2', 'W3', 'W4'];
weeks.forEach((w, i) => {
  const prevH = (25 + i * 2).toFixed(1);
  const prevF = (22 + i * 1.5).toFixed(1);
  code = code.replace(
    new RegExp(`\\{ day: '${w}', hours: ([\\d\\.]+), focus: ([\\d\\.]+) \\}`),
    `{ day: '${w}', hours: $1, focus: $2, prevHours: ${prevH}, prevFocus: ${prevF} }`
  );
});

// quizTrendData today
code = code.replace(
  /\{ quiz: 'Q1', score: 92, target: 80 \}/,
  "{ quiz: 'Q1', score: 92, target: 80, prevScore: 88 }"
).replace(
  /\{ quiz: 'Q2', score: 96, target: 80 \}/,
  "{ quiz: 'Q2', score: 96, target: 80, prevScore: 90 }"
);

// quizTrendData 7days
for (let i = 1; i <= 6; i++) {
  code = code.replace(
    new RegExp(`\\{ quiz: 'Quiz ${i}', score: (\\d+), target: 80 \\}`),
    `{ quiz: 'Quiz ${i}', score: $1, target: 80, prevScore: ${75 + i * 3} }`
  );
}

// quizTrendData month
for (let i = 1; i <= 9; i++) {
  code = code.replace(
    new RegExp(`\\{ quiz: 'Test ${i}', score: (\\d+), target: 80 \\}`),
    `{ quiz: 'Test ${i}', score: $1, target: 80, prevScore: ${70 + i * 2} }`
  );
}

// monthlyLearningData
code = code.replace(
  /\{ month: 'Jan', topics: 12, hours: 24 \}/,
  "{ month: 'Jan', topics: 12, hours: 24, prevHours: 18 }"
).replace(
  /\{ month: 'Feb', topics: 22, hours: 48 \}/,
  "{ month: 'Feb', topics: 22, hours: 48, prevHours: 36 }"
).replace(
  /\{ month: 'Mar', topics: 35, hours: 75 \}/,
  "{ month: 'Mar', topics: 35, hours: 75, prevHours: 52 }"
).replace(
  /\{ month: 'Apr', topics: 48, hours: 102 \}/,
  "{ month: 'Apr', topics: 48, hours: 102, prevHours: 80 }"
).replace(
  /\{ month: 'May', topics: 58, hours: 124 \}/,
  "{ month: 'May', topics: 58, hours: 124, prevHours: 110 }"
).replace(
  /\{ month: 'Jun', topics: 64, hours: 142\.5 \}/,
  "{ month: 'Jun', topics: 64, hours: 142.5, prevHours: 130 }"
);


fs.writeFileSync('components/dashboard/analytics-view.tsx', code);
