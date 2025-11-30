import { calculateTrajectory } from './physics.js';

let optChart = null;

export function runOptimization(params, getParams) {
  const p = params || (typeof getParams === 'function' ? getParams() : null);
  if (!p) return;
  const v0 = p.v0;
  const data = [];
  let maxD = 0, bestAng = 0;

  for (let a = 15; a <= 60; a += 2) {
    const pts = calculateTrajectory(v0, a, p);
    const dist = pts[pts.length - 1].x;
    data.push({ x: a, y: dist });
    if (dist > maxD) { maxD = dist; bestAng = a; }
  }

  const angleEl = document.getElementById('optAngleDisp');
  const distEl = document.getElementById('optDistDisp');
  if (angleEl) angleEl.innerText = `${bestAng}°`;
  if (distEl) distEl.innerText = `Alcance: ${maxD.toFixed(1)} m`;

  const ctxC = document.getElementById('optimizationChart')?.getContext('2d');
  if (!ctxC || typeof Chart === 'undefined') return;
  if (optChart) optChart.destroy();

  optChart = new Chart(ctxC, {
    type: 'line',
    data: {
      labels: data.map(d => d.x),
      datasets: [{
        label: 'Alcance',
        data: data.map(d => d.y),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: true, title: { display: true, text: 'Ángulo' } },
        y: { display: false },
      },
    },
  });
}
