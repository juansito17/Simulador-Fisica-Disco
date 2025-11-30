import { canvas, ctx, START_X, GROUND_Y, BASE_SCALE, currentScale } from './constants.js';

export function drawArrow(ctx2d, x1, y1, x2, y2, color, label) {
  ctx2d.strokeStyle = color; ctx2d.fillStyle = color; ctx2d.lineWidth = 3;
  ctx2d.beginPath(); ctx2d.moveTo(x1, y1); ctx2d.lineTo(x2, y2); ctx2d.stroke();
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx2d.beginPath(); ctx2d.moveTo(x2, y2);
  ctx2d.lineTo(x2 - 10 * Math.cos(ang - Math.PI / 6), y2 - 10 * Math.sin(ang - Math.PI / 6));
  ctx2d.lineTo(x2 - 10 * Math.cos(ang + Math.PI / 6), y2 - 10 * Math.sin(ang + Math.PI / 6));
  ctx2d.fill();
  ctx2d.font = 'bold 12px Arial';
  ctx2d.fillText(label, x2 + 10, y2 + 10);
}

export function drawFBD() {
  const c = document.getElementById('fbdCanvas');
  if (!c) return;
  const cx = c.getContext('2d');
  const w = c.width, h = c.height;

  cx.fillStyle = '#f8fafc'; cx.fillRect(0, 0, w, h);
  cx.strokeStyle = '#cbd5e1';
  cx.beginPath(); cx.moveTo(20, h / 2); cx.lineTo(w - 20, h / 2); cx.stroke();
  cx.beginPath(); cx.moveTo(w / 2, 20); cx.lineTo(w / 2, h - 20); cx.stroke();

  cx.save();
  cx.translate(w / 2, h / 2);
  cx.rotate((-25 * Math.PI) / 180);
  drawArrow(cx, 0, 0, 80, 0, '#22c55e', 'V');
  drawArrow(cx, 0, 0, -50, 0, '#ef4444', 'Fd');
  drawArrow(cx, 0, 0, 0, -60, '#3b82f6', 'Fl');
  cx.fillStyle = '#fbbf24'; cx.beginPath(); cx.ellipse(0, 0, 25, 6, 0, 0, Math.PI * 2); cx.fill();
  cx.restore();

  cx.save(); cx.translate(w / 2, h / 2);
  drawArrow(cx, 0, 0, 0, 70, '#1e293b', 'mg');
  cx.restore();
}

export function drawScene() {
  // Cielo con gradiente
  const gradient = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  gradient.addColorStop(0, '#87CEEB'); // Azul cielo claro
  gradient.addColorStop(1, '#E0F7FA'); // Cian muy claro cerca del horizonte
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, GROUND_Y);

  // Suelo
  ctx.fillStyle = '#2d6a4f'; 
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

  // Patrón de césped simple (opcional, para textura)
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  for (let i = 0; i < canvas.width; i += 20) {
      if ((i / 20) % 2 === 0) ctx.fillRect(i, GROUND_Y, 20, canvas.height - GROUND_Y);
  }

  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.font = '10px Arial'; ctx.textAlign = 'center';

  let step = 10;
  if (currentScale < 4) step = 20;
  if (currentScale < 2) step = 50;
  if (currentScale < 0.8) step = 100;

  const maxVisible = (canvas.width - START_X) / currentScale + 50;
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px Arial';

  for (let m = 0; m <= maxVisible; m += step) {
    const px = START_X + m * currentScale;
    if (px > -20 && px < canvas.width + 20) {
      // Marcas de distancia (Línea)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(px, GROUND_Y, 2, 8);
      
      // Texto (Blanco con sombra suave para legibilidad)
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      ctx.fillText(m + 'm', px, GROUND_Y + 22);
      ctx.shadowBlur = 0; // Resetear sombra
    }
  }

  // Jugador (Lanzador)
  const hPlayer = Math.max(2, 1.8 * currentScale);
  ctx.fillStyle = '#1e293b'; 
  ctx.fillRect(START_X - 3, GROUND_Y - hPlayer, 6, hPlayer);
  
  // Cabeza del jugador
  ctx.beginPath();
  ctx.arc(START_X, GROUND_Y - hPlayer - 2, 2, 0, Math.PI * 2);
  ctx.fill();
}

export function drawShadow(pt) {
  if (pt.y < 0) return; // No sombra si está bajo tierra (aunque la simulación para en 0)
  
  const px = START_X + pt.x * currentScale;
  const py = GROUND_Y; // La sombra siempre está en el suelo
  
  // La sombra se hace más pequeña y difusa cuanto más alto está el disco
  const shadowScale = Math.max(0.2, 1 - pt.y / 20); 
  const rw = Math.max(4, (10 * currentScale) / BASE_SCALE) * shadowScale;
  const rh = Math.max(1, (3 * currentScale) / BASE_SCALE) * shadowScale * 0.5; // Más aplastada

  ctx.save();
  ctx.translate(px, py);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Sombra semitransparente
  ctx.beginPath();
  ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawPath(pts, color, width) {
  if (pts.length < 2) return;
  ctx.beginPath(); 
  ctx.strokeStyle = color; 
  ctx.lineWidth = width;
  ctx.lineJoin = 'round'; // Suavizar uniones
  ctx.lineCap = 'round';

  // Dibujar solo los puntos visibles para optimizar si hay muchos
  // (Opcional, pero bueno para rendimiento)
  
  ctx.moveTo(START_X + pts[0].x * currentScale, GROUND_Y - pts[0].y * currentScale);
  for (let i = 1; i < pts.length; i++) {
    const px = START_X + pts[i].x * currentScale;
    const py = GROUND_Y - pts[i].y * currentScale;
    ctx.lineTo(px, py);
  }
  ctx.stroke();
}

export function drawDiscSprite(pt) {
  const px = START_X + pt.x * currentScale;
  const py = GROUND_Y - pt.y * currentScale;
  
  ctx.save(); 
  ctx.translate(px, py);
  
  // Rotación física del disco (ángulo de ataque + trayectoria)
  // Nota: pt.vx y pt.vy dan la dirección de la velocidad. 
  // El disco tiene su propia actitud. En la simulación simplificada, 
  // a veces se asume alineado o con una función de decaimiento.
  // Usaremos la dirección de la velocidad para visualizar el movimiento,
  // o un ángulo fijo si queremos simular el giro sobre su eje (spin).
  // Para efecto visual, rotamos según la trayectoria:
  const angle = Math.atan2(pt.vy, pt.vx);
  ctx.rotate(-angle);

  const rw = Math.max(4, (12 * currentScale) / BASE_SCALE); // Un poco más grande
  const rh = Math.max(2, (3.5 * currentScale) / BASE_SCALE);

  // Cuerpo del disco (Gradiente para dar volumen)
  const grad = ctx.createLinearGradient(0, -rh, 0, rh);
  grad.addColorStop(0, '#fcd34d'); // Amarillo claro arriba
  grad.addColorStop(0.5, '#f59e0b'); // Naranja en medio
  grad.addColorStop(1, '#b45309'); // Marrón abajo
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Borde metálico
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Brillo especular (reflejo)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.ellipse(-rw * 0.3, -rh * 0.3, rw * 0.2, rh * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
