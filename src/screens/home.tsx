import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AudioContainer from '../components/audio-container';
import VoiceRecorder from '../components/voice-recorder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioData } from '../lib/types';
import axios from 'axios';

const HomeScreen = ({ route, navigation }) => {
  const [items, setItems] = useState<AudioData[]>([]);

  useEffect(() => {
    axios
      .get('http://172.22.29.35:8001/test/health-check')
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));

    async function getData() {
      try {
        const value = await AsyncStorage.getItem('@audio_List');
        if (value) {
          const list = JSON.parse(value);
          console.log(list['list']);
          setItems(list['list']);
        }
      } catch (e) {}
    }

    getData();
  }, []);

  return (
    <View style={styles.container}>
      {items.length > 0 ? (
        <>
          <ScrollView>
            {items.map((item) => (
              <AudioContainer
                key={item.uuid}
                title={item.uuid}
                created_at={item.created_at}
                status={item.status}
                navigation={navigation}
              />
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyPromptContainer}>
          <Text style={styles.emptyPrompt}>
            You haven't recorded any audio yet.
          </Text>
        </View>
      )}
      <VoiceRecorder setItems={setItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyPromptContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  emptyPrompt: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default HomeScreen;
