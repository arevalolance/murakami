import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
  AppState,
} from 'react-native';
import AudioPlayer from '../components/audio-player';
import { BASE_URL } from '../lib/constants';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

type AudioFiles = {
  original: string;
  separated: {
    two_speakers: string[];
    three_speakers: string[];
  };
  upsampled: {
    two_speakers: string[];
    three_speakers: string[];
  };
};

const PlayerScreen = ({ route }) => {
  const { id } = route.params;
  const [uri, setURI] = useState<AudioFiles>({
    original: '',
    separated: { two_speakers: [], three_speakers: [] },
    upsampled: { two_speakers: [], three_speakers: [] },
  });
  const [currentURI, setCurrentURI] = useState<string>('');
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<string>('');
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'two_speakers', title: 'Two Speakers' },
    { key: 'three_speakers', title: 'Three Speakers' },
  ]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      async function getFiles() {
        try {
          console.log(`http://${BASE_URL}/file/all/${id}`);
          const res = await fetch(
            `http://${BASE_URL}/file/all/${id}`
          );

          const result = await res.json();
          console.log('IOATEWOIJAWEIOFJAWEIOF', result);

          if (!result['detail']) {
            setURI(result);
          }
        } catch (err) {}
      }

      getFiles();
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    async function getFiles() {
      try {
        console.log(`http://${BASE_URL}/file/all/${id}`);
        const res = await fetch(`http://${BASE_URL}/file/all/${id}`);

        const result = await res.json();
        console.log('IOATEWOIJAWEIOFJAWEIOF', result);

        if (!result['detail']) {
          setURI(result);
        }
      } catch (err) {}
    }

    getFiles();
  }, []);

  const SpeakerContainer = ({ title, uri, task }) => {
    return (
      // TODO: onpress set current URI to this
      <View style={{ width: '100%' }}>
        <TouchableOpacity
          onPress={() => {
            setCurrentlyPlaying(`${title} ${task}`);
            setCurrentURI(uri);
          }}
        >
          <View style={speakerStyle.container}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
              {title}
            </Text>
            <View style={speakerStyle.subHeader}></View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const Speakers = ({ speakers }: { speakers: string }) => {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        style={{ flex: 1 }}
      >
        {uri['upsampled'][speakers] &&
        uri['separated'][speakers].length > 0 ? (
          <>
            <Text style={styles.speakersHeading}>Separated</Text>
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {uri['separated'][speakers].map((item, index) => (
                <SpeakerContainer
                  key={speakers + item + 'separated'}
                  title={`Speaker ${index + 1}`}
                  uri={item}
                  task="Separated"
                />
              ))}
            </View>
          </>
        ) : (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size="large"
            color="#0000ff"
          />
        )}

        {uri['upsampled'][speakers] &&
        uri['upsampled'][speakers].length > 0 ? (
          <>
            <Text style={styles.speakersHeading}>
              With Upsampling
            </Text>
            <View
              style={{
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {uri['upsampled'][speakers].map((item, index) => (
                <SpeakerContainer
                  key={speakers + item + 'upsampled'}
                  title={`Speaker ${index + 1}`}
                  uri={item}
                  task="with Upsampling"
                />
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    );
  };

  const TwoSpeaker = () => {
    return <Speakers speakers="two_speakers" />;
  };

  const ThreeSpeaker = () => {
    return <Speakers speakers="three_speakers" />;
  };

  const renderScene = SceneMap({
    two_speakers: TwoSpeaker,
    three_speakers: ThreeSpeaker,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'gray' }}
      style={{ backgroundColor: 'white' }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: 'black', margin: 8 }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          {id}
        </Text>
      </View>

      <View style={styles.controls}>
        <AudioPlayer uri={currentURI} initialDuration={0} />
      </View>

      <Text style={styles.speakerCountHeading}>
        Currently Playing: {currentlyPlaying}
      </Text>

      <Text style={styles.speakersHeading}>Original Audio</Text>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <SpeakerContainer
          title={'Recorded Audio'}
          uri={uri['original']}
          task="Original"
        />
      </View>

      {uri && layout && (
        <TabView
          style={{ marginTop: 20 }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          initialLayout={{ width: layout.width }}
        />
      )}
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
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  speakerCountHeading: {
    marginTop: 10,
    marginBottom: 30,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20,
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default PlayerScreen;
