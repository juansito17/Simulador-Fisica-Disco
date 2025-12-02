import { SCENARIOS, currentScenario, setCurrentScenario, getCurrentScenario } from './constants.js';

export function getParamsFromUI() {
  let v0 = parseFloat(document.getElementById('initVel').value);
  let ang = parseFloat(document.getElementById('launchAngle').value);
  let h0 = parseFloat(document.getElementById('releaseHeight').value);
  let wind = parseFloat(document.getElementById('windVel').value);
  let rho = parseFloat(document.getElementById('airDensity').value);
  let g = parseFloat(document.getElementById('gravityVal').value);
  let m = parseFloat(document.getElementById('massVal').value);
  let diam = parseFloat(document.getElementById('diameterVal').value);
  let area = Math.PI * Math.pow(diam / 2, 2);
  let cd = parseFloat(document.getElementById('cdVal').value);
  let cl = parseFloat(document.getElementById('clVal').value);
  return { v0, ang, h0, wind, rho, g, m, area, cdBase: cd, clFactor: cl, scenario: currentScenario };
}

export function initAngleControls() {
  const angleInput = document.getElementById('launchAngle');
  const slider = document.getElementById('launchAngleSlider');
  if (!angleInput || !slider) return;
  slider.addEventListener('input', (e) => { angleInput.value = e.target.value; });
  angleInput.addEventListener('input', (e) => { slider.value = e.target.value; });
}

export function initScenarioSelector() {
  const scenarioRadios = document.querySelectorAll('input[name="scenario"]');
  scenarioRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const scenarioId = parseInt(e.target.value);
      setCurrentScenario(scenarioId);
      updateControlsForScenario(scenarioId);
    });
  });

  // Aplicar escenario inicial
  updateControlsForScenario(currentScenario);
}

export function updateControlsForScenario(scenarioId) {
  const scenario = SCENARIOS[scenarioId];
  const windInput = document.getElementById('windVel');
  const rhoInput = document.getElementById('airDensity');

  if (!windInput || !rhoInput) return;

  // Configurar viento
  if (scenario.windLocked) {
    windInput.value = scenario.wind;
    windInput.disabled = true;
    windInput.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    windInput.value = scenario.wind;
    windInput.disabled = false;
    windInput.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  // Configurar densidad del aire
  if (scenario.rhoLocked) {
    rhoInput.value = scenario.rho;
    rhoInput.disabled = true;
    rhoInput.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    rhoInput.value = scenario.rho;
    rhoInput.disabled = false;
    rhoInput.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}
