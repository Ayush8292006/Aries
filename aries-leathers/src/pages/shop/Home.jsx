import ClotheslineHero from '../../components/home/ClotheslineHero'
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
    <div className="relative">
      {/* 🔥 Sticky Wrapper: Ye ClotheslineHero ko screen par fix rakhega */}
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
        <ClotheslineHero />
      </div>

      {/* 🔥 Baaki ka content jo upar se slide hokar aayega */}
      <div className="relative z-10 bg-ivory shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <Categories />
        <Intro />
        <Spotlight />
        <Trending />
        <Craft />
        <Story />
        <Worldwide />
        <Promises />
        <FinalCta />
      </div>
    </div>
  )
}