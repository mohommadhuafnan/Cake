import { motion } from 'framer-motion'

export default function AuthInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
  variants,
}) {
  return (
    <motion.div variants={variants} className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium uppercase tracking-widest text-charcoal/50">
          {label}
        </label>
      )}
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="auth-input w-full px-4 py-3.5 rounded-xl text-charcoal placeholder:text-charcoal/35 text-sm"
        whileFocus={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </motion.div>
  )
}
