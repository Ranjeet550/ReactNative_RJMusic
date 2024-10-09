import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import TrackPlayer, { usePlaybackState, State, useProgress, Track } from 'react-native-track-player';
import { setupPlayer, addTracks } from '../musicPlayerService';
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const playbackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    async function setup() {
      try {
        let isSetup = await setupPlayer();
        if (isSetup) {
          await addTracks();
        }
        setIsPlayerReady(true);
      } catch (error) {
        console.error('Error setting up the player:', error);
      }
    }

    setup();
  }, []);

  useEffect(() => {
    const updateCurrentTrack = async () => {
      const index = await TrackPlayer.getCurrentTrack();
      if (index !== null) {
        const track = await TrackPlayer.getTrack(index);
        setCurrentTrack(track || null);
      } else {
        setCurrentTrack(null);
      }
    };

    updateCurrentTrack();
  }, [playbackState]);

  const togglePlayback = async (playbackState: State) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack !== null) {
      if (playbackState === State.Paused || playbackState === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

  const seekTo = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  const skipForward = async () => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(position + 10);
  };

  const skipBackward = async () => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(Math.max(0, position - 10));
  };

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {currentTrack && (
          <View style={styles.trackInfo}>
            <Image
              style={styles.artwork}
              source={{ uri: currentTrack.artwork as string }}
            />
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          </View>
        )}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${(progress.position / progress.duration) * 100}%` }]} />
          </View>
        </View>
        <Text style={styles.progressText}>
          {new Date(progress.position * 1000).toISOString().substr(14, 5)} / 
          {new Date(progress.duration * 1000).toISOString().substr(14, 5)}
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={skipBackward}>
            <Text style={styles.controlButtonText}>-10s</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => TrackPlayer.skipToPrevious()}>
            <Text style={styles.controlButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => playbackState.state !== undefined && togglePlayback(playbackState.state)}
          >
            <Text style={styles.controlButtonText}>
              {playbackState.state === State.Playing ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={() => TrackPlayer.skipToNext()}>
            <Text style={styles.controlButtonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={skipForward}>
            <Text style={styles.controlButtonText}>+10s</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  artwork: {
    width: 350,
    height: 350,
    marginBottom: 10,
    borderRadius: 10,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    width: 300,
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#4f4f4f',
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    marginBottom: 10,
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});