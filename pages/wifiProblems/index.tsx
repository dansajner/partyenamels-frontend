import type { NextPage } from 'next'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { Carousel } from "react-responsive-carousel"
import Image from "next/image"

const WifiProblems: NextPage = () => {
  return (
    <div>
      <h1>WifiProblems</h1>
      <WifiCarousel />
      <iframe width="100%" height="115" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/307025543&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
    </div>
  )
}

const WifiCarousel = () =>{
    return (
        <div>
            <Carousel autoPlay={true} interval={3000} autoFocus={true} infiniteLoop={true} showThumbs={false}>
                <div>
                    <Image
                        width="500px"
                        height="500px"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVUUoZaTmZFcKY71GlOP_SpNLzg-vEccAGKWc1FVes&s"
                    />
                    <p className="legend">Best Wifi Problem</p>
                </div>
                <div>
                    <Image
                        width="500px"
                        height="500px"
                        src="https://images.pexels.com/photos/46166/robin-european-robin-erithacus-rubecula-red-46166.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    />
                    <p className="legend">Best Wifi Problem</p>
                </div>
            </Carousel>
        </div>
    )
}

export default WifiProblems
