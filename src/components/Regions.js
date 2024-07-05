import React from "react";
import { Layer, Line, Text } from "react-konva";

import useStore from "../store";

function Regions(){
  const regions = useStore(s => s.regions);
  const layerRef = React.useRef(null);

  const selectedId = useStore(s => s.selectedRigionId);
  const selectRegion = useStore(s => s.selectRegion);

  return (
    <Layer ref={layerRef}>
      {regions.map(region => {
        const isSelected = region.id === selectedId;


        // Extract x and y values from the coordinates array
        const flatCoordinates = region.points.flatMap(({ x, y }) => [x, y]);

        // Calculate the center coordinates
        const centerX = flatCoordinates.reduce((sum, value, index) => (index % 2 === 0 ? sum + value : sum), 0) / (flatCoordinates.length / 2);
        const centerY = flatCoordinates.reduce((sum, value, index) => (index % 2 !== 0 ? sum + value : sum), 0) / (flatCoordinates.length / 2);

        return (
          <React.Fragment key={region.id}>
            {/* first we need to erase previous drawings */}
            {/* we can do it with  destination-out blend mode */}
            <Line
              globalCompositeOperation="destination-out"
              points={region.points.flatMap(p => [p.x, p.y])}
              fill="black"
              listening={false}
              closed
            />
            {/* then we just draw new region */}
            <Line
              name="region"
              points={region.points.flatMap(p => [p.x, p.y])}
              fill={region.color}
              closed
              opacity={isSelected ? 1 : 0.8}
              onClick={() => {
                selectRegion(region.id);
              }}
            />
            <Text
              x={centerX}
              y={centerY}
              text={region.id}
              fontSize={50}
              fill="white"
              align="center"
            />
          </React.Fragment>
        );
      })}
    </Layer>
  );
};
export default Regions;
