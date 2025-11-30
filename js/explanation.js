import { getCoefficients } from './physics.js';

export function initCoeffChart() {
  const ctx = document.getElementById('coeffChart')?.getContext('2d');
  if (!ctx || typeof Chart === 'undefined') return;

  // Generar datos para la gráfica
  const labels = [];
  const dataCd = [];
  const dataCl = [];

  // Parámetros base típicos para la visualización
  const cdBase = 0.08;
  const clFactor = 0.7;

  for (let alpha = -20; alpha <= 90; alpha += 2) {
    labels.push(alpha);
    const { cd, cl } = getCoefficients(alpha, cdBase, clFactor);
    dataCd.push(cd);
    dataCl.push(cl);
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Coef. Arrastre (Cd)',
          data: dataCd,
          borderColor: '#ef4444', // Rojo
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Coef. Sustentación (Cl)',
          data: dataCl,
          borderColor: '#3b82f6', // Azul
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            title: (context) => `Ángulo de Ataque: ${context[0].label}°`
          }
        },
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              xMin: 0,
              xMax: 0,
              borderColor: 'rgba(0,0,0,0.3)',
              borderWidth: 1,
              borderDash: [5, 5],
              label: {
                content: 'Vuelo Plano',
                enabled: true,
                position: 'start'
              }
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Ángulo de Ataque (α) [grados]'
          },
          grid: {
            color: (context) => context.tick.value === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Valor del Coeficiente'
          },
          min: -0.5,
          max: 1.5
        }
      }
    }
  });
}
