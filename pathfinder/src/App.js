import React, { useState } from "react";
import "./App.css";

const numRows = 15;
const numCols = 30;

const createGrid = () => {
  const grid = [];
  for (let row = 0; row < numRows; row++) {
    const currentRow = [];
    for (let col = 0; col < numCols; col++) {
      currentRow.push({ row, col, isStart: false, isEnd: false, isWall: false, visited: false });
    }
    grid.push(currentRow);
  }
  return grid;
};


function App() {
  const [grid, setGrid] = useState(createGrid);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);

  const toggleWall = (row, col) => {
    const newGrid = grid.map((r) => r.map((cell) => ({ ...cell })));
    const cell = newGrid[row][col];
    if (!cell.isStart && !cell.isEnd) {
      cell.isWall = !cell.isWall;
    }
    setGrid(newGrid);
  };

  const setNode = (row, col, type) => {
    const newGrid = grid.map((r) => r.map((cell) => ({ ...cell })));
    const cell = newGrid[row][col];

    if (type === "start") {
      if (startNode) newGrid[startNode.row][startNode.col].isStart = false;
      cell.isStart = true;
      setStartNode(cell);
    } else if (type === "end") {
      if (endNode) newGrid[endNode.row][endNode.col].isEnd = false;
      cell.isEnd = true;
      setEndNode(cell);
    }
    setGrid(newGrid);
  };
  const resetVisitedAndPath = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        visited: false,
        path: false,
      }))
    );
    setGrid(newGrid);
    return newGrid;
  };

  const clearGrid = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isStart: false,
        isEnd: false,
        isWall: false,
        visited: false,
        path: false,
      }))
    );
    setGrid(newGrid);
    setStartNode(null);
    setEndNode(null);
  };


  const bfs = () => {

    if (!startNode || !endNode) return;

    const newGrid = resetVisitedAndPath();
    const queue = [startNode];
    const visited = new Set();
    const prev = {};


    while (queue.length) {
      const current = queue.shift();
      const key = `${current.row}-${current.col}`;
      if (visited.has(key)) continue;
      visited.add(key);

      newGrid[current.row][current.col].visited = true;

      if (current.row === endNode.row && current.col === endNode.col) break;

      const neighbors = getNeighbors(current, newGrid);
      for (const neighbor of neighbors) {
        const nKey = `${neighbor.row}-${neighbor.col}`;
        if (!visited.has(nKey) && !neighbor.isWall) {
          queue.push(neighbor);
          prev[nKey] = current;
        }
      }
    }

    // Trace path
    const path = [];
    let current = endNode;
    while (current && !(current.row === startNode.row && current.col === startNode.col)) {
      path.unshift(current);
      const key = `${current.row}-${current.col}`;
      current = prev[key];
    }
    for (const node of path) {
      if (!node.isStart && !node.isEnd) {
        newGrid[node.row][node.col].path = true;
      }
    }

    setGrid(newGrid);
  };

  const dfs = () => {
    if (!startNode || !endNode) return;

    const newGrid = resetVisitedAndPath();
    const stack = [startNode];
    const visited = new Set();
    const prev = {};


    while (stack.length) {
      const current = stack.pop();
      const key = `${current.row}-${current.col}`;
      if (visited.has(key)) continue;
      visited.add(key);

      newGrid[current.row][current.col].visited = true;

      if (current.row === endNode.row && current.col === endNode.col) break;

      const neighbors = getNeighbors(current, newGrid);
      for (const neighbor of neighbors) {
        const nKey = `${neighbor.row}-${neighbor.col}`;
        if (!visited.has(nKey) && !neighbor.isWall) {
          stack.push(neighbor);
          if (!prev[nKey]) {
            prev[nKey] = current;
          }
        }
      }
    }

    // Trace path
    const path = [];
    let current = endNode;
    while (current && !(current.row === startNode.row && current.col === startNode.col)) {
      path.unshift(current);
      const key = `${current.row}-${current.col}`;
      current = prev[key];
    }
    for (const node of path) {
      if (!node.isStart && !node.isEnd) {
        newGrid[node.row][node.col].path = true;
      }
    }

    setGrid(newGrid);
  };


  const getNeighbors = (node, grid) => {
    const { row, col } = node;
    const neighbors = [];
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < numCols - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  };

  const handleCellClick = (row, col) => {
    if (!startNode) setNode(row, col, "start");
    else if (!endNode) setNode(row, col, "end");
    else toggleWall(row, col);
  };

  return (
    <div className="App">
      <h1>Simple Pathfinding Visualizer</h1>
      <p>Click to set Start, End, and Walls. Then click Start.</p>
      <button onClick={bfs}>Start Pathfinding (BFS)</button>
      <button onClick={dfs}>Start Pathfinding (DFS)</button>
      <button onClick={clearGrid}>Clear Grid</button>

      <div className="grid">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cell, colIdx) => {
              let className = "cell";
              if (cell.isStart) className += " start";
              else if (cell.isEnd) className += " end";
              else if (cell.isWall) className += " wall";
              else if (cell.path) className += " path";
              else if (cell.visited) className += " visited";
              return (
                <div
                  key={colIdx}
                  className={className}
                  onClick={() => handleCellClick(cell.row, cell.col)}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

