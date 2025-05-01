// Initialise.js
// Responsibility: Setup and initialization of canvas, grid, and input
import { } from './Simulation.js';
import { initialiseParticleGrid } from './ParticleGrid.js';

let canvasRef, ctxRef;
let gridConfig;

// Mouse input variables
let mouseX = 0;
let mouseY = 0;
let isMouseDown = false;

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
    if (!canvasRef) {
        throw new Error('Canvas not initialized. Call initCanvas() first.');
    }

    const cellSize = 4; // Set cell size to 4 pixels

    // Calculate number of columns and rows
    const cols = Math.floor(canvasRef.width / cellSize);
    const rows = Math.floor(canvasRef.height / cellSize);
    const totalCells = cols * rows;

    gridConfig = {
        cols,
        rows,
        cellSize,
        totalCells
    };
    
    return gridConfig;
}

export function initGameStateBuffers() {
    if (!gridConfig) {
        throw new Error('Grid not initialized. Call initGrid() first.');
    }

    // Initialize particle grid
    initialiseParticleGrid(gridConfig.cols, gridConfig.rows);
}

export function getGridConfig() {
    return gridConfig;
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

export function initialiseSimulation() {
    initCanvas();
    initGrid();
    initGameStateBuffers();
    initMouseInput();
}