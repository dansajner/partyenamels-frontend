import React from "react";
import type { NextPage } from "next";
import Image from "next/image";
import ReactPlayer from "react-player";
import styles from "../styles/Party.module.css";

const Party: NextPage = () => {
  const foxes: Array<number> = [...Array<number>(1000)];

  const displayStyle = (spot: number) => {
    const timeout = setTimeout(() => {
      return "block";
    }, 250 * spot);

    return () => clearTimeout(timeout);
  };

  return (
    <div className={styles.partyHouse}>
      <div className={styles.partyTime}>PARTY TIME.</div>
      {foxes.map((key) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key}
          style={{ display: `${displayStyle(key)}` }}
          className={styles.fox}
          src={"/pe-pink-small.png"}
          alt="Party Enamels Pink"
        />
      ))}
      {/* <ReactPlayer
        url="https://soundcloud.com/user-302722010/dj-snake-lil-jon-turn-down-for"
        playing
        loop
        light
      /> */}
    </div>
  );
};

export default Party;
