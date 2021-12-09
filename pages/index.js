import { getSession } from "next-auth/react";
import Head from "next/head";
import Centre from "../components/Centre";
import Player from "../components/Player";
import SideBar from "../components/SideBar";
import logo from "./logo.svg";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        {/* sidebar */}
        <SideBar />

        {/* centre */}
        <Centre />
      </main>
      <div className="sticky bottom-0">
        {/* player */}
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
