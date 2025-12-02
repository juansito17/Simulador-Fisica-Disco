import { canvas, BASE_SCALE, currentScale, setCurrentScale, resetScale, trails, pushTrail, getCurrentScenario } from './constants.js';
import { drawScene, drawPath, drawDiscSprite, drawFBD, drawShadow } from './draw.js';
import { calculateTrajectory } from './physics.js';
import { runOptimization } from './optimization.js';
import { initCoeffChart } from './explanation.js';
import { getParamsFromUI, initAngleControls, initScenarioSelector } from './ui.js';

let animationId = null;
let lastSimulationData = [];

function updateScaleIndicator() {
  const el = document.getElementById('scaleIndicator');
  if (!el) return;
  el.innerText = `Zoom: ${Math.round((currentScale / BASE_SCALE) * 100)}%`;
}

function startAnimation() {
  const keepTrails = document.getElementById('keepTrails')?.checked;
  if (!keepTrails) {
    resetScale();
  }
  const p = getParamsFromUI();
  const points = calculateTrajectory(p.v0, p.ang, p);
  lastSimulationData = points;

  let idx = 0;
  const speed = 2;
  if (animationId) cancelAnimationFrame(animationId);

  const loop = () => {
    const pt = points[Math.min(idx, points.length - 1)];
    // Auto-Zoom
    const screenX = 50 + pt.x * currentScale; // START_X = 50
    const screenY = 350 - pt.y * currentScale; // GROUND_Y = 350
    if (screenX > canvas.width * 0.85 && pt.x > 0) {
      const target = (canvas.width * 0.75) / pt.x;
      setCurrentScale(currentScale * 0.95 + target * 0.05);
    }
    if (screenY < 40 && pt.y > 0) {
      const targetY = (350 - 80) / pt.y;
      if (targetY < currentScale) setCurrentScale(currentScale * 0.95 + targetY * 0.05);
    }
    updateScaleIndicator();

    drawScene();
    if (keepTrails) {
      trails.forEach((tr) => drawPath(tr, 'rgba(100,100,100,0.3)', 1));
    }

    // Dibujar sombra antes del disco y la trayectoria principal
    drawShadow(pt);

    drawPath(points.slice(0, idx + 1), '#fff', 3);
    drawDiscSprite(pt);

    const dVal = document.getElementById('dVal');
    const hVal = document.getElementById('hVal');
    const tVal = document.getElementById('tVal');
    if (dVal) dVal.innerText = pt.x.toFixed(1);
    if (hVal) hVal.innerText = pt.y.toFixed(1);
    if (tVal) tVal.innerText = pt.t.toFixed(1);

    idx += speed;
    if (idx < points.length + 60) {
      animationId = requestAnimationFrame(loop);
    } else {
      if (keepTrails) pushTrail(points);
    }
  };

  loop();
  runOptimization(p, getParamsFromUI);
}

function clearCanvas() {
  trails.length = 0; // clear in-place
  resetScale();
  drawScene();
  updateScaleIndicator();
}

function downloadCSV() {
  if (!lastSimulationData.length) { alert('Primero ejecuta una simulación.'); return; }
  const params = getParamsFromUI();
  const scenario = getCurrentScenario();

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += `# Escenario: ${scenario.name}\n`;
  csvContent += `# Viento: ${params.wind} m/s\n`;
  csvContent += `# Densidad del aire: ${params.rho} kg/m³\n`;
  csvContent += 'Tiempo(s),Distancia(m),Altura(m),Vx(m/s),Vy(m/s)\n';

  lastSimulationData.forEach((row) => {
    csvContent += `${row.t.toFixed(3)},${row.x.toFixed(3)},${row.y.toFixed(3)},${row.vx.toFixed(3)},${row.vy.toFixed(3)}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `disco_${scenario.shortName.toLowerCase().replace(' ', '_')}_datos.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.addEventListener('DOMContentLoaded', () => {
  initAngleControls();
  initScenarioSelector(); // Inicializar selector de escenarios
  drawScene();
  updateScaleIndicator();
  // pequeño delay para asegurar tamaño canvas en algunos navegadores
  setTimeout(drawFBD, 300);
  setTimeout(initCoeffChart, 500); // Inicializar gráfica explicativa
  runOptimization(getParamsFromUI(), getParamsFromUI);

  const btnLaunch = document.getElementById('btnLaunch');
  const btnClear = document.getElementById('btnClear');
  const btnExportCsv = document.getElementById('btnExportCsv');

  if (btnLaunch) btnLaunch.addEventListener('click', startAnimation);
  if (btnClear) btnClear.addEventListener('click', clearCanvas);
  if (btnExportCsv) btnExportCsv.addEventListener('click', downloadCSV);
});
