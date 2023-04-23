import React from 'react';
import { FontAwesome } from 'react-native-vector-icons';

const PauseIcon = () => {
  return (
    <FontAwesome
      name="pause"
      color="black"
      backgroundColor="transparent" // Set the background color to transparent
      size={25}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

export default PauseIcon;
