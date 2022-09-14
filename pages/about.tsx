import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import peBlueSmall from "../public/pe-blue-small.png";
import peGreenSmall from "../public/pe-green-small.png";
import pePinkSmall from "../public/pe-pink-small.png";
import styles from "../styles/About.module.css";
import type { Payload, TeamMember, TeamMemberLink } from "./api/teammembers";

const gravatarUrl = (links: TeamMemberLink[]): string => {
  const link = links.find((link) => link.name === "gravatar");
  return link!.url;
};

const TeamMemberLink = ({ displayName, name, url }: TeamMemberLink) => (
  <Link href={url}>
    <a className={styles.card} key={name}>
      {displayName}
    </a>
  </Link>
);

const TeamMember = ({ links, name }: TeamMember) => (
  <div className={styles.membergrid}>
    <Image src={gravatarUrl(links)} width="50px" height="50px" alt={name} />
    <h3>{name}</h3>
    <div>
      {links.map((memberLink) => (
        <TeamMemberLink key={memberLink.name} {...memberLink}></TeamMemberLink>
      ))}
    </div>
  </div>
);

const About: NextPage = () => {
  const [members, setMembers] = useState<Payload>({ data: [] });

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch("/api/teammembers");
      return (await response.json()) as Payload;
    };

    fetchMembers().then(setMembers).catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Party Enamels - About</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Meet the Party Enamels!</h1>

        <p className={styles.description}>
          <Image src={pePinkSmall} alt="Party Enamels Pink" />
          <Image src={peGreenSmall} alt="Party Enamels Green" />
          <Image src={peBlueSmall} alt="Party Enamels Blue" />
        </p>

        <h2>Members</h2>
        <div className={`${styles.grid}`}>
          {members.data.map((member) => (
            <TeamMember key={member.name} {...member}></TeamMember>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a>
          Powered by{" "}
          <span className={styles.logo}>
            <Image
              src={peGreenSmall}
              alt="Party Enamels Green"
              width={42}
              height={36}
            />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default About;
