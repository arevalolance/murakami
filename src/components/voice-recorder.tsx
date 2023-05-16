import React, { useRef, useState } from 'react';
import https from 'https';
import {
  Button,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Audio,
  InterruptionModeIOS,
  InterruptionModeAndroid,
} from 'expo-av';
import { Recording } from 'expo-av/build/Audio';
import AudioPlayer from './audio-player';
import { AudioData } from '../lib/types';
import * as FileSystem from 'expo-file-system';
import { saveLocal } from '../lib/save-local';
import { BASE_URL } from '../lib/constants';

const VoiceRecorder = ({ setItems }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Recording>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPlayerOpen, togglePlayer] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [uri, setURI] = useState<string>();

  const uploadAudio = async (uri) => {
    console.log('claled upload');
    try {
      const fileUri = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // console.log(fileUri);
      console.log(`http://${BASE_URL}/upload`);
      const response = await fetch(
        `http://${BASE_URL}/upload`,
        // '',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            denoise: false,
            audio: fileUri,
          }),
        }
      );

      const result = await response.json();

      return result['generated_id'];
    } catch (error) {
      console.error('THIS IS AN ERROR', error);
    }
  };

  const handleSave = async () => {
    if (recording || isRecording) {
      await handlePressOut();
    }
    setIsRecording(false);
    setRecording(null);
    togglePlayer(false);
    setDuration(0);

    const uuid = '';
    const local_uri = uri;
    const processed_uri = '';
    const created_at = new Date();
    const status = 'pending';

    try {
      const generatedId = await uploadAudio(uri);
      console.log('GENERATED ID', generatedId);

      const savedData = await saveLocal(
        generatedId,
        local_uri,
        processed_uri,
        created_at,
        status
      );

      console.log('SAVING TO LOCAL:', savedData);

      setItems((prev) => [...prev, savedData]);
    } catch (e) {
      console.log('save error', e);
    }
  };

  const handlePressIn = async () => {
    try {
      if (!isPlayerOpen) {
        togglePlayer(true);
      }
      setIsRecording(true);
      console.log('STRARING');
      await Audio.requestPermissionsAsync();
      console.log('REQUESTINGPERMISSIONS');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      console.log('SET AUDIO MODE SYNC DONE');
      const recording = new Audio.Recording();
      console.log('AUDIO INSTANTIATED');
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.High
      );

      recording.setOnRecordingStatusUpdate((status) => {
        console.log(status.durationMillis);
        if (status.durationMillis !== 0) {
          // so that time will not reset to 0
          setDuration(status.durationMillis);
        }
      });

      await recording.startAsync();
      setRecording(recording);
      console.log('RECORDING STARTED');

      await Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.log(JSON.stringify(err));
      setIsRecording(false);
      togglePlayer(false);
      setDuration(0);
      setRecording(undefined);
    }
  };

  const handlePressOut = async () => {
    setIsRecording(false);
    console.log('PRESSOUT');
    console.log(recording);
    if (recording) {
      console.log('OKAY LETS GETITODNE');
      const [status, uri] = await Promise.all([
        recording.stopAndUnloadAsync(),
        recording.getURI(),
      ]);
      setURI(uri);

      setRecording(undefined);
      console.log('Stored at ', uri);
    }

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {isPlayerOpen ? (
        <>
          <View
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 20,
            }}
          >
            <Button
              onPress={() => {
                handleSave();
              }}
              title="Save"
            />
            <Button
              onPress={() => {
                if (recording) recording.stopAndUnloadAsync();
                setDuration(0);
                setRecording(undefined);
                setIsRecording(false);
                setURI(undefined);
                togglePlayer(false);
              }}
              title="Close"
            />
          </View>
          <AudioPlayer uri={uri} initialDuration={duration} />
        </>
      ) : null}
      <TouchableWithoutFeedback
        onPress={isRecording ? handlePressOut : handlePressIn}
      >
        <View
          style={[
            styles.button,
            isRecording && styles.recordingButton,
          ]}
        >
          <View style={styles.innerButton} />
          <Animated.View
            style={[
              styles.recordButton,
              { transform: [{ scale: scaleAnim }] },
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.2,
    borderStyle: 'solid',
    paddingBottom: 40,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 40,
    borderColor: '#B3B3B3',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  innerButton: {
    width: 65,
    height: 65,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3B30',
    position: 'absolute',
  },
  stopButton: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    position: 'absolute',
  },
  recordingButton: {
    borderColor: '#FF3B30',
  },
});

export default VoiceRecorder;
