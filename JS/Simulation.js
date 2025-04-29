//Simulation.js
import { getWriteBuffer, getGridConfig, getIndexFromPosition, isValidPosition, 
         getParticleType, setParticleType, setMoving, isMoving, 
         getVelocityX, setVelocityX, getVelocityY, setVelocityY, ParticleType } from './Initialise.js';

let frameCount = 0;

function moveParticle(writeBuffer, x, y, currentIndex, currentCell) {
    const gridConfig = getGridConfig();
    const { rows } = gridConfig;
    const velocityY = getVelocityY(currentCell);
    const currentType = getParticleType(currentCell);
    
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
        const targetType = getParticleType(writeBuffer[targetIndex]);
        
        // If target cell is empty, move the particle
        if (targetType === ParticleType.EMPTY) {
            // Move particle to target position
            writeBuffer[targetIndex] = setParticleType(writeBuffer[targetIndex], currentType);
            writeBuffer[targetIndex] = setVelocityY(writeBuffer[targetIndex], velocityY);
            writeBuffer[targetIndex] = setVelocityX(writeBuffer[targetIndex], getVelocityX(currentCell));
            
            // Clear current cell
            writeBuffer[currentIndex] = setParticleType(writeBuffer[currentIndex], ParticleType.EMPTY);
            return true;
        }
        
        moveDistance--;
    }

    // If we couldn't move down, try horizontal movement based on particle type
    return tryHorizontalMove(writeBuffer, x, y, currentIndex, currentCell);
}

function tryHorizontalMove(writeBuffer, x, y, currentIndex, currentCell) {
    const currentType = getParticleType(currentCell);
    const velocityX = getVelocityX(currentCell);

    switch (currentType) {
        case ParticleType.SAND:
            return sandHorizontalMove(writeBuffer, x, y, currentIndex, currentCell, velocityX);
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

function sandHorizontalMove(writeBuffer, x, y, currentIndex, currentCell, velocityX) {
    // Try down-left
    const downLeftX = x - velocityX;
    const downLeftY = y + 1;
    if (isValidPosition(downLeftX, downLeftY)) {
        const downLeftIndex = getIndexFromPosition(downLeftX, downLeftY);
        if (getParticleType(writeBuffer[downLeftIndex]) === ParticleType.EMPTY) {
            writeBuffer[downLeftIndex] = setParticleType(writeBuffer[downLeftIndex], ParticleType.SAND);
            writeBuffer[downLeftIndex] = setVelocityY(writeBuffer[downLeftIndex], getVelocityY(currentCell));
            writeBuffer[downLeftIndex] = setVelocityX(writeBuffer[downLeftIndex], velocityX);
            writeBuffer[currentIndex] = setParticleType(writeBuffer[currentIndex], ParticleType.EMPTY);
            return true;
        }
    }

    // Try down-right
    const downRightX = x + velocityX;
    const downRightY = y + 1;
    if (isValidPosition(downRightX, downRightY)) {
        const downRightIndex = getIndexFromPosition(downRightX, downRightY);
        if (getParticleType(writeBuffer[downRightIndex]) === ParticleType.EMPTY) {
            writeBuffer[downRightIndex] = setParticleType(writeBuffer[downRightIndex], ParticleType.SAND);
            writeBuffer[downRightIndex] = setVelocityY(writeBuffer[downRightIndex], getVelocityY(currentCell));
            writeBuffer[downRightIndex] = setVelocityX(writeBuffer[downRightIndex], velocityX);
            writeBuffer[currentIndex] = setParticleType(writeBuffer[currentIndex], ParticleType.EMPTY);
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
            const currentCell = writeBuffer[currentIndex];
            const currentType = getParticleType(currentCell);

            // Skip empty cells
            if (currentType === ParticleType.EMPTY) continue;

            // Try to move the particle
            moveParticle(writeBuffer, x, y, currentIndex, currentCell);
        }
    }
}