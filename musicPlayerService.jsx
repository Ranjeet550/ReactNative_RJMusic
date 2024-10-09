import TrackPlayer, { Event, Capability } from "react-native-track-player"
import { playListData } from "./src/components/Data"

export async function setupPlayer() {
    let isSetup = false;
    try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.Stop,
            ],
        });
        isSetup = true;
    } catch (error) {
        console.error('Error setting up the player:', error);
    }
    return isSetup;
}

export async function addTracks() {
    await TrackPlayer.add(playListData);
}

export async function playBackService() {
    TrackPlayer.addEventListener(Event.RemotePause, TrackPlayer.pause);
    TrackPlayer.addEventListener(Event.RemotePlay, TrackPlayer.play);
    TrackPlayer.addEventListener(Event.RemoteNext, TrackPlayer.skipToNext);
    TrackPlayer.addEventListener(Event.RemotePrevious, TrackPlayer.skipToPrevious);
    TrackPlayer.addEventListener(Event.RemoteStop, TrackPlayer.stop);
    TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
        TrackPlayer.seekTo(event.position);
    });
}
