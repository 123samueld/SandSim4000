//ParticleGrid.js
// Responsibility: Data storage and management of particle grid structure
import { getGridConfig, getGridPositionFromMouse, isMouseButtonDown } from './Initialise.js';

// Particle types enum - using 2 bits (values 0-3)
export const ParticleType = {
    EMPTY: 0,   // 00
    SAND: 1,    // 01
    WATER: 2,   // 10
    STONE: 3    // 11
};

// Struct of Arrays (SoA) implementation
let typeArray;          // Uint8Array for particle types
let movingArray;        // Uint8Array for movement state (bit-packed booleans)
let velocityXArray;     // Uint8Array for X velocity
let velocityYArray;     // Uint8Array for Y velocity

// Helper functions for bit-packed boolean array
function getBit(array, index) {
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;
    return (array[byteIndex] & (1 << bitIndex)) !== 0;
}

function setBit(array, index, value) {
    const byteIndex = Math.floor(index / 8);
    const bitIndex = index % 8;
    if (value) {
        array[byteIndex] |= (1 << bitIndex);
    } else {
        array[byteIndex] &= ~(1 << bitIndex);
    }
}

export function initialiseParticleGrid() {
    const gridConfig = getGridConfig();
    if (!gridConfig) {
        throw new Error('Grid not initialized. Call initGrid() first.');
    }

    // Initialize separate arrays for each property
    typeArray = new Uint8Array(gridConfig.totalCells);
    // Calculate size needed for bit-packed booleans (1 byte per 8 booleans)
    movingArray = new Uint8Array(Math.ceil(gridConfig.totalCells / 8));
    velocityXArray = new Uint8Array(gridConfig.totalCells);
    velocityYArray = new Uint8Array(gridConfig.totalCells);
}

export function getReadBuffer() {
    return {
        typeArray,
        movingArray,
        velocityXArray,
        velocityYArray,
        getMoving: (index) => getBit(movingArray, index)
    };
}

export function getWriteBuffer() {
    return {
        typeArray,
        movingArray,
        velocityXArray,
        velocityYArray,
        setMoving: (index, value) => setBit(movingArray, index, value),
        getMoving: (index) => getBit(movingArray, index)
    };
}

// Helper functions for position calculations
export function getIndexFromPosition(x, y) {
    const gridConfig = getGridConfig();
    return y * gridConfig.cols + x;
}

export function getPositionFromIndex(index) {
    const gridConfig = getGridConfig();
    return {
        x: index % gridConfig.cols,
        y: Math.floor(index / gridConfig.cols)
    };
}

export function isValidPosition(x, y) {
    const gridConfig = getGridConfig();
    return x >= 0 && x < gridConfig.cols && y >= 0 && y < gridConfig.rows;
}

export function spawnParticles() {
    const { cols, rows } = getGridConfig();
    
    // Get mouse position in grid coordinates
    const { x: mouseX, y: mouseY } = getGridPositionFromMouse();
    
    // Only spawn if mouse button is down and position is valid
    if (isMouseButtonDown() && isValidPosition(mouseX, mouseY)) {
        // Random number of particles between 2 and 7
        const numParticles = Math.floor(Math.random() * 6) + 10;
        
        for (let i = 0; i < numParticles; i++) {
            // Random x offset between -2 and 2 cells
            const offsetX = Math.floor(Math.random() * 5) - 2;
            const spawnX = mouseX + offsetX;
            
            // Only spawn if the position is valid
            if (isValidPosition(spawnX, mouseY)) {
                const index = getIndexFromPosition(spawnX, mouseY);
                typeArray[index] = ParticleType.SAND;
                setBit(movingArray, index, true);
                velocityXArray[index] = 1;
                velocityYArray[index] = 4;
            }
        }
    }
}