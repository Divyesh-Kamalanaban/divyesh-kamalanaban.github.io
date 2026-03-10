# Certifications Section Fix

## Issue
The certifications section was not rendering or was invisible in the portfolio.

## Root Cause
The grid container holding the certification cards was missing the `animate-stagger-container` class. The child `.animate-stagger-item` elements require a parent with `.animate-stagger-container` to trigger the scroll animations defined in `useScrollAnimation` hook.

Without this parent class:
- The `useScrollAnimation` hook queries for `.animate-stagger-container` elements
- Since the grid didn't have this class, the stagger animation logic never executed
- Child items stayed at `opacity-0` indefinitely

## Solution
Wrapped the grid in a `<div className="w-full animate-stagger-container">` to:
1. Enable the scroll animation trigger
2. Properly animate card visibility with stagger timing
3. Follow the animation pattern used in other components (Projects, Experience)

## File Changed
- `src/sections/portfolio/certifications.jsx`

## Key Learning
All components using `.animate-stagger-item` cards must have a parent container with `.animate-stagger-container` class for animations to work. This is a required part of the scroll animation pattern in this codebase.
