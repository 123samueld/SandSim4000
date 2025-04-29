// ProfilingTools.js
import { getGridConfig, getReadBuffer, getWriteBuffer, getParticleType, isMoving, getMousePosition, isMouseButtonDown, getGridPositionFromMouse } from './Initialise.js';

let fpsDisplayElement = null;
let particleDisplayElement = null;
let fpsFrames = 0;
let fpsLastTime = Date.now();
let showChunkGrid = false;
let frameTimes = [];
let lastFrameTime = Date.now();

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
