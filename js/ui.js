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
  return { v0, ang, h0, wind, rho, g, m, area, cdBase: cd, clFactor: cl };
}

export function initAngleControls() {
  const angleInput = document.getElementById('launchAngle');
  const slider = document.getElementById('launchAngleSlider');
  if (!angleInput || !slider) return;
  slider.addEventListener('input', (e) => { angleInput.value = e.target.value; });
  angleInput.addEventListener('input', (e) => { slider.value = e.target.value; });
}
