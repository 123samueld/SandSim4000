//Rendering.js
// Responsibility: Visual rendering of the simulation state
import { getGridConfig, getCanvasContext } from './Initialise.js';
import { getReadBuffer, getIndexFromPosition, ParticleType } from './ParticleGrid.js';

// Particle colors
const colors = {
    [ParticleType.EMPTY]: '#000000',
    [ParticleType.SAND]: '#C2B280',
    [ParticleType.WATER]: '#1E90FF',
    [ParticleType.STONE]: '#808080'
};

export function render() {
    const gridConfig = getGridConfig();
    const { cols, rows, cellSize } = gridConfig;
    const readBuffer = getReadBuffer();
    const ctx = getCanvasContext();

    // Clear canvas
    ctx.fillStyle = colors[ParticleType.EMPTY];
    ctx.fillRect(0, 0, cols * cellSize, rows * cellSize);

    // Draw particles
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const index = getIndexFromPosition(x, y);
            const particleType = readBuffer.typeArray[index];
            
            if (particleType !== ParticleType.EMPTY) {
                ctx.fillStyle = colors[particleType];
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}