// Initialise.js
import { } from './Simulation.js';

let canvasRef, ctxRef;
let gridConfig;
let gameStateBuffer; // Single buffer instead of two

// Mouse input variables
let mouseX = 0;
let mouseY = 0;
let isMouseDown = false;

// Particle types enum - using 2 bits (values 0-3)
export const ParticleType = {
    EMPTY: 0,   // 00
    SAND: 1,    // 01
    WATER: 2,   // 10
    STONE: 3    // 11
};

// Bit masks for the packed byte
export const TYPE_MASK = 0b00000011;  // First 2 bits for particle type
export const MOVING_MASK = 0b00000100; // 3rd bit for movement state
export const VELOCITY_X_MASK = 0b00011000; // 4th and 5th bits for velocity X (0-3)
export const VELOCITY_Y_MASK = 0b01100000; // 6th and 7th bits for velocity Y (0-3)
// Remaining 1 bit (0b10000000) is reserved for future use

// Helper functions to pack/unpack the byte
export function setParticleType(cellState, type) {
    return (cellState & ~TYPE_MASK) | (type & TYPE_MASK);
}

export function getParticleType(cellState) {
    return cellState & TYPE_MASK;
}

export function setMoving(cellState, isMoving) {
    return isMoving ? (cellState | MOVING_MASK) : (cellState & ~MOVING_MASK);
}

export function isMoving(cellState) {
    return (cellState & MOVING_MASK) !== 0;
}

export function setVelocityX(cellState, velocity) {
    // Subtract 1 from velocity before storing (since 0 represents velocity 1)
    const storedVelocity = Math.max(0, velocity - 1);
    return (cellState & ~VELOCITY_X_MASK) | ((storedVelocity & 0b11) << 3);
}

export function getVelocityX(cellState) {
    // Add 1 to the stored velocity (since 0 represents velocity 1)
    return ((cellState & VELOCITY_X_MASK) >> 3) + 1;
}

export function setVelocityY(cellState, velocity) {
    // Subtract 1 from velocity before storing (since 0 represents velocity 1)
    const storedVelocity = Math.max(0, velocity - 1);
    return (cellState & ~VELOCITY_Y_MASK) | ((storedVelocity & 0b11) << 5);
}

export function getVelocityY(cellState) {
    // Add 1 to the stored velocity (since 0 represents velocity 1)
    return ((cellState & VELOCITY_Y_MASK) >> 5) + 1;
}

export function initCanvas() {
    canvasRef = document.getElementById('sandCanvas');
    ctxRef = canvasRef.getContext('2d');

    // Set CSS size
    canvasRef.style.width = '1200px';
    canvasRef.style.height = '800px';
    
    // Set internal resolution to match CSS size
    canvasRef.width = 1200;
    canvasRef.height = 800;
    
    // Disable image smoothing for crisp pixels
    ctxRef.imageSmoothingEnabled = false;
}

export function getCanvasContext() {
    return ctxRef;
}

export function initGrid() {
    const cellSize = 4; 

    if (!canvasRef) {
        throw new Error('Canvas not initialized. Call initCanvas() first.');
    }

    // Calculate number of columns and rows
    const cols = Math.floor(canvasRef.width / cellSize);
    const rows = Math.floor(canvasRef.height / cellSize);
    const totalCells = cols * rows;

    gridConfig = { cols, rows, cellSize, totalCells };
    return gridConfig;
}

export function initGameStateBuffers() {
    if (!gridConfig) {
        throw new Error('Grid not initialized. Call initGrid() first.');
    }

    // Initialize single buffer with empty cells (all zeros)
    gameStateBuffer = new Uint8Array(gridConfig.totalCells);

    // Spawn some initial particles
    spawnInitialParticles();
}

// Export the spawn function
export function spawnInitialParticles() {
    const { cols, rows } = gridConfig;
    
    // Get mouse position in grid coordinates
    const { x: mouseX, y: mouseY } = getGridPositionFromMouse();
    
    // Only spawn if mouse button is down and position is valid
    if (isMouseButtonDown() && isValidPosition(mouseX, mouseY)) {
        // Random number of particles between 2 and 7
        const numParticles = Math.floor(Math.random() * 6) + 2;
        
        for (let i = 0; i < numParticles; i++) {
            // Random x offset between -2 and 2 cells
            const offsetX = Math.floor(Math.random() * 5) - 2;
            const spawnX = mouseX + offsetX;
            
            // Only spawn if the position is valid
            if (isValidPosition(spawnX, mouseY)) {
                const index = getIndexFromPosition(spawnX, mouseY);
                let cellState = 0; // Start with empty cell
                cellState = setParticleType(cellState, ParticleType.SAND);
                cellState = setVelocityY(cellState, 4); // Set initial Y velocity to 4
                cellState = setVelocityX(cellState, 1); // Set initial X velocity to 1
                gameStateBuffer[index] = cellState;
            }
        }
    }
}

export function getReadBuffer() {
    return gameStateBuffer;
}

export function getWriteBuffer() {
    return gameStateBuffer;
}

export function getGridConfig() {
    return gridConfig;
}

// Helper functions for position calculations
export function getIndexFromPosition(x, y) {
    return y * gridConfig.cols + x;
}

export function getPositionFromIndex(index) {
    return {
        x: index % gridConfig.cols,
        y: Math.floor(index / gridConfig.cols)
    };
}

export function isValidPosition(x, y) {
    return x >= 0 && x < gridConfig.cols && y >= 0 && y < gridConfig.rows;
}

export function initMouseInput() {
    const canvas = canvasRef;
    
    // Get mouse position relative to canvas
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        // Offset x by -5 pixels to correct alignment
        mouseX = event.clientX - rect.left - 5;
        mouseY = event.clientY - rect.top;
    });

    // Track mouse button state
    canvas.addEventListener('mousedown', () => {
        isMouseDown = true;
    });

    canvas.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    // Prevent default behavior for mouse events
    canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });
}

export function getMousePosition() {
    return { x: mouseX, y: mouseY };
}

export function isMouseButtonDown() {
    return isMouseDown;
}

// Convert screen coordinates to grid coordinates
export function getGridPositionFromMouse() {
    const { cellSize } = gridConfig;
    
    // Round to nearest grid cell instead of flooring
    return {
        x: Math.round(mouseX / cellSize),
        y: Math.round(mouseY / cellSize)
    };
}