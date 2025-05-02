//Simulation.js
// Responsibility: Simulation timing, coordination, and overall simulation state management
import { getGridConfig } from './Initialise.js';
import { getWriteBuffer, getIndexFromPosition, isValidPosition, ParticleType } from './ParticleGrid.js';

let frameCount = 0;

function moveParticle(writeBuffer, x, y, currentIndex) {
    const velocityY = writeBuffer.velocityYArray[currentIndex];
    const velocityX = writeBuffer.velocityXArray[currentIndex];
    const currentType = writeBuffer.typeArray[currentIndex];
    
    const gridConfig = getGridConfig();
    const { rows } = gridConfig;
    
    // Try to move down first
    let moveDistance = velocityY;
    let targetY = y + moveDistance;
    
    while (moveDistance > 0) {
        targetY = y + moveDistance;
        
        if (targetY >= rows) {
            moveDistance--;
            continue;
        }
        
        const targetIndex = getIndexFromPosition(x, targetY);
        const targetType = writeBuffer.typeArray[targetIndex];
        
        if (targetType === ParticleType.EMPTY) {
            writeBuffer.typeArray[targetIndex] = currentType;
            writeBuffer.velocityYArray[targetIndex] = velocityY;
            writeBuffer.velocityXArray[targetIndex] = writeBuffer.velocityXArray[currentIndex];
            writeBuffer.setMoving(targetIndex, true);
            
            writeBuffer.typeArray[currentIndex] = ParticleType.EMPTY;
            writeBuffer.setMoving(currentIndex, false);
            return true;
        }
        
        moveDistance--;
    }

    // Couldn't fall vertically — apply splash and try horizontal
    //splash(writeBuffer, currentIndex);
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
    const currentVelY = writeBuffer.velocityYArray[currentIndex];

    const applySplashX = (dir) => {
        const splashFactor = 0.1 + Math.random() * 0.4; // 10%–50% of vertical velocity
        return dir * (Math.abs(currentVelY) * splashFactor);
    };

    // Try down-left
    const downLeftX = x - 1;
    const downLeftY = y + 1;
    if (isValidPosition(downLeftX, downLeftY)) {
        const downLeftIndex = getIndexFromPosition(downLeftX, downLeftY);
        if (writeBuffer.typeArray[downLeftIndex] === ParticleType.EMPTY) {
            writeBuffer.typeArray[downLeftIndex] = ParticleType.SAND;
            writeBuffer.velocityYArray[downLeftIndex] = currentVelY;
            writeBuffer.velocityXArray[downLeftIndex] = applySplashX(-1);
            writeBuffer.movingArray[downLeftIndex] = 1;

            writeBuffer.typeArray[currentIndex] = ParticleType.EMPTY;
            writeBuffer.movingArray[currentIndex] = 0;
            return true;
        }
    }

    // Try down-right
    const downRightX = x + 1;
    const downRightY = y + 1;
    if (isValidPosition(downRightX, downRightY)) {
        const downRightIndex = getIndexFromPosition(downRightX, downRightY);
        if (writeBuffer.typeArray[downRightIndex] === ParticleType.EMPTY) {
            writeBuffer.typeArray[downRightIndex] = ParticleType.SAND;
            writeBuffer.velocityYArray[downRightIndex] = currentVelY;
            writeBuffer.velocityXArray[downRightIndex] = applySplashX(1);
            writeBuffer.movingArray[downRightIndex] = 1;

            writeBuffer.typeArray[currentIndex] = ParticleType.EMPTY;
            writeBuffer.movingArray[currentIndex] = 0;
            return true;
        }
    }

    return false;
}


let updateLeftToRight = true; 

function splash(writeBuffer, currentIndex) {
    const velY = writeBuffer.velocityYArray[currentIndex];
    let velX = writeBuffer.velocityXArray[currentIndex];

    // Convert vertical velocity into a minimum horizontal splash velocity
    const absY = Math.max(Math.abs(velY) / 31, 0.105); // 105 scaled down for your unit system

    // Maintain original X direction if it exists, otherwise randomize
    if (velX === 0) {
        const direction = updateLeftToRight ? 1 : -1;
        velX = absY * direction;
    } else {
        velX = velX < 0 ? -absY : absY;
    }

    // Apply the splash
    writeBuffer.velocityXArray[currentIndex] = velX;
    writeBuffer.velocityYArray[currentIndex] *= 0.7; // Optional vertical damping
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