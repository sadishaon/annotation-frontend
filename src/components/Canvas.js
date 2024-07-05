import React, { useState } from "react";
import { Stage } from "react-konva";
import Regions from "./Regions";
import BaseImage from "./BaseImage";
import useStore from "../store";
const { Image } = require("image-js");
const plotly = require("plotly.js-dist");
const { createCanvas } = require("canvas");
window.Buffer = window.Buffer || require("buffer").Buffer;

// Function control
let id = 1;
const showHistogram = false;
const showBoxplot = false;
const verbose = false;
const showStatistics = true;

// Create a singleton popup element
let popup = null;

function getRelativePointerPosition(node) {
  // the function will return pointer position relative to the passed node
  const transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  const pos = node.getStage().getPointerPosition();

  // now we find relative point
  return transform.point(pos);
}

// function calculatePolygonArea(vertices) {
//   let n = vertices.length;
//   let area = 0;

//   for (let i = 0; i < n; i++) {
//       let j = (i + 1) % n;
//       area += (vertices[i].x + vertices[j].x) * (vertices[i].y - vertices[j].y);
//   }

//   area = Math.abs(area) / 2;
//   return area;
// }

function limitAttributes(stage, newAttrs) {
  const box = stage.findOne("Image").getClientRect();
  const minX = -box.width + stage.width() / 2;
  const maxX = stage.width() / 2;

  const x = Math.max(minX, Math.min(newAttrs.x, maxX));

  const y = 0;

  const scale = Math.max(0.05, newAttrs.scale);

  return { x, y, scale };
}

