import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Sketch = ({
  dotColor,
  imageDimensions,
  dataRes,
  handleSelectedNodes,
  isAddMode,
}) => {
  const sketchRef = useRef();

  useEffect(() => {
    const svg = d3
      .select(sketchRef.current)
      .append("svg")
      .attr("width", imageDimensions.width)
      .attr("height", imageDimensions.height);

    const dots = svg
      .selectAll("circle")
      .data(dataRes)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 8)
      .attr("fill", dotColor);

    let lastClickedDot = null;

    const handleDotClick = (event, d) => {
      if (lastClickedDot) {
        lastClickedDot.color = dotColor;
      }
      d.color = "yellow";
      lastClickedDot = d;
      console.log([d]);

      handleSelectedNodes([d]);
      dots
        .data(dataRes)
        .attr("fill", (dot) => (dot.color ? dot.color : dotColor));
    };

    dots.on("click", handleDotClick);

    // Clean up the SVG on component unmount
    return () => {
      svg.remove();
    };
  }, [dotColor, imageDimensions, dataRes, isAddMode]);

  return <div ref={sketchRef} />;
};

export default Sketch;
