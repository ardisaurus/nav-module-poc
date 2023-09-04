import { useRef, useEffect } from "react";
import * as d3 from "d3";

const Sketch = ({
  imageDimensions,
  circleArray,
  handleCircleClick,
  origin,
  destination,
  path,
  activeStep,
}) => {
  const sketchRef = useRef();

  useEffect(() => {
    const imageWidth = imageDimensions.width;
    const imageHeight = imageDimensions.height;

    const svg = d3
      .select(sketchRef.current)
      .append("svg")
      .attr("width", imageDimensions.width)
      .attr("height", imageDimensions.height);

    // Clear previous drawings
    // svg.selectAll("*").remove();

    const getColor = ({ x, y }) => {
      if (path) {
        const idx = path.findIndex((item) => item.x === x && item.y === y);
        if (idx >= 0) {
          return "yellow";
        }
      }
      if (origin && x === origin.x && y === origin.y) {
        return "blue";
      }
      if (destination && x === destination.x && y === destination.y) {
        return "green";
      }
      return "red";
    };

    if (circleArray.length) {
      // Calculate square width and height based on image size and array dimensions
      const squareWidth = imageWidth / circleArray[0].length;
      const squareHeight = imageHeight / circleArray.length;

      // Draw circles based on the array
      for (let i = 0; i < circleArray.length; i++) {
        for (let j = 0; j < circleArray[i].length; j++) {
          if (circleArray[i][j] === 0) {
            // Draw a circle
            svg
              .append("circle")
              .attr("cx", j * squareWidth + squareWidth / 2)
              .attr("cy", i * squareHeight + squareHeight / 2)
              .attr("r", Math.min(squareWidth, squareHeight) / 2 - 1) // Radius
              .attr("fill", getColor({ x: j, y: i }))
              .style("pointer-events", "visible")
              .style("cursor", "pointer")
              .on("click", () => handleCircleClick({ x: j, y: i })); // Change the circle color as needed
          }
        }
      }
    }

    // Clean up the SVG on component unmount
    return () => {
      svg.remove();
    };
  }, [circleArray, origin, destination, activeStep]);

  return <div ref={sketchRef} />;
};

export default Sketch;
