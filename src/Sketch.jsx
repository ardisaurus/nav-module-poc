import { useRef, useEffect } from "react";
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

    let dots = svg
      .selectAll("circle")
      .data(dataRes)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 8)
      .attr("fill", dotColor);

    const handleDotClick = (event, d) => {
      if (!isAddMode) {
        const selDotIndex = dots.nodes().indexOf(event.target);
        const selDot = dataRes[selDotIndex];
        selDot.color = "blue";
        handleSelectedNodes([...dataRes.filter((dot) => dot.color === "blue")]);
        dots
          .data(dataRes)
          .attr("fill", (dot) => (dot.color ? dot.color : "red"));
      } else {
        const [mouseX, mouseY] = d3.pointer(event);
        if (
          mouseX >= 0 &&
          mouseX <= imageDimensions.width &&
          mouseY >= 0 &&
          mouseY <= imageDimensions.height
        ) {
          console.log("heellloo");
          const newDot = {
            x: mouseX,
            y: mouseY,
            size: 8,
            color: "red",
          };
          dataRes.push(newDot);
          dots = svg
            .selectAll("circle")
            .data(dataRes)
            .enter()
            .append("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", 8)
            .attr("fill", (d) => d.color);
        }
      }
    };

    dots.on("click", handleDotClick);

    const handleCanvasClick = (event) => {
      if (isAddMode) {
        const [mouseX, mouseY] = d3.pointer(event);
        if (
          mouseX >= 0 &&
          mouseX <= imageDimensions.width &&
          mouseY >= 0 &&
          mouseY <= imageDimensions.height
        ) {
          const newDot = {
            x: mouseX,
            y: mouseY,
            size: 8,
            color: "red",
          };
          dataRes.push(newDot);
          dots = svg
            .selectAll("circle")
            .data(dataRes)
            .enter()
            .append("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", 8)
            .attr("fill", (d) => d.color);
        }
      }
    };

    svg.on("click", handleCanvasClick);

    // Clean up the SVG on component unmount
    return () => {
      svg.remove();
    };
  }, [dotColor, imageDimensions, dataRes, isAddMode]);

  return <div ref={sketchRef} />;
};

export default Sketch;
