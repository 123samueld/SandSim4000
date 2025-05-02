# SandSim4000

A high-performance falling sand simulation prototype built using Data-Oriented Design principles.

## Overview

SandSim4000 is a technical prototype designed to efficiently handle large numbers of moving particles in a sand simulation. The project serves as a practical implementation of Data-Oriented Design (DOD) principles, focusing on performance optimization through careful data structure organization and memory access patterns.

## Key Technical Features

- **Struct of Arrays (SoA) Implementation**: Particles are stored in separate arrays for each property (type, movement state, velocity), optimizing memory access patterns and cache utilization.
- **Bit-Packed Boolean Arrays**: Movement states are stored in a bit-packed format, reducing memory usage and improving cache efficiency.
- **Efficient Physics Simulation**: Optimized algorithms for particle movement and interaction, prioritizing vertical movement before diagonal movement.
- **Performance Monitoring**: Built-in profiling tools to track FPS and particle counts in real-time.

## Technical Details

- Uses a grid-based system for particle storage and movement
- Implements efficient collision detection and physics calculations
- Optimized for handling thousands of moving particles simultaneously
- Real-time performance monitoring and debugging tools

## Purpose

This prototype serves as a technical demonstration of how Data-Oriented Design principles can be applied to create highly performant particle simulations. It's particularly focused on optimizing memory access patterns and cache utilization when dealing with large numbers of moving particles.


## Dependencies

- Modern web browser with JavaScript support
- No external dependencies required