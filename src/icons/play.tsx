import React from 'react';
import { FontAwesome } from 'react-native-vector-icons';

const PlayIcon = () => {
  return (
    <FontAwesome
      name="play"
      color="black"
      backgroundColor="transparent" // Set the background color to transparent
      size={25} // Set the size of the button
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

export default PlayIcon;
