import VideoHero from '../../components/sections/VideoHero'
import Intro from '../../components/home/Intro'
import Spotlight from '../../components/home/Spotlight'
import Categories from '../../components/home/Categories'
import Trending from '../../components/home/Trending'
import Craft from '../../components/home/Craft'
import Story from '../../components/home/Story'
import Worldwide from '../../components/home/Worldwide'
import Promises from '../../components/home/Promises'
import FinalCta from '../../components/home/FinalCta'

export default function Home() {
  return (
    <>
      <VideoHero />
      <Intro />
      <Spotlight />
      <Categories />
      <Trending />
      <Craft />
      <Story />
      <Worldwide />
      <Promises />
      <FinalCta />
    </>
  )
}