//Simulation.js
// Responsibility: Simulation timing, coordination, and overall simulation state management
import { getGridConfig } from './Initialise.js';
import { getWriteBuffer, getIndexFromPosition, isValidPosition, ParticleType } from './ParticleGrid.js';

let frameCount = 0;

function moveParticle(writeBuffer, x, y, currentIndex) {
    const gridConfig = getGridConfig();
    const { rows } = gridConfig;
    const velocityY = writeBuffer.velocityYArray[currentIndex];
    const currentType = writeBuffer.typeArray[currentIndex];
    
    // Try to move down first
    let moveDistance = velocityY;
    let targetY = y + moveDistance;
    
    // If we can't move the full distance, try shorter distances
    while (moveDistance > 0) {
        targetY = y + moveDistance;
        
        // Check if target position is valid
        if (targetY >= rows) {
            moveDistance--;
            continue;
        }
        
        const targetIndex = getIndexFromPosition(x, targetY);
        const targetType = writeBuffer.typeArray[targetIndex];
        
        // If target cell is empty, move the particle
        if (targetType === ParticleType.EMPTY) {
            // Move particle to target position
            writeBuffer.typeArray[targetIndex] = currentType;
            writeBuffer.velocityYArray[targetIndex] = velocityY;
            writeBuffer.velocityXArray[targetIndex] = writeBuffer.velocityXArray[currentIndex];
            writeBuffer.movingArray[targetIndex] = 1;
            
            // Clear current cell
            writeBuffer.typeArray[currentIndex] = ParticleType.EMPTY;
            writeBuffer.movingArray[currentIndex] = 0;
            return true;
        }
        
        moveDistance--;
    }

    // If we couldn't move down, try horizontal movement based on particle type
    return tryHorizontalMove(writeBuffer, x, y, currentIndex);
}

function tryHorizontalMove(writeBuffer, x, y, currentIndex) {
    const currentType = writeBuffer.typeArray[currentIndex];
    const velocityX = writeBuffer.velocityXArray[currentIndex];

    switch (currentType) {
        case ParticleType.SAND:
            return sandHorizontalMove(writeBuffer, x, y, currentIndex, velocityX);
        case ParticleType.WATER:
            // Add water horizontal movement later
            return false;
        case ParticleType.STONE:
            // Stones don't move horizontally
            return false;
        default:
            return false;
    }
}

function sandHorizontalMove(writeBuffer, x, y, currentIndex, velocityX) {
    // Try down-left
    const downLeftX = x - velocityX;
    const downLeftY = y + 1;
    if (isValidPosition(downLeftX, downLeftY)) {
        const downLeftIndex = getIndexFromPosition(downLeftX, downLeftY);
        if (writeBuffer.typeArray[downLeftIndex] === ParticleType.EMPTY) {
            writeBuffer.typeArray[downLeftIndex] = ParticleType.SAND;
            writeBuffer.velocityYArray[downLeftIndex] = writeBuffer.velocityYArray[currentIndex];
            writeBuffer.velocityXArray[downLeftIndex] = velocityX;
            writeBuffer.movingArray[downLeftIndex] = 1;
            
            writeBuffer.typeArray[currentIndex] = ParticleType.EMPTY;
            writeBuffer.movingArray[currentIndex] = 0;
            return true;
        }
    }

    // Try down-right
    const downRightX = x + velocityX;
    const downRightY = y + 1;
    if (isValidPosition(downRightX, downRightY)) {
        const downRightIndex = getIndexFromPosition(downRightX, downRightY);
        if (writeBuffer.typeArray[downRightIndex] === ParticleType.EMPTY) {
            writeBuffer.typeArray[downRightIndex] = ParticleType.SAND;
            writeBuffer.velocityYArray[downRightIndex] = writeBuffer.velocityYArray[currentIndex];
            writeBuffer.velocityXArray[downRightIndex] = velocityX;
            writeBuffer.movingArray[downRightIndex] = 1;
            
            writeBuffer.typeArray[currentIndex] = ParticleType.EMPTY;
            writeBuffer.movingArray[currentIndex] = 0;
            return true;
        }
    }

    return false;
}

export function simulationLoop() {
    frameCount++;

    const writeBuffer = getWriteBuffer();
    const gridConfig = getGridConfig();
    const { cols, rows } = gridConfig;

    // Iterate through the grid from bottom to top
    for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
            const currentIndex = getIndexFromPosition(x, y);
            const currentType = writeBuffer.typeArray[currentIndex];

            // Skip empty cells
            if (currentType === ParticleType.EMPTY) continue;

            // Try to move the particle
            moveParticle(writeBuffer, x, y, currentIndex);
        }
    }
}