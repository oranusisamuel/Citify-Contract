const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateContactInput = ({ name, email, message, consent }) => {
  const normalizedName = String(name || '').trim()
  const normalizedEmail = String(email || '').trim()
  const normalizedMessage = String(message || '').trim()

  if (normalizedName.length < 2) {
    return 'Please enter your name (at least 2 characters).'
  }

  if (!CONTACT_EMAIL_REGEX.test(normalizedEmail)) {
    return 'Please enter a valid email address.'
  }

  if (normalizedMessage.length < 10) {
    return 'Please enter a message with at least 10 characters.'
  }

  if (!consent) {
    return 'Please agree to the privacy policy before submitting.'
  }

  return ''
}
