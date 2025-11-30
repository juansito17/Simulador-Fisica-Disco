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
