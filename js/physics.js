// Cálculo de coeficientes y dinámica RK4

export function getCoefficients(alphaDeg, cdBase, clFactor) {
  let cd = cdBase + 0.00035 * Math.pow(alphaDeg, 2);
  cd = Math.max(cd, 0.01);
  let cl = clFactor * Math.sin((2.0 * alphaDeg) * (Math.PI / 180));
  return { cd, cl };
}

export function getDerivatives(state, t, params) {
  const { vx, vy } = state;
  const { wind, m, cdBase, clFactor, rho, area, g } = params;

  let vr_x = vx - wind;
  let vr_y = vy;
  let v_rel_sq = vr_x * vr_x + vr_y * vr_y;
  let v_rel = Math.sqrt(v_rel_sq);

  if (v_rel < 0.01) return { dx: vx, dy: vy, dvx: 0, dvy: -g };

  let gamma_rad = Math.atan2(vr_y, vr_x);
  let gamma_deg = (gamma_rad * 180) / Math.PI;
  let disk_attitude_deg = 30.0 * Math.exp(-0.05 * t);
  let alpha_deg = Math.max(-20, Math.min(60, disk_attitude_deg - gamma_deg));
  let { cd, cl } = getCoefficients(alpha_deg, cdBase, clFactor);
  let q = 0.5 * rho * v_rel_sq * area;
  let F_drag = q * cd;
  let F_lift = q * cl;
  let fx = -F_drag * Math.cos(gamma_rad) - F_lift * Math.sin(gamma_rad);
  let fy = -F_drag * Math.sin(gamma_rad) + F_lift * Math.cos(gamma_rad) - m * g;

  return { dx: vx, dy: vy, dvx: fx / m, dvy: fy / m };
}

export function rk4Step(state, t, dt, params) {
  let d1 = getDerivatives(state, t, params);
  let s2 = {
    x: state.x + (d1.dx * dt) / 2,
    y: state.y + (d1.dy * dt) / 2,
    vx: state.vx + (d1.dvx * dt) / 2,
    vy: state.vy + (d1.dvy * dt) / 2,
  };
  let d2 = getDerivatives(s2, t + dt / 2, params);
  let s3 = {
    x: state.x + (d2.dx * dt) / 2,
    y: state.y + (d2.dy * dt) / 2,
    vx: state.vx + (d2.dvx * dt) / 2,
    vy: state.vy + (d2.dvy * dt) / 2,
  };
  let d3 = getDerivatives(s3, t + dt / 2, params);
  let s4 = {
    x: state.x + d3.dx * dt,
    y: state.y + d3.dy * dt,
    vx: state.vx + d3.dvx * dt,
    vy: state.vy + d3.dvy * dt,
  };
  let d4 = getDerivatives(s4, t + dt, params);

  return {
    x: state.x + (dt / 6) * (d1.dx + 2 * d2.dx + 2 * d3.dx + d4.dx),
    y: state.y + (dt / 6) * (d1.dy + 2 * d2.dy + 2 * d3.dy + d4.dy),
    vx: state.vx + (dt / 6) * (d1.dvx + 2 * d2.dvx + 2 * d3.dvx + d4.dvx),
    vy: state.vy + (dt / 6) * (d1.dvy + 2 * d2.dvy + 2 * d3.dvy + d4.dvy),
  };
}

export function calculateTrajectory(v0, angleDeg, params) {
  let dt = 0.02;
  let t = 0;
  let rad = (angleDeg * Math.PI) / 180;
  let state = { x: 0, y: params.h0, vx: v0 * Math.cos(rad), vy: v0 * Math.sin(rad) };
  let points = [];

  while (state.y >= 0 && state.x < 5000 && t < 300) {
    points.push({ ...state, t });
    state = rk4Step(state, t, dt, params);
    t += dt;
    if (state.y < 0) {
      let prev = points[points.length - 1];
      let frac = (0 - prev.y) / (state.y - prev.y);
      state.x = prev.x + frac * (state.x - prev.x);
      state.y = 0;
      state.t = prev.t + frac * dt;
      points.push({ ...state });
      break;
    }
  }
  return points;
}
