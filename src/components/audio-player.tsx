import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  AppState,
} from 'react-native';
import { Audio } from 'expo-av';
import PlayIcon from '../icons/play';
import PauseIcon from '../icons/pause';

const AudioPlayer = ({
  uri,
  initialDuration,
}: {
  uri: string;
  initialDuration?: number;
}) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(
    appState.current
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const playSound = async () => {
    try {
      console.log('TRING TO PLAY', uri);
      const { sound: newSound } = await Audio.Sound.createAsync(
        {
          uri,
        },
        {
          shouldPlay: true,
          positionMillis: position == duration ? 0 : position,
        }
      );
      console.log(sound);

      setSound(newSound);
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    try {
      if (status.didJustFinish) {
        setPosition(status.durationMillis);
        setIsPlaying(false);
        sound.unloadAsync();
      } else if (status.isPlaying) {
        console.log(
          'Position:',
          status.positionMillis,
          'Duration:',
          status.durationMillis
        );
        setDuration(status.durationMillis);
        setPosition(status.positionMillis);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const pauseSound = async () => {
    if (sound !== null) {
      setIsPlaying(false);
      sound.pauseAsync();
    }
  };

  const stopSound = async () => {
    if (sound !== null) {
      setIsPlaying(false);
      sound.stopAsync();
      sound.unloadAsync();
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds.toString().padStart(2, '0');
    return `${minutes}:${paddedSeconds}`;
  };

  useEffect(() => {
    const loadSound = async () => {
      try {
        console.log('TRING TO LOAD', uri);
        stopSound();

        const { sound: newSound } = await Audio.Sound.createAsync(
          {
            uri,
          },
          {
            shouldPlay: false,
            positionMillis: position == duration ? 0 : position,
          }
        );

        setSound(newSound);
        setPosition(0);
        setIsPlaying(false);
        newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    };

    loadSound();
  }, [uri]);

  useEffect(() => {
    return () => {
      Audio.Sound.createAsync(
        { uri },
        {
          shouldPlay: true,
          positionMillis: position == duration ? 0 : position,
        }
      )
        .then((res) => {
          const { sound } = res;
          setIsPlaying(false);

          setSound(sound);
          sound.stopAsync();
          sound.unloadAsync();
        })
        .catch((err) => {
          console.log('ohno');
          console.log(err);
        });
    };
  }, [uri]);

  const handlePressIn = () => {
    console.log('ttestlksealp;fk');
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    console.log('pressednoautoatu');
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={isPlaying ? pauseSound : playSound}
          style={{
            borderRadius: 100,
          }}
        >
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                width: 50,
                height: 50,
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </View>
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.seekBar}>
          <View style={styles.progress}>
            <View
              style={[
                styles.bar,
                { width: `${(position / duration) * 100}%` },
              ]}
            ></View>
          </View>
        </View>
      </View>

      <View>
        <Text style={{ fontSize: 40 }}>
          {formatTime(position)}:
          {formatTime(duration !== 0 ? duration : initialDuration)}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  seekBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    width: '80%',
  },
  progress: {
    flex: 1,
    height: 8,
    backgroundColor: '#f2f2f2',
    marginHorizontal: 8,
    borderRadius: 4,
  },
  bar: {
    height: 8,
    backgroundColor: '#d3d3d3',
    borderRadius: 4,
  },
});

export default AudioPlayer;
