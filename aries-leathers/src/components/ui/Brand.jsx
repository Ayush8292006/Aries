import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { SITE } from '../../config/site'

export default function Brand({ compact = false, dark = false, hideTextOnMobile = false, onClick }) {
  return (
    <Link to="/" onClick={onClick} className="group flex shrink-0 items-center gap-3" aria-label={`${SITE.name} home`}>
      <img
        src={logo}
        alt=""
        className={`rounded-md object-cover transition-all duration-500 ease-luxe group-hover:-rotate-3 ${compact ? 'h-9 w-9' : 'h-11 w-11'}`}
      />
      <div className={`leading-none ${hideTextOnMobile ? 'hidden sm:block' : ''}`}>
        <p className={`font-display font-semibold tracking-[0.28em] transition-all duration-500 ${compact ? 'text-lg' : 'text-xl'} ${dark ? 'text-bone' : 'text-ink'}`}>
          ARIES
        </p>
        <p className={`mt-1 text-[8px] font-medium tracking-[0.38em] ${dark ? 'text-gold-light' : 'text-oxblood'}`}>
          LEATHERS · EST. {SITE.since}
        </p>
      </div>
    </Link>
  )
}