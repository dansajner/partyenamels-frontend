import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import * as TeamMembers from './api/teammembers'


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
        <pre>
          {JSON.stringify(members, null, "  ")}
        </pre>


        <div className={styles.grid}>
          {members.data.map((member) => {
            return (
              <div key={member.name} className={styles.card}>
                <h4>{member.name}</h4>
                {TeamMembers.TEAM_MEMBER_LINKS.map((key) => (
                  <div key={key}><Link  href={member[key]}>{key}</Link></div>
                ))
                }

              </div>
            )
            return Object.entries(member).map(([key, value]) => {
              return (<div key={key}>{key}: {value}</div>)
            })
          })}
        </div>
      </main>

    </div>
  )
}

export default About