function Canvas({ imageSrc, setErrorType, setShowTutorial, errorType }) {
  const [image, setImage] = React.useState(null); // State to hold the image

  const stageRef = React.useRef();

  const { width, height } = useStore((s) => ({
    width: s.width,
    height: s.height,
  }));
  const setSize = useStore((s) => s.setSize);
  const scale = useStore((state) => state.scale);
  const isDrawing = useStore((state) => state.isDrawing);
  const toggleDrawing = useStore((state) => state.toggleIsDrawing);

  const isSmallRegion = useStore((state) => state.isSmallRegion);
  const toggleIsSmallRegion = useStore((state) => state.toggleIsSmallRegion);

  const regions = useStore((state) => state.regions);
  const setRegions = useStore((state) => state.setRegions);

  const selectRegion = useStore((s) => s.selectRegion);

  var isPopupDisplayed = false;

  const [errorCount, setErrorCount] = useState(0);
  //console.log(errorCount);

  function displayPopup(message, toggleFunction) {
    // Close any existing popup
    if (popup) {
      popup.parentNode.removeChild(popup);
      popup = null;
    }
    popup = document.createElement("div");
    popup.className = "popup";

    popup.innerHTML = `
        <div class="popup-content">
            <p>${message}</p>
            <button id="closePopupBtn">Close</button>
        </div>
    `;

    // Styling for the popup
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.backgroundColor = "white";
    popup.style.padding = "20px";
    popup.style.border = "1px solid #ccc";
    popup.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
    popup.style.zIndex = "9999";

    document.body.appendChild(popup);
    isPopupDisplayed = true;
    toggleFunction();
    // Add event listener for the close button inside the popup
    document.getElementById("closePopupBtn").addEventListener("click", () => {
      toggleFunction();

      popup.parentNode.removeChild(popup);
      popup = null;
      isPopupDisplayed = false;
    });
  }

  async function createBoxPlot(image) {
    try {
      // Load the image
      // Convert the image to the HSV color space
      const hsvImage = image.colorModel === "hsv" ? image : image.hsv();

      // Extract the H channel data
      const hChannelData = hsvImage.getChannel(0).data; // H channel is the first channel in HSV

      if (showBoxplot) {
        // Create a box plot trace for the H channel data
        const trace = {
          y: hChannelData,
          type: "box",
          boxpoints: "all",
          jitter: 0.3,
          pointpos: -1.8,
          marker: {
            color: "rgba(255, 144, 14, 0.5)",
            size: 3,
          },
        };

        // Create the plot data
        const data = [trace];

        // Create the plot layout
        const layout = {
          title: "Box Plot of H Channel",
          yaxis: {
            title: "H Channel Value",
          },
        };

        // Create the plot options
        const options = {
          filename: "box-plot-h-channel",
          fileopt: "overwrite",
        };

        // Generate the plot using Plotly
        const plot = await plotly.newPlot("plot", data, layout, options);
        console.log("Plot created:", plot);
        const outName = plot.data[0].x; // Category labels (e.g., 'H Channel')
      }

      const outQ1 = calculatePercentile(hChannelData, 25);
      const outMedian = calculatePercentile(hChannelData, 50);
      const outQ3 = calculatePercentile(hChannelData, 75);
      const outIqr = outQ3 - outQ1;

      const outLowerFence = outQ1 - 1.5 * outIqr;
      const outUpperFence = outQ3 + 1.5 * outIqr;

      // Extract box plot values
      const boxPlotValues = {
        lowerFence: outLowerFence,
        q1: outQ1,
        median: outMedian,
        q3: outQ3,
        upperFence: outUpperFence,
        //outliers: outOutliers
      };

      const iqr = outQ3 - outQ1;
      const std = iqr * 1.25;

      const iqrTumor = 221 - 198;
      const iqrDot = 197 - 188;
      const iqrPink = 229 - 213;
      const iqrWhite = 231 - 195;
      const iqrRed = 243 - 230;

      const medTumor = 216;
      const medDot = 189;
      const medPink = 215;
      const medWhite = 221;
      const medRed = 235;

      const stdTumor = iqrTumor * 1.25;
      const stdDot = iqrDot * 1.25;
      const stdPink = iqrPink * 1.25;
      const stdWhite = iqrWhite * 1.25;
      const stdRed = iqrRed * 1.25;

      if (showStatistics) {
        //console.log("Outmedian: ", outMedian);
        //console.log("stdTumor: ", stdTumor);
      }

      // let errMessageColor = `<p>
      // It looks like you are drawing over a non-tumor region.
      // <p>We are pretty sure the <b>tumors do not have this color</b>.
      // <p>Please review again and <b>take another look at the help button</b>.
      // <p><b>If it is not a tumor</b>, please click on <b>"delete"</b></p>`;
      // //outMedian>med-0.2*std && outMedian<med+0.2*std

      if (
        outMedian > medDot - 0.2 * stdDot &&
        outMedian < medDot + 0.2 * stdDot
      ) {
        console.log("You are selecting Dark Zone");

        if (errorCount > 0 && errorType === "dark-dot") {
          setShowTutorial(true);
          setErrorCount(errorCount + 1);
        } else {
          setErrorType("dark-dot");
          displayPopup(getErrorMessage("Dark-dot"), toggleIsSmallRegion);
          setErrorCount(errorCount + 1);
        }

        // displayPopup(getErrorMessage('Dark-dot'), toggleIsSmallRegion);
        // setErrorType('dark-dot');
      } else if (
        outMedian > medTumor - stdTumor &&
        outMedian < medTumor + 0.1 * stdTumor
      ) {
        console.log("You are selecting Tumor Zone");
        setErrorCount(0);
        //displayPopup(getErrorMessage('Tumor'), toggleIsSmallRegion);
        // setErrorType('tumor');
      } else if (
        outMedian > medPink - 0.1 * stdPink &&
        outMedian < medPink + 0.2 * stdPink
      ) {
        console.log("You are selecting Pink Zone");
        if (errorCount > 0 && errorType === "pink-zone") {
          setShowTutorial(true);
          setErrorCount(errorCount + 1);
        } else {
          setErrorType("pink-zone");
          displayPopup(getErrorMessage("Pink"), toggleIsSmallRegion);
          setErrorCount(errorCount + 1);
        }

        // displayPopup(getErrorMessage('Pink'), toggleIsSmallRegion);
      } else if (
        outMedian > medWhite - 0.2 * stdWhite &&
        outMedian < medWhite + 0.2 * stdWhite
      ) {
        console.log("You are selecting White Zone");

        if (errorCount > 0 && errorType === "white-zone") {
          setShowTutorial(true);
          setErrorCount(errorCount + 1);
        } else {
          displayPopup(getErrorMessage("White"), toggleIsSmallRegion);
          setErrorType("white-zone");
          setErrorCount(errorCount + 1);
        }
      } else if (
        outMedian > medRed - 0.2 * stdRed &&
        outMedian < medRed + 0.2 * stdRed
      ) {
        console.log("You are selecting Red Zone");

        if (errorCount > 0 && errorType === "red-zone") {
          setShowTutorial(true);
          setErrorCount(errorCount + 1);
        } else {
          setErrorType("red-zone");
          displayPopup(getErrorMessage("Red"), toggleIsSmallRegion);
          setErrorCount(errorCount + 1);
        }

      } 
      
      // else {
      //   console.log("You are selecting Non-Tumor Zone");

      //   if (errorCount > 0 && errorType === "area") {
      //     setShowTutorial(true);
      //     setErrorCount(errorCount + 1);
      //   } else {
      //     setErrorType("area");
      //     displayPopup(getErrorMessage("Non-Tumor"), toggleIsSmallRegion);
      //     setErrorCount(errorCount + 1);
      //   }
      // }

      //Message function
      function getErrorMessage(zone) {
        return `<p>
            It looks like you are selecting the <b>${zone} Zone</b>. 
            <p>We are pretty sure the <b>tumors do not have this color</b>.
            <p>Please review again and <b>take another look at the help button</b>.
            <p><b>If it is not a tumor</b>, please click on <b>"Delete"</b></p>`;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function cropImageSubpart(srcImage, coordinates) {
    // Load the image
    const imageProcess = Image.load(srcImage);

    // Extract x and y coordinates separately
    const xCoordinates = coordinates.map(({ x }) => x);
    const yCoordinates = coordinates.map(({ y }) => y);

    // Calculate min and max values for x and y
    const minX = Math.min(...xCoordinates);
    const maxX = Math.max(...xCoordinates);
    const minY = Math.min(...yCoordinates);
    const maxY = Math.max(...yCoordinates);

    // Calculate width and height of the subpart
    const width = maxX - minX;
    const height = maxY - minY;

    // Extract subpart based on calculated dimensions
    const subpart = imageProcess.crop({
      x: minX,
      y: minY,
      width,
      height,
    });

    return subpart;
  }

  async function checkColorOfRegion(srcImage, coordinates) {
    /*let image = await Image.load(srcImage);
    let grey = image
      .grey() // convert the image to greyscale.
      .resize({ width: 200 }) // resize the image, forcing a width of 200 pixels. The height is computed automatically to preserve the aspect ratio.
      .rotate(30); // rotate the image clockwise by 30 degrees.
      var histogram = image.getHistogram({ channel: 0});
      console.log(histogram);
    return image.width;
    */
    try {
      // Load the image
      const imageProcess = await Image.load(srcImage);

      // Extract x and y coordinates separately
      const xCoordinates = coordinates.map(({ x }) => x);
      const yCoordinates = coordinates.map(({ y }) => y);

      // Calculate min and max values for x and y
      const minX = Math.min(...xCoordinates);
      const maxX = Math.max(...xCoordinates);
      const minY = Math.min(...yCoordinates);
      const maxY = Math.max(...yCoordinates);

      // Calculate width and height of the subpart
      const width = maxX - minX;
      const height = maxY - minY;

      // Extract subpart based on calculated dimensions
      const subpart = await imageProcess.crop({
        x: minX,
        y: minY,
        width,
        height,
      });

      // Convert the subpart to a single channel (e.g., grayscale)
      const grayChannel = subpart.grey(); // Convert to grayscale, adjust as needed

      // Variant: extract red channel
      var RGBSubpart = subpart.split();
      const red = RGBSubpart[0];
      const green = RGBSubpart[1];
      const blue = RGBSubpart[2];

      // Variant 2: HSV
      var hsvSubpart = subpart.hsv();
      // We can create one image per channel
      var hsvChannelsSubpart = hsvSubpart.split();
      const HChannel = hsvChannelsSubpart[0];
      const SChannel = hsvChannelsSubpart[1];
      const VChannel = hsvChannelsSubpart[2];

      var histogramArr = getCropAndHistogram(grayChannel, "gray");
      histogramArr = getCropAndHistogram(red, "red");
      histogramArr = getCropAndHistogram(green, "green");
      histogramArr = getCropAndHistogram(blue, "blue");

      histogramArr = getCropAndHistogram(HChannel, "H");
      histogramArr = getCropAndHistogram(SChannel, "S");
      histogramArr = getCropAndHistogram(VChannel, "V");

      const foo = createBoxPlot(subpart);

      return histogramArr;
    } catch (error) {
      // Handle any errors that might occur during image loading or processing
      console.error("Error:", error);
      return null;
    }
  }

  function getCropAndHistogram(channel, name) {
    const histogramArr = Array(256).fill(0); // Initialize histogram bins

    channel.getPixelsArray().forEach((pixel) => {
      const intensity = pixel[0]; // Assuming a single channel (grayscale)
      histogramArr[intensity]++;
    });

    if (verbose) {
      console.log("Histogram ", name, ":", histogramArr);
    }

    // Create a canvas for histogram plot
    const canvas = createCanvas(256, 100);
    const ctx = canvas.getContext("2d");

    // Plot histogram on the canvas
    const maxCount = Math.max(...histogramArr);
    histogramArr.forEach((count, intensity) => {
      const normalizedHeight = (count / maxCount) * 100;
      ctx.fillStyle = "white";
      ctx.fillRect(intensity, 100 - normalizedHeight, 1, normalizedHeight);
    });

    if (showHistogram) {
      // Convert canvas to data URL for download
      const histogramDataURL = canvas.toDataURL("image/jpeg");

      // Convert subpart image to data URL for download
      //const subpartDataURL =  channel.toDataURL('image/jpeg');
    }

    //console.log('Subpart Data URL:',name,':', subpartDataURL);
    if (verbose) {
      console.log("Histogram Data URL:", name, ":", histogramDataURL);
    }

    return histogramArr;
  }

  // Function to calculate percentile from an array of data
  function calculatePercentile(data, percentile) {
    const sortedData = data.slice().sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sortedData.length);
    return sortedData[index - 1];
  }

  async function analyzeOuterRing(srcImage, coordinates) {
    try {
      //const subpart = cropImageSubpart(srcImage, coordinates);
      // Load the image
      const imageProcess = await Image.load(srcImage);

      // Extract x and y coordinates separately
      const xCoordinates = coordinates.map(({ x }) => x);
      const yCoordinates = coordinates.map(({ y }) => y);

      // Calculate min and max values for x and y
      const minX = Math.min(...xCoordinates);
      const maxX = Math.max(...xCoordinates);
      const minY = Math.min(...yCoordinates);
      const maxY = Math.max(...yCoordinates);

      // Calculate width and height of the subpart
      const width = maxX - minX;
      const height = maxY - minY;

      // Extract subpart based on calculated dimensions
      const subpart = await imageProcess
        .crop({
          x: minX,
          y: minY,
          width,
          height,
        })
        .grey();

      // Calculate the radius of the outer ring (40% of the image dimensions)
      const radius = Math.min(subpart.width, subpart.height) * 0.4;

      // Calculate the center of the image
      const centerX = subpart.width / 2;
      const centerY = subpart.height / 2;

      // Create a new image for the mask
      const mask = new Image(subpart.width, subpart.height, { kind: "GREY" });

      // Create the mask for the outer ring
      for (let y = 0; y < mask.height; y++) {
        for (let x = 0; x < mask.width; x++) {
          const distanceToCenter = Math.sqrt(
            (x - subpart.width / 2) ** 2 + (y - subpart.height / 2) ** 2
          );
          if (distanceToCenter >= radius * 0.6 && distanceToCenter <= radius) {
            mask.setBitXY(x, y, true);
          } else {
            mask.setBitXY(x, y, false);
          }
        }
      }

      // Apply the mask to the original image to extract the outer ring
      const outerRing = subpart.mask(mask);

      // Calculate the color histogram of the outer ring
      const histogram = outerRing.getHistogram({ useAlpha: false });

      // Analyze the histogram to detect color distributions...

      // Example: Check if there are two prominent peaks in the histogram
      // (This is a simplified example and may not work for all cases)
      const peakThreshold = 0.1 * Math.max(...histogram); // Adjust the threshold as needed
      const peaks = histogram.reduce((acc, value, index) => {
        if (value >= peakThreshold) {
          acc.push(index);
        }
        return acc;
      }, []);

      // Determine if there are two prominent color distributions based on the peaks
      const hasTwoColorDistributions = peaks.length >= 2;

      return {
        outerRing,
        histogram,
        hasTwoColorDistributions,
      };
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  const pointToLineDistance = (point, lineStart, lineEnd) => {
    const numerator = Math.abs(
      (lineEnd.y - lineStart.y) * point.x -
        (lineEnd.x - lineStart.x) * point.y +
        lineEnd.x * lineStart.y -
        lineEnd.y * lineStart.x
    );
    const denominator = Math.sqrt(
      (lineEnd.y - lineStart.y) ** 2 + (lineEnd.x - lineStart.x) ** 2
    );

    return denominator !== 0 ? numerator / denominator : 0;
  };

  const simplifyPoints = (points, tolerance) => {
    if (points.length < 3) {
      return points;
    }

    const startIdx = 0;
    const endIdx = points.length - 1;

    return simplifyRecursive(points, startIdx, endIdx, tolerance);
  };

  const simplifyRecursive = (points, startIdx, endIdx, tolerance) => {
    let maxDistance = 0;
    let maxDistanceIdx = 0;

    for (let i = startIdx + 1; i < endIdx; i++) {
      const distance = pointToLineDistance(
        points[i],
        points[startIdx],
        points[endIdx]
      );

      if (distance > maxDistance) {
        maxDistance = distance;
        maxDistanceIdx = i;
      }
    }

    if (maxDistance > tolerance) {
      const leftPart = simplifyRecursive(
        points,
        startIdx,
        maxDistanceIdx,
        tolerance
      );
      const rightPart = simplifyRecursive(
        points,
        maxDistanceIdx,
        endIdx,
        tolerance
      );

      return [...leftPart, points[maxDistanceIdx], ...rightPart];
    } else {
      return [points[startIdx], points[endIdx]];
    }
  };

  const calculatePolygonArea = (vertices) => {
    let n = vertices.length;
    let area = 0;

    for (let i = 0; i < n; i++) {
      let j = (i + 1) % n;
      area += (vertices[i].x + vertices[j].x) * (vertices[i].y - vertices[j].y);
    }

    area = Math.abs(area) / 2;
    return area;
  };

  const isConvex = (points) => {
    // Check if the polygon formed by the points is convex
    // Implementation based on the cross product of consecutive edges
    const numPoints = points.length;
    let isPositive = false;
    let isNegative = false;

    for (let i = 0; i < numPoints; i++) {
      const current = points[i];
      const next = points[(i + 1) % numPoints];
      const prev = points[i === 0 ? numPoints - 1 : i - 1];

      const crossProduct =
        (current.x - prev.x) * (next.y - current.y) -
        (current.y - prev.y) * (next.x - current.x);

      if (crossProduct > 0) {
        isPositive = true;
      } else if (crossProduct < 0) {
        isNegative = true;
      }

      if (isPositive && isNegative) {
        return false; // Convexity violated
      }
    }

    return true; // Convex
  };

  const hasEqualSideLengths = (points) => {
    // Check if the polygon formed by the points has approximately equal side lengths
    // This is a simple check that might not work for all cases, adjust as needed
    const numPoints = points.length;
    const tolerance = 5; // Adjust tolerance as needed

    for (let i = 0; i < numPoints; i++) {
      const current = points[i];
      const next = points[(i + 1) % numPoints];
      const distance = Math.sqrt(
        (next.x - current.x) ** 2 + (next.y - current.y) ** 2
      );

      for (let j = i + 2; j < i + numPoints - 1; j++) {
        const otherNext = points[j % numPoints];
        const otherDistance = Math.sqrt(
          (otherNext.x - current.x) ** 2 + (otherNext.y - current.y) ** 2
        );

        if (Math.abs(distance - otherDistance) > tolerance) {
          return false; // Side lengths are not approximately equal
        }
      }
    }

    return true; // All side lengths are approximately equal
  };

  const analyzeRegionShape2 = (points) => {
    const numPoints = points.length;
    console.log("Numpoints", numPoints);
    if (numPoints < 3) {
      console.log("Not enough points to determine shape");
      return "Unknown Shape";
    }

    const simplifiedPoints = simplifyPoints(points, 5); // Adjust tolerance as needed

    const isSquare =
      isConvex(simplifiedPoints) && hasEqualSideLengths(simplifiedPoints);
    const isEllipse =
      isConvex(simplifiedPoints) && !hasEqualSideLengths(simplifiedPoints);

    if (isSquare) {
      console.log("Square");
      return "Square";
    } else if (isEllipse) {
      console.log("Ellipse/Circle");
      return "Ellipse/Circle";
    } else {
      console.log("Unknown Shape");
      return "Unknown Shape";
    }
  };

  const calculateCurvature = (prev, current, next) => {
    const x1 = prev.x;
    const y1 = prev.y;
    const x2 = current.x;
    const y2 = current.y;
    const x3 = next.x;
    const y3 = next.y;

    // Calculate the cross product of vectors (prev->current) and (current->next)
    const crossProduct = (x2 - x1) * (y3 - y2) - (y2 - y1) * (x3 - x2);

    // Calculate the dot product of vectors (prev->current) and (current->next)
    const dotProduct = (x2 - x1) * (x3 - x2) + (y2 - y1) * (y3 - y2);

    // Calculate the angle between vectors
    const angle = Math.atan2(crossProduct, dotProduct);

    // Calculate curvature as the absolute value of the angle
    const curvature = Math.abs(angle);

    return curvature;
  };

  const calculateAverageCurvature = (points) => {
    const numPoints = points.length;

    if (numPoints < 3) {
      return 0; // Not enough points to calculate curvature
    }

    let totalCurvature = 0;

    for (let i = 0; i < numPoints; i++) {
      const prev = points[i === 0 ? numPoints - 1 : i - 1];
      const current = points[i];
      const next = points[(i + 1) % numPoints];

      const curvature = calculateCurvature(prev, current, next);

      totalCurvature += curvature;
    }

    // Calculate average curvature
    const averageCurvature = totalCurvature / numPoints;

    return averageCurvature;
  };

  const analyzeRegionShape = (points) => {
    const numPoints = points.length;

    if (numPoints < 3) {
      console.log("Not enough points to determine shape");
      return "Unknown Shape";
    }

    const simplifiedPoints = simplifyPoints(points, 100); // Adjust tolerance as needed

    const averageCurvature = calculateAverageCurvature(simplifiedPoints);
    console.log("averageCurvature", averageCurvature);

    const curvatureThreshold = 0.3; // Adjust threshold as needed

    if (averageCurvature < curvatureThreshold) {
      //console.log('Polygon with mostly straight lines');
      //displayPopupUnregularRegion();
      //toggleIsUnregularShape();

      if (errorCount > 0 && errorType === "line") {
        setShowTutorial(true);
        setErrorCount(errorCount + 1);
      } else {
        setErrorType("line");
        displayPopup(
          `<p>
        It looks like you are drawing a region more related to a line. 
        <p>We are pretty sure the <b>tumors do not have this shape</b>.
        <p>Please review again and <b>take another look at the help button</b>.
        <p><b>You can undo this region</b>, please click on <b>"delete"</b></p>`,
          toggleIsSmallRegion
        );
        setErrorCount(errorCount + 1);
      }

      return "Polygon with mostly straight lines";
    } else {
      console.log("Unknown Shape");
      return "Unknown Shape";
    }
  };

  React.useEffect(() => {
    function checkSize() {
      const container = document.querySelector(".Task-container");
      setSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    }

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, [setSize, height]);
  // Update the image when imageSrc changes
  React.useEffect(() => {
    const img = new window.Image();
    img.src = `/image-${imageSrc}.jpg`;
    img.onload = () => {
      setImage(img.src);
    };
  }, [imageSrc]);
  return (
    <React.Fragment>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        className="canvas"
        onClick={(e) => {
          const clickedNotOnRegion = e.target.name() !== "region";
          if (clickedNotOnRegion) {
            selectRegion(null);
          }
        }}
        onWheel={(e) => {
          e.evt.preventDefault();
          const stage = stageRef.current;

          const dx = -e.evt.deltaX;
          const dy = -e.evt.deltaY;
          const pos = limitAttributes(stage, {
            x: stage.x() + dx,
            y: stage.y() + dy,
            scale: stage.scaleX(),
          });
          stageRef.current.position(pos);
        }}
        onMouseDown={(e) => {
          //if (isSmallRegion || isOtherRegion) {
          //  return;
          //}
          //if (isSmallRegion) {
          // return;
          //}
          toggleDrawing(true);
          const point = getRelativePointerPosition(e.target.getStage());
          const region = {
            id: id++,
            color: "#F13E3E",
            points: [point],
          };
          setRegions(regions.concat([region]));
        }}
        onMouseMove={(e) => {
          if (!isDrawing) {
            return;
          }
          const lastRegion = { ...regions[regions.length - 1] };
          const point = getRelativePointerPosition(e.target.getStage());
          lastRegion.points = lastRegion.points.concat([point]);
          regions.splice(regions.length - 1, 1);
          setRegions(regions.concat([lastRegion]));
        }}
        onMouseUp={(e) => {
          if (!isDrawing) {
            return;
          }
          const lastRegion = regions[regions.length - 1];

          if (!isPopupDisplayed) {
            checkColorOfRegion(image, lastRegion.points)
              .then((histogram) => {
                if (showHistogram) {
                  if (histogram) {
                    console.log("Histogram:", histogram);
                    // Use the histogram data as needed
                  } else if (verbose) {
                    console.log("Failed to calculate histogram.");
                  }
                }
              })
              .catch((err) => {
                console.error("Error:", err);
              });
          }

          /*
          analyzeOuterRing(image, lastRegion.points)
          .then((result) => {
            console.log('Analysis Result:', result);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
          */

          if (!isPopupDisplayed) {
            analyzeRegionShape(lastRegion.points);
          }

          if (!isPopupDisplayed) {
            if (calculatePolygonArea(lastRegion.points) < 5000) {
              //displayPopup();
              //toggleIsSmallRegion();

              if (errorCount > 0 && errorType === "area") {
                setShowTutorial(true);
                setErrorCount(errorCount + 1);
              }
              {
                setErrorType("area");
                displayPopup(
                  `It looks like you are making the regions too small: 
              <p>We are <b>pretty sure</b> the tumors are not so small. 
              <p>Please click on "delete" and take another look at the tutorial button</p>`,
                  toggleIsSmallRegion
                );
                setErrorCount(errorCount + 1);
              }
            }
          }

          if (lastRegion.points.length < 3) {
            regions.splice(regions.length - 1, 1);
            setRegions(regions.concat());
          }
          toggleDrawing();
        }}
      >
        <BaseImage imageSource={imageSrc} />
        <Regions />
      </Stage>

      <div id="plot"></div>
    </React.Fragment>
  );
}

export default Canvas;
