import React from 'react';
import {
  Button,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const AudioContainer = ({
  title,
  created_at,
  status,
  navigation,
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Player', {
          uri: 'https://p.scdn.co/mp3-preview/49dd1bf7def316c2dcd53fc37350ad6ad03e2c8b?cid=cfe923b2d660439caf2b557b21f31221',
        })
      }
    >
      <View style={styles.container}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
          {title}
        </Text>
        <View style={styles.subHeader}>
          <Text>Created at: {created_at}</Text>
          <Text>Status: {status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: 'gray',
    borderStyle: 'solid',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});

export default AudioContainer;
