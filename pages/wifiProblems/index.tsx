import type { NextPage } from 'next'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import Image from "next/image"
import tony1 from "/public/tony-1.png"
import tony2 from "/public/tony-2.png"
import tony3 from "/public/tony-3.png"

const WifiProblems: NextPage = () => {
  return (
    <div>
      <h1>WifiProblems</h1>
      <WifiCarousel />
      <iframe width="100%" height="115" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/307025543&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
    </div>
  )
}

const WifiCarousel = () => {
  return (
    <div>
      <Carousel showThumbs={false}>
        <div>
          <Image alt="Tony" src={tony1} />
        </div>
        <div>
          <Image alt="More Tony" src={tony2} />
        </div>
        <div>
          <Image alt="Still Tony" src={tony3} />
        </div>
      </Carousel>
    </div>
  )
}

export default WifiProblems
