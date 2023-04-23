import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import AudioPlayer from '../components/audio-player';

const PlayerScreen = ({ route }) => {
  const { uri } = route.params;

  const SpeakerContainer = ({ title }) => {
    return (
      <View style={{ width: '100%' }}>
        <TouchableOpacity>
          <View style={speakerStyle.container}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              {title}
            </Text>
            <View style={speakerStyle.subHeader}>
              <Text>Created at: </Text>
              <Text>Status</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 30, fontWeight: '500' }}>uuid</Text>
        <Text>Status: UPSAMPLING</Text>
      </View>

      <View style={styles.controls}>
        <AudioPlayer uri={uri} initialDuration={0} />
      </View>

      <Text style={styles.speakersHeading}>Speakers</Text>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <SpeakerContainer title={'Speaker 1'} />
        <SpeakerContainer title={'Speaker 2'} />
      </View>
    </View>
  );
};

const speakerStyle = StyleSheet.create({
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  speakersHeading: {
    marginTop: 50,
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default PlayerScreen;
