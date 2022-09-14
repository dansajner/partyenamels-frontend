import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/About.module.css'
import * as TeamMembers from './api/teammembers'

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const About: NextPage = () => {
  const [members, setMembers] = useState<TeamMembers.Payload>({ data: [] })
  useEffect(() => {
    (async function foo() {
      const response = await fetch('/api/teammembers')
      setMembers(await response.json())
    })()
  }, [])

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
          {members.data.map((member) => {
            return (
              <div key={member.name} className={styles.cardgrid}>
                <Image style={{float: "left"}} src={member.gravatar} width="50px" height="50px" alt={member.name} />
                <h4>{member.name}</h4> 
                <div>
                  {TeamMembers.TEAM_MEMBER_LINKS.map((key) => (
                    <div className={styles.card} key={key}>
                      <Link href={member[key]}>{capitalize(key)}</Link>
                    </div>
                  ))}
                </div>

              </div>
            )
          })}
        </div>
      </main>

    </div>
  )
}

export default About