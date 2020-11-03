import { Box, Image, Text } from "grommet";
import React from "react";

const Gallery = ({ inputImageURL, outputImage }) => {
  return (
    <Box width="xlarge" pad="none">
      {inputImageURL && (
        <Image fit="contain" src={inputImageURL} margin="medium" />
      )}
      {outputImage && (
        <Image fit="contain" src={`data:image/png;base64, ${outputImage}`} />
      )}
      {outputImage && (
        <Text weight="bold" textAlign="center" size="small" alignSelf="center">
          Open in new tab for higher resolution.
        </Text>
      )}
    </Box>
  );
};

export default Gallery;
