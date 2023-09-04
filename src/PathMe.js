const aStar = ({ start, end, grid }) => {
  function findNearestPath(grid, start, end) {
    const numRows = grid.length;
    const numCols = grid[0].length;

    // Define possible movements (up, down, left, right, and diagonals)
    const dx = [-1, 0, 1, 0, -1, 1, -1, 1];
    const dy = [0, -1, 0, 1, -1, -1, 1, 1];

    // Create a priority queue for the open set
    const openSet = [];
    openSet.push({
      x: start.x,
      y: start.y,
      g: 0,
      h: heuristic(start, end),
      parent: null,
    });

    // Create a 2D array to keep track of visited nodes
    const visited = Array(numRows)
      .fill(null)
      .map(() => Array(numCols).fill(false));

    while (openSet.length > 0) {
      // Find the node with the lowest f value in the open set
      openSet.sort((a, b) => a.g + a.h - (b.g + b.h));
      const current = openSet.shift();

      // Check if we've reached the end
      if (current.x === end.x && current.y === end.y) {
        return reconstructPath(current);
      }

      visited[current.y][current.x] = true;

      // Explore neighbors
      for (let i = 0; i < 8; i++) {
        const nextX = current.x + dx[i];
        const nextY = current.y + dy[i];

        // Check if the neighbor is within the grid bounds
        if (nextX >= 0 && nextX < numCols && nextY >= 0 && nextY < numRows) {
          // Check if the neighbor is not an obstacle and has not been visited
          if (grid[nextY][nextX] !== 1 && !visited[nextY][nextX]) {
            const tentativeG = current.g + 1; // Assuming a cost of 1 to move to a neighbor

            // Check if this path to the neighbor is better than previous paths
            let found = false;
            for (let j = 0; j < openSet.length; j++) {
              if (openSet[j].x === nextX && openSet[j].y === nextY) {
                found = true;
                if (tentativeG < openSet[j].g) {
                  openSet[j].g = tentativeG;
                  openSet[j].parent = current;
                }
                break;
              }
            }

            // If not found in openSet, add it
            if (!found) {
              openSet.push({
                x: nextX,
                y: nextY,
                g: tentativeG,
                h: heuristic({ x: nextX, y: nextY }, end),
                parent: current,
              });
            }
          }
        }
      }
    }

    // If no path is found
    return null;
  }

  // Heuristic function (Manhattan distance)
  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  // Reconstruct the path from the end node to the start node
  function reconstructPath(current) {
    const path = [];
    while (current !== null) {
      path.unshift({ x: current.x, y: current.y });
      current = current.parent;
    }
    return path;
  }

  // Find the nearest path
  const path = findNearestPath(grid, start, end);

  return path;
};

export default ({ start, end, grid }) => {
  // Run the A* algorithm and get the path.
  const path = aStar({ start, end, grid });

  // Display the result.
  if (path) {
    console.log("Path found:");
    console.log(path);
  } else {
    console.log("No path found.");
  }

  return path;
};
