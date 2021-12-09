import { AcademicCapIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import { playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import SongT from "./SongT";

const colours = [
  "from-green-400",
  "from-green-500",
  "from-blue-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
  "from-indigo-500",
];

function Centre() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [colour, setColour] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  useEffect(() => {
    setColour(shuffle(colours).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, playlistId]);

  console.log(playlist);
  return (
    <div
      className=" flex-grow
    text-white h-screen overflow-y-scroll"
    >
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full
        p-1 pr-2"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user?.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <div className={`bg-gradient-to-b ${colour} to-[black] h-[600px]`}>
        <section
          className={`flex items-end space-x-7   h-80 text-white px-8 py-8`}
        >
          <img
            className="h-48 w-48 lg: shadow-2xl lg:h-60 lg:w-60"
            src={playlist?.images?.[0]?.url}
            alt="song cover"
          />
          <div>
            <p>PLAYLIST</p>
            <h1 className="text-4xl xl:text-8xl font-bold">{playlist?.name}</h1>
          </div>
        </section>

        <div className="bg-black bg-opacity-20">
          <SongT />
          <Songs />
        </div>
      </div>
    </div>
  );
}

export default Centre;
