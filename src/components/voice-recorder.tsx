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
import axios from 'axios';

const VoiceRecorder = ({ setItems }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Recording>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPlayerOpen, togglePlayer] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [uri, setURI] = useState<string>();

  // const handleSave = async () => {
  //   setIsRecording(false);
  //   setRecording(null);
  //   togglePlayer(false);
  //   setDuration(0);

  //   // try {
  //   // list: [{uuid: "", local_uri: "", processed_uri: "", created_at: "", status: ""}]
  //   const currList = await AsyncStorage.getItem('@audio_List');
  //   if (currList !== null) {
  //     const uuid = '';
  //     const local_uri = uri;
  //     const processed_uri = '';
  //     const created_at = new Date();
  //     const status = 'pending';

  //     const response = await fetch(uri);
  //     const blob = await response.blob();

  //     console.log('blobbing');

  //     const formData = new FormData();
  //     formData.append('file', blob);

  //     console.log('here');

  //     // Send the POST request to the server
  //     const uploadUrl = 'http://192.168.137.1:8000/upload';
  //     // const apiResponse = await fetch(uploadUrl, {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'multipart/form-data',
  //     //   },
  //     //   body: formData,
  //     // });
  //     fetch('http://localhost:8000/test/health-check').then((res) =>
  //       console.log(JSON.stringify(res))
  //     );
  //     console.log('repsonse here');

  //     // if (!apiResponse.ok) {
  //     //   const errorData = await apiResponse.json();
  //     //   console.error(errorData);
  //     // } else {
  //     //   const responseData = await apiResponse.json();
  //     //   console.log(responseData);
  //     // }

  //     const newList = JSON.parse(currList);
  //     newList.push({
  //       uuid: uuid,
  //       local_uri: local_uri,
  //       processed_uri: processed_uri,
  //       created_at: created_at,
  //       status: status,
  //     });
  //     await AsyncStorage.setItem(
  //       '@audio_List',
  //       JSON.stringify({ list: newList })
  //     ); // convert newList to string before storing in AsyncStorage
  //     setItems(newList);
  //   } else {
  //     const uuid = '';
  //     const local_uri = uri;
  //     const processed_uri = '';
  //     const created_at = new Date();
  //     const status = 'pending';

  //     const newList = [
  //       {
  //         uuid: uuid,
  //         local_uri: local_uri,
  //         processed_uri: processed_uri,
  //         created_at: created_at,
  //         status: status,
  //       },
  //     ];
  //     await AsyncStorage.setItem(
  //       '@audio_List',
  //       JSON.stringify({ list: newList })
  //     ); // convert newList to string before storing in AsyncStorage
  //     setItems(newList);
  //   }
  //   // } catch (e) {
  //   //   console.log(e);
  //   // }
  // };

  const handleSave = () => {
    console.log('test fetch');
    axios
      .get(
        'https://ab08-2001-4452-419-b100-91cb-b495-2051-f899.ngrok-free.app/test/health-check'
      )
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((err) => console.log(err));
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
      console.log('JKSAOPDKASPODKASP', recording);

      await Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.log(JSON.stringify(err));
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
                togglePlayer(false);
                setDuration(0);
                setRecording(null);
              }}
              title="Close"
            />
          </View>
          <AudioPlayer uri={uri} initialDuration={duration} />
        </>
      ) : null}
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
  recordingButton: {
    borderColor: '#FF3B30',
  },
});

export default VoiceRecorder;
