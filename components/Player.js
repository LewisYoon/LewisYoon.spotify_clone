import {
  BsFillVolumeDownFill,
  BsFillVolumeMuteFill,
  BsFillVolumeOffFill,
  BsFillVolumeUpFill,
} from "react-icons/bs";
import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  FastForwardIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce, zip } from "lodash";
import { useSession } from "next-auth/react";
import { Input } from "postcss";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();
  var icon;

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing: ", data.body?.item);
        setCurrentIdTrack(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

  if (volume >= 75) {
    icon = (
      <BsFillVolumeUpFill
        className="button"
        onClick={() => volume > 0 && setVolume((volume = 0))}
      />
    );
  } else if (volume >= 35 && volume < 75) {
    icon = (
      <BsFillVolumeDownFill
        className="button"
        onClick={() => volume > 0 && setVolume((volume = 0))}
      />
    );
  } else if (volume >= 1 && volume < 35) {
    icon = (
      <BsFillVolumeOffFill
        className="button"
        onClick={() => volume > 0 && setVolume((volume = 0))}
      />
    );
  } else {
    icon = <BsFillVolumeMuteFill className="button" />;
  }
  // volume icon

  return (
    <div>
      {/* left */}
      <div
        className="h-24 bg-[#161616] border-t-[0.5px]
        border-gray-800 text-white
      grid grid-cols-3 text-xs md:text-base px-2 md:px-8"
      >
        <div className="flex items-center space-x-4">
          <img
            src={songInfo?.album?.images?.[0]?.url}
            alt=""
            className="hidden md:inline h-10 w-10"
          />
          {isPlaying ? (
            <marquee width="100%" direction="left">
              <h3>{songInfo?.name}</h3>
              <p>{songInfo?.artists?.[0]?.name}</p>
            </marquee>
          ) : (
            <div className="truncate">
              <h3>{songInfo?.name}</h3>
              <p>{songInfo?.artists?.[0]?.name}</p>
            </div>
          )}
        </div>
        {/* centre */}
        <div className="flex items-center justify-evenly">
          <SwitchHorizontalIcon className="button" />
          <RewindIcon className="button" />
          {isPlaying ? (
            <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
          )}
          <FastForwardIcon
            onClick={() => spotifyApi.skipToNext()}
            className="button"
          />
          <ReplyIcon className="button" />
        </div>

        {/* right */}
        <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
          {icon}
          <input
            className="w-20 md:w-32"
            type="range"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            min={0}
            max={100}
          />
        </div>
      </div>
    </div>
  );
}

export default Player;
