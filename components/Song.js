import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { duration } from "../lib/time";

function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };
  return (
    <div
      className="grid grid-cols-2 text-gray-500 mt-[-20px] py-4 px-5  hover:bg-tw rounded-lg cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>

        <img
          src={track.track.album.images[0].url}
          alt=""
          className="h-10 w-10"
        />

        <div>
          <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0 ">
        <p className="w-72 hidden md:inline truncate lg:w-72">
          {track.track.album.name}{" "}
        </p>

        <p>{duration(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
