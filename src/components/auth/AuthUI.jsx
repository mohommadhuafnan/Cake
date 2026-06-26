import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AuthParticles from './AuthParticles'
import CursorGlow from './CursorGlow'
import AuthInput from './AuthInput'
import { useLanguage } from '../../context/LanguageContext'

const SPRING = { type: 'spring', stiffness: 280, damping: 28, mass: 0.85 }
const EASE = [0.4, 0, 0.2, 1]

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1, duration: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: 0.25, ease: EASE },
  },
}

const panelContentVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: 0.15 },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25 },
  },
}

export default function AuthUI({ onSubmit, error, loading }) {
  const { lang, t } = useLanguage()
  const isRtl = lang === 'ar'
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(isSignup ? 'register' : 'login', form)
  }

  const toggleMode = () => {
    setIsSignup((v) => !v)
    setForm({ name: '', email: '', password: '' })
  }

  const panelX = isSignup
    ? '0%'
    : isRtl
      ? '-100%'
      : '100%'

  return (
    <div className="auth-shell relative flex items-center justify-center overflow-x-hidden overflow-y-auto px-3 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10 lg:items-center" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Animated background */}
      <motion.div
        className={`absolute inset-0 auth-gradient-bg ${isSignup ? 'auth-gradient-bg--signup' : ''}`}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      />
      <AuthParticles />
      <div className="auth-cursor-glow">
        <CursorGlow />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-[12%] left-[8%] w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(201,168,76,0.2)', willChange: 'transform' }}
        animate={{
          x: isSignup ? 120 : 0,
          y: isSignup ? 40 : 0,
          scale: isSignup ? 1.15 : 1,
        }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[6%] w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(245,230,232,0.25)', willChange: 'transform' }}
        animate={{
          x: isSignup ? -80 : 0,
          y: isSignup ? -30 : 0,
          scale: isSignup ? 0.9 : 1.1,
        }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      {/* Back link */}
      <Link
        to={`/${lang}`}
        className="auth-back-link absolute top-4 start-4 sm:top-6 sm:start-6 z-30 flex items-center gap-2 text-sm transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {t('auth.backHome')}
      </Link>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="auth-card relative w-full max-w-[920px] rounded-2xl sm:rounded-3xl overflow-hidden z-10 mx-auto"
      >
        {/* Mobile / tablet brand strip */}
        <div className="lg:hidden auth-glass-panel auth-mobile-strip relative text-center">
          <p className="auth-panel-brand mb-1">{t('brand')}</p>
          <p className="auth-panel-title font-display text-lg sm:text-xl">
            {isSignup ? t('auth.panelSignupTitle') : t('auth.panelLoginTitle')}
          </p>
          <p className="auth-panel-subtitle text-xs sm:text-sm mt-2 max-w-xs mx-auto">
            {isSignup ? t('auth.panelSignupSubtitle') : t('auth.panelLoginSubtitle')}
          </p>
        </div>

        <div className="auth-card-inner relative flex flex-col lg:flex-row min-h-0 lg:min-h-[580px]">
          {/* Sliding brand panel — desktop only */}
          <motion.div
            className="auth-glass-panel hidden lg:flex absolute top-0 bottom-0 w-1/2 z-20 flex-col items-center justify-center text-center p-8 xl:p-12"
            initial={false}
            animate={{ x: panelX }}
            transition={SPRING}
            style={{ left: 0, willChange: 'transform' }}
          >
            <AnimatePresence mode="wait">
              {isSignup ? (
                <motion.div
                  key="panel-login"
                  variants={panelContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="max-w-xs relative z-10 px-2"
                >
                  <p className="auth-panel-brand mb-4">{t('brand')}</p>
                  <h2 className="auth-panel-title text-2xl xl:text-4xl leading-tight mb-4">
                    {t('auth.panelLoginTitle')}
                  </h2>
                  <p className="auth-panel-subtitle text-sm leading-relaxed mb-8">
                    {t('auth.panelLoginSubtitle')}
                  </p>
                  <motion.button
                    type="button"
                    onClick={toggleMode}
                    className="auth-btn-ghost px-6 sm:px-8 py-3 rounded-full text-sm font-medium uppercase tracking-wider"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('account.login')}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="panel-signup"
                  variants={panelContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="max-w-xs relative z-10 px-2"
                >
                  <p className="auth-panel-brand mb-4">{t('brand')}</p>
                  <h2 className="auth-panel-title text-2xl xl:text-4xl leading-tight mb-4">
                    {t('auth.panelSignupTitle')}
                  </h2>
                  <p className="auth-panel-subtitle text-sm leading-relaxed mb-8">
                    {t('auth.panelSignupSubtitle')}
                  </p>
                  <motion.button
                    type="button"
                    onClick={toggleMode}
                    className="auth-btn-ghost px-6 sm:px-8 py-3 rounded-full text-sm font-medium uppercase tracking-wider"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('account.register')}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Login form */}
          <div className={`auth-form-col relative w-full lg:w-1/2 items-center justify-center ${!isSignup ? 'flex' : 'hidden lg:flex'}`}>
            <AnimatePresence mode="wait">
              {!isSignup && (
                <motion.form
                  key="login-form"
                  onSubmit={handleSubmit}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full max-w-sm space-y-5"
                >
                  <motion.div variants={itemVariants}>
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-charcoal mb-1">
                      {t('account.login')}
                    </h1>
                    <p className="text-muted text-sm">{t('auth.loginSubtitle')}</p>
                  </motion.div>

                  <AuthInput
                    variants={itemVariants}
                    type="email"
                    label={t('checkout.email')}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update('email')}
                    required
                    autoComplete="email"
                  />
                  <AuthInput
                    variants={itemVariants}
                    type="password"
                    label={t('account.password')}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update('password')}
                    required
                    autoComplete="current-password"
                  />

                  {error && (
                    <motion.p variants={itemVariants} className="text-red-500 text-sm">
                      {error}
                    </motion.p>
                  )}

                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="auth-btn-glow w-full py-3.5 rounded-xl text-white text-sm font-medium uppercase tracking-wider disabled:opacity-60"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {loading ? '…' : t('account.login')}
                    </motion.button>
                  </motion.div>

                  <motion.p variants={itemVariants} className="auth-mode-toggle text-center text-sm lg:hidden">
                    {t('auth.noAccount')}{' '}
                    <button type="button" onClick={toggleMode} className="text-gold hover:underline">
                      {t('account.register')}
                    </button>
                  </motion.p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Signup form */}
          <div className={`auth-form-col relative w-full lg:w-1/2 items-center justify-center ${isSignup ? 'flex' : 'hidden lg:flex'}`}>
            <AnimatePresence mode="wait">
              {isSignup && (
                <motion.form
                  key="signup-form"
                  onSubmit={handleSubmit}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full max-w-sm space-y-5"
                >
                  <motion.div variants={itemVariants}>
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-charcoal mb-1">
                      {t('account.register')}
                    </h1>
                    <p className="text-muted text-sm">{t('auth.signupSubtitle')}</p>
                  </motion.div>

                  <AuthInput
                    variants={itemVariants}
                    label={t('checkout.name')}
                    placeholder={t('checkout.name')}
                    value={form.name}
                    onChange={update('name')}
                    required
                    autoComplete="name"
                  />
                  <AuthInput
                    variants={itemVariants}
                    type="email"
                    label={t('checkout.email')}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update('email')}
                    required
                    autoComplete="email"
                  />
                  <AuthInput
                    variants={itemVariants}
                    type="password"
                    label={t('account.password')}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={update('password')}
                    required
                    autoComplete="new-password"
                  />

                  {error && (
                    <motion.p variants={itemVariants} className="text-red-500 text-sm">
                      {error}
                    </motion.p>
                  )}

                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="auth-btn-glow w-full py-3.5 rounded-xl text-white text-sm font-medium uppercase tracking-wider disabled:opacity-60"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {loading ? '…' : t('account.register')}
                    </motion.button>
                  </motion.div>

                  <motion.p variants={itemVariants} className="auth-mode-toggle text-center text-sm lg:hidden">
                    {t('auth.hasAccount')}{' '}
                    <button type="button" onClick={toggleMode} className="text-gold hover:underline">
                      {t('account.login')}
                    </button>
                  </motion.p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
