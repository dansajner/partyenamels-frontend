import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/About.module.css";
import * as TeamMembers from "./api/teammembers";

const gravatarUrl = (links: TeamMembers.TeamMemberLink[]): string => {
  const link = links.find((link) => link.name === "gravatar");
  return link!.url;
};

const TeamMemberLink = ({ displayName, name, url }: TeamMembers.TeamMemberLink) => (
  <div className={styles.card} key={name}>
    <Link href={url}>{displayName}</Link>
  </div>
);

const TeamMember = ({ links, name }: TeamMembers.TeamMember) => (
  <div className={styles.cardgrid}>
    <Image src={gravatarUrl(links)} width="50px" height="50px" alt={name} />
    <h4>{name}</h4>
    <div>
      {links.map((memberLink) => (
        <TeamMemberLink key={memberLink.name} {...memberLink}></TeamMemberLink>
      ))}
    </div>
  </div>
);

const About: NextPage = () => {

  const [members, setMembers] = useState<TeamMembers.Payload>({ data: [] });

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch("/api/teammembers");
      return (await response.json()) as TeamMembers.Payload;
    };

    fetchMembers().then(setMembers).catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Party Enamels - About</title>
      </Head>
      <div>
        <h1>About Us</h1>
      </div>
      <main>
        <h2>Members</h2>
        <div className={`${styles.cardlayout}`}>
          {members.data.map((member) => (
            <TeamMember key={member.name} {...member}></TeamMember>
          ))}
        </div>
      </main>
    </div>
  );
};

export default About;
