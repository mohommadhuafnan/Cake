import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { categoryNav } from '../data/homeContent'

export default function CategoryNav() {
  const { lang, localized } = useLanguage()

  return (
    <div className="category-nav glass-nav border-t border-white/30 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-3 md:px-5 flex items-center gap-0 min-w-max md:min-w-0 md:justify-center">
        {categoryNav.map((cat) => {
          const to = cat.link
            ? `/${lang}/${cat.link}`
            : cat.id === 'all'
              ? `/${lang}/shop`
              : `/${lang}/shop?category=${cat.id}`

          return (
            <Link
              key={cat.id}
              to={to}
              className="category-nav-link px-3 md:px-5 py-2 text-[11px] md:text-xs font-medium text-charcoal/75 hover:text-gold whitespace-nowrap transition-colors relative group"
            >
              {localized(cat.label)}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gold transition-all duration-300 group-hover:w-2/3" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
