// ProfilingTools.js
// Responsibility: Performance monitoring and debugging tools for the simulation
import { getGridConfig, getMousePosition, isMouseButtonDown, getGridPositionFromMouse } from './Initialise.js';
import { getReadBuffer, ParticleType } from './ParticleGrid.js';

let fpsDisplayElement = null;
let particleDisplayElement = null;
let fpsFrames = 0;
let fpsLastTime = Date.now();
let showChunkGrid = false;
let frameTimes = [];
let lastFrameTime = performance.now();
let particleCounts = {
    [ParticleType.EMPTY]: 0,
    [ParticleType.SAND]: 0,
    [ParticleType.WATER]: 0,
    [ParticleType.STONE]: 0
};

// Initialize profiling tools UI and behaviors
export function initProfilingTools() {
  // Grid toggle button
  const toggleBtn = document.getElementById('toggleGrid');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      showChunkGrid = !showChunkGrid;
      toggleBtn.classList.toggle('active', showChunkGrid);
    });
  }

  // FPS display element
  fpsDisplayElement = document.getElementById('fpsDisplay');
  particleDisplayElement = document.getElementById('particleDisplay');
}

export function updateFrameTime() {
    const currentTime = performance.now();
    const frameTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    frameTimes.push(frameTime);
    if (frameTimes.length > 60) {
        frameTimes.shift();
    }
}

export function getAverageFrameTime() {
    if (frameTimes.length === 0) return 0;
    return frameTimes.reduce((a, b) => a + b) / frameTimes.length;
}

export function updateParticleCounts() {
    const readBuffer = getReadBuffer();
    const gridConfig = getGridConfig();
    const { totalCells } = gridConfig;
    
    // Reset counts
    Object.keys(particleCounts).forEach(type => {
        particleCounts[type] = 0;
    });
    
    // Count particles
    for (let i = 0; i < totalCells; i++) {
        const type = readBuffer.typeArray[i];
        particleCounts[type]++;
    }
}

export function getParticleCounts() {
    return particleCounts;
}

export function getFPS() {
    const avgFrameTime = getAverageFrameTime();
    return avgFrameTime > 0 ? Math.round(1000 / avgFrameTime) : 0;
}

export function fpsCounter() {
  if (!fpsDisplayElement || !particleDisplayElement) return;

  // Track frame time
  const now = Date.now();
  const frameTime = now - lastFrameTime;
  lastFrameTime = now;
  frameTimes.push(frameTime);
  
  // Keep only last 60 frames
  if (frameTimes.length > 60) {
    frameTimes.shift();
  }

  // Count this frame
  fpsFrames++;
  const delta = now - fpsLastTime;

  // Update display every second
  if (delta >= 1000) {
    const fps = fpsFrames;
    const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    fpsFrames = 0;
    fpsLastTime = now;
    
    // Update FPS display with frame time
    const fpsSpan = fpsDisplayElement.querySelector('span');
    if (fpsSpan) {
      fpsSpan.textContent = `FPS: ${fps}`;
    }

    // Count and display moving particles
    const readBuffer = getReadBuffer();
    let movingParticles = 0;
    for (let i = 0; i < readBuffer.length; i++) {
      if (isMoving(readBuffer[i])) { // Only count particles that are moving
        movingParticles++;
      }
    }
    
    const particleSpan = particleDisplayElement.querySelector('span');
    if (particleSpan) {
      particleSpan.textContent = `Moving Particles: ${movingParticles}`;
    }

  }
}

export function logParticleEntitySize() {
  console.log('Particle Entity Size:');
  console.log('-------------------');
  console.log(`- Type: 3 bits`);
  console.log(`- isMoving: 1 bit`);
  console.log(`- Total: 4 bits (1 byte)`);
}

export function logBufferSize() {
  const gridConfig = getGridConfig();
  const bufferSize = gridConfig.totalCells; // Each cell is 1 byte
  
  console.log('Game State Buffer Size:');
  console.log('---------------------');
  console.log(`- Grid Size: ${gridConfig.cols}x${gridConfig.rows} cells`);
  console.log(`- Total Cells: ${gridConfig.totalCells}`);
  console.log(`- Cell Size: ${gridConfig.cellSize}px`);
  console.log(`- Bytes per Cell: 1`);
  console.log(`- Total Buffer Size: ${bufferSize} bytes (${(bufferSize / 1024).toFixed(2)} KB)`);
}
