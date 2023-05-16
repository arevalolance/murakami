import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { getTimeElapsed } from '../lib/time-elapsed';

const AudioContainer = ({
  title,
  created_at,
  local_uri,
  navigation,
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Player', {
          id: title,
          local_uri: local_uri,
        })
      }
    >
      <View style={styles.container}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
          {title && JSON.stringify(title).replace('"', '')}
        </Text>
        <View style={styles.subHeader}>
          <Text>
            Created at: {created_at && getTimeElapsed(created_at)}
          </Text>
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
