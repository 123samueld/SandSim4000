// Physics.js
// Responsibility: Physics calculations and particle behavior rules

import { getGridConfig } from './Initialise.js';
import { getWriteBuffer, getIndexFromPosition, isValidPosition, ParticleType } from './ParticleGrid.js';

export function fallVertical(writeBuffer, x, y, currentIndex) {}

export function fallDiagonall(writeBuffer, x, y, currentIndex) {}

function calculateTargetPosition(x, y, velocityX, velocityY) {
    // Calculate raw target position based on current position and velocity
    // No collision checking here, just pure position calculation
    const targetX = Math.floor(x + velocityX);
    const targetY = Math.floor(y + velocityY);
    
    return { x: targetX, y: targetY };
}

function findValidPosition(startX, startY, targetX, targetY) {
    // Get array of points along the line
    const linePoints = bresenhamLineCalculator(startX, startY, targetX, targetY);
    
    // Start with the initial position
    let lastValidX = startX;
    let lastValidY = startY;
    
    // Check each point until we hit an obstacle
    for (const point of linePoints) {
        if (!checkCollision(point.x, point.y)) {
            lastValidX = point.x;
            lastValidY = point.y;
        } else {
            break; // Stop at first collision
        }
    }
    
    return { x: lastValidX, y: lastValidY };
}

function checkCollision(x, y) {
    const gridConfig = getGridConfig();
    const writeBuffer = getWriteBuffer();
    
    // Check if position is within grid boundaries
    if (!isValidPosition(x, y)) {
        return true;
    }
    
    // Check if position is occupied by a non-empty particle
    const index = getIndexFromPosition(x, y);
    return writeBuffer.typeArray[index] !== ParticleType.EMPTY;
}

function updateParticlePosition(x, y, validX, validY) {
    const writeBuffer = getWriteBuffer();
    const currentIndex = getIndexFromPosition(x, y);
    const targetIndex = getIndexFromPosition(validX, validY);
    
    // Get current particle properties
    const currentType = writeBuffer.typeArray[currentIndex];
    const velocityX = writeBuffer.velocityXArray[currentIndex];
    const velocityY = writeBuffer.velocityYArray[currentIndex];
    
    // Move particle to new position
    writeBuffer.typeArray[targetIndex] = currentType;
    writeBuffer.velocityXArray[targetIndex] = velocityX;
    writeBuffer.velocityYArray[targetIndex] = velocityY;
    writeBuffer.setMoving(targetIndex, true);
    
    // Clear old position
    writeBuffer.typeArray[currentIndex] = ParticleType.EMPTY;
    writeBuffer.setMoving(currentIndex, false);
}

// Helper function for Bresenham's line algorithm
function bresenhamLineCalculator(startX, startY, endX, endY) {
    const points = [];
    let x = startX;
    let y = startY;
    
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    const sx = startX < endX ? 1 : -1;
    const sy = startY < endY ? 1 : -1;
    let err = dx - dy;
    
    while (true) {
        // Add current point to array
        points.push({ x, y });
        
        // If we reached the end point, stop
        if (x === endX && y === endY) break;
        
        // Move to next position
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
    
    return points;
}