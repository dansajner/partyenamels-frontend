import type { NextPage } from 'next'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import Image from "next/image"
import tony1 from "/public/tony-1.png"
import tony2 from "/public/tony-2.png"
import tony3 from "/public/tony-3.png"
import tony4 from "/public/tony-4.png"

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
      <Carousel autoPlay={true} interval={3000} autoFocus={true} infiniteLoop={true} showThumbs={false}>
        {[tony1, tony2, tony3, tony4].map((tony, index) => {
          return (
            <Image key={index} alt="Tony" src={tony} />
          )
        })}
      </Carousel>
    </div>
  )
}

export default WifiProblems
