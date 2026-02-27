

# 🎮 2048: Stranger Things Edition

A logic-based puzzle game built with **Vanilla JavaScript**, featuring a custom "Stranger Things" theme. This project showcases the ability to translate complex game mechanics into efficient algorithms.

👉 [Play the Game Here](https://tlamt.github.io/2048-Stranger-Thing-/)


---

## 🚀 Engineering Highlights

*   **Core Logic Algorithm**: Implemented a **Matrix Manipulation** system to handle tile sliding and merging logic for all four directions.
*   **State Management**: Managed the 4x4 game board as a 2D array, ensuring reactive UI updates based on data changes.
*   **Event-Driven Architecture**: Utilized JavaScript Event Listeners to capture user inputs (Keyboard) and trigger game state transitions.
*   **Animation Control**: Leveraged CSS3 Transitions to ensure smooth 60fps movement during tile merges.

## 🛠️ Tech Stack

*   **Logic**: Vanilla JavaScript (ES6+)
*   **Styling**: CSS3 (Flexbox, Grid, Animations)
*   **Structure**: HTML5 Semantic Elements
*   **Deployment**: GitHub Pages

## 🧠 Key Challenges & Solutions

### 1. Efficient Merging Logic
**Challenge**: Handling merging and sliding in four directions (U/D/L/R) without redundant code.
**Solution**: Standardized the logic by using a rotation/transformation helper, allowing a single "Left-Slide" algorithm to handle all directions.

### 2. Game Over & Win Detection
**Challenge**: Determining when the player has no moves left or has reached the winning tile.
**Solution**: Implemented a look-ahead function that checks for adjacent identical tiles and empty spaces after every move.

## 📅 Roadmap

- [ ] **Undo Function**: Implement a stack-based history to allow "Undo" moves.
- [ ] **Mobile Support**: Add Touch/Swipe event listeners for mobile users.
- [ ] **High Score Persistence**: Save the best score using **LocalStorage**.
- [ ] **Unit Testing**: Add Jest tests for the core merging algorithm.
