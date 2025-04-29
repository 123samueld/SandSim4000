//Rendering.js
import { getReadBuffer, getCanvasContext, getGridConfig, getParticleType } from './Initialise.js';

// Color mapping for particle types
const PARTICLE_COLORS = {
    0: '#000000', // EMPTY
    1: '#C2B280', // SAND
    2: '#1E90FF', // WATER
    3: '#808080', // STONE
    4: '#FF4500', // FIRE
    5: '#708090', // SMOKE
    6: '#4B0082', // OIL
    7: '#32CD32'  // ACID
};

export function renderingLoop() {
    const readBuffer = getReadBuffer();
    const ctx = getCanvasContext();
    const gridConfig = getGridConfig();
    const { cols, rows, cellSize } = gridConfig;

    // Clear the canvas
    ctx.clearRect(0, 0, cols * cellSize, rows * cellSize);

    // Draw particles from the read buffer
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const index = y * cols + x;
            const currentCell = readBuffer[index];
            const currentType = getParticleType(currentCell);
            
            // Skip empty cells
            if (currentType === 0) continue;

            // Draw the particle
            ctx.fillStyle = PARTICLE_COLORS[currentType];
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}