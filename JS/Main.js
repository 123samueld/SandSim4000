// Main.js
// Responsibility: Application entry point and main game loop coordination
import { initCanvas, initGrid, initGameStateBuffers, initMouseInput } from './Initialise.js';
import { initProfilingTools, fpsCounter } from './ProfilingTools.js';
import { render } from './Rendering.js';
import { simulationLoop } from './Simulation.js';
import { spawnParticles } from './ParticleGrid.js';

document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initProfilingTools();
    initGrid();
    initGameStateBuffers();
    initMouseInput();
    gameLoop();
});

function gameLoop() {
    // Run simulation
    simulationLoop();
    
    // Spawn particles at mouse position if button is down
    spawnParticles();
    
    // Render the particles
    render();
    
    // Update performance metrics
    fpsCounter();
    
    // Continue looping
    requestAnimationFrame(gameLoop);
}
