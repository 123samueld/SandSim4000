import { initCanvas, initGrid, initGameStateBuffers, initMouseInput, spawnInitialParticles } from './Initialise.js';
import { initProfilingTools, fpsCounter } from './ProfilingTools.js';
import { renderingLoop } from './Rendering.js';
import { simulationLoop } from './Simulation.js';

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
    spawnInitialParticles();
    
    // Render the particles
    renderingLoop();
    
    // Update performance metrics
    fpsCounter();
    
    // Continue looping
    requestAnimationFrame(gameLoop);
}
