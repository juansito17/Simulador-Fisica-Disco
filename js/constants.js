export const canvas = document.getElementById('simCanvas');
export const ctx = canvas.getContext('2d');

export const BASE_SCALE = 8;
export const START_X = 50;
export const GROUND_Y = 350;

export let currentScale = BASE_SCALE;
export const setCurrentScale = (v) => { currentScale = v; };
export const resetScale = () => { currentScale = BASE_SCALE; };

export const trails = [];
export const pushTrail = (pts) => { trails.push(pts); };
export const clearTrails = () => { trails.length = 0; };

// Definición de los 4 escenarios según el planteamiento del profesor
export const SCENARIOS = {
    1: {
        name: "Sin Viento, Sin Rozamiento",
        shortName: "Escenario 1",
        wind: 0,
        rho: 0,
        color: "#10b981", // verde
        windLocked: true,
        rhoLocked: true
    },
    2: {
        name: "Sin Viento, Con Rozamiento",
        shortName: "Escenario 2",
        wind: 0,
        rho: 1.225,
        color: "#3b82f6", // azul
        windLocked: true,
        rhoLocked: false
    },
    3: {
        name: "Con Viento, Sin Rozamiento",
        shortName: "Escenario 3",
        wind: 5,
        rho: 0,
        color: "#f59e0b", // amarillo
        windLocked: false,
        rhoLocked: true
    },
    4: {
        name: "Con Viento, Con Rozamiento",
        shortName: "Escenario 4",
        wind: 5,
        rho: 1.225,
        color: "#ef4444", // rojo
        windLocked: false,
        rhoLocked: false
    }
};

export let currentScenario = 4; // Por defecto: escenario completo
export const setCurrentScenario = (id) => { currentScenario = id; };
export const getCurrentScenario = () => SCENARIOS[currentScenario];
