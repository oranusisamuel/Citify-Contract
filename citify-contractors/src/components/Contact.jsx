import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { motion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import { makeFadeUp, makeStaggerContainer, useMotionSettings, viewportOnce } from '../utils/motion'
import { createContactRequest } from '../utils/contactStore'

const Contact = () => {
     const [result, setResult] = React.useState("");
  const [contactError, setContactError] = React.useState('');
  const [consent, setConsent] = React.useState(false);
  const motionSettings = useMotionSettings()
  const fadeUp = makeFadeUp(motionSettings)
  const staggerContainer = makeStaggerContainer(motionSettings)
  const socialProfiles = [
    { name: 'Facebook', handle: '@citifycontractors', href: 'https://www.facebook.com/citifycontractors', icon: <FaFacebookF /> },
    { name: 'Instagram', handle: '@citifycontractors', href: 'https://www.instagram.com/citifycontractors/', icon: <FaInstagram /> },
    { name: 'LinkedIn', handle: 'Citify Contractors', href: 'https://www.linkedin.com/company/citify-contractors', icon: <FaLinkedinIn /> },
    { name: 'X (Twitter)', handle: '@citifycontractors', href: 'https://twitter.com/citifycontractors', icon: <FaTwitter /> },
  ]

  const onSubmit = async (event) => {
    event.preventDefault();
    setContactError('');
    const formData = new FormData(event.target);
    const name = String(formData.get('Name') || '').trim();
    const email = String(formData.get('Email') || '').trim();
    const message = String(formData.get('Message') || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) {
      setContactError('Please enter your name (at least 2 characters).');
      return;
    }
    if (!emailRegex.test(email)) {
      setContactError('Please enter a valid email address.');
      return;
    }
    if (message.length < 10) {
      setContactError('Please enter a message with at least 10 characters.');
      return;
    }
    if (!consent) {
      setContactError('Please agree to the privacy policy before submitting.');
      return;
    }

    setResult('Sending...');

        try {
          await createContactRequest({
            name,
            email,
            message,
            source: 'contact-page',
          })

          toast.success('Form Submitted Successfully');
          setResult('Form Submitted Successfully');
          event.target.reset();
          setConsent(false);
          setContactError('');
          setTimeout(() => {
            setResult('');
          }, 2500)
        } catch (error) {
          console.error('Contact form submit error:', error);
          if (!navigator.onLine) {
            setContactError("You're offline.");
            toast.error("You're offline.");
          } else {
            setContactError('Unable to submit right now. Please try again shortly.');
            toast.error('Unable to submit right now. Please try again shortly.');
          }
          setResult('');
        }
    };
  return (
    <section className='p-6 py-20 lg:px-32 w-full overflow-hidden bg-[radial-gradient(circle_at_top,#d4f1e4,#eaf8f2_45%,#ffffff_85%)]' id='Contact'>
      <motion.div
        className='max-w-6xl mx-auto'
        initial='hidden'
        whileInView='visible'
        viewport={viewportOnce}
        variants={fadeUp}
      >
        <div className='text-center mb-12'>
          <h1 className='text-3xl sm:text-5xl font-bold text-slate-900'>Let's Build Something <span className='text-brand'>Remarkable</span></h1>
          <p className='text-slate-600 mt-3 max-w-2xl mx-auto'>Share your land interest, timeline, and acquisition goals. Our team will get back with a tailored solution for your property needs.</p>
        </div>

        <motion.div
          className='grid grid-cols-1 lg:grid-cols-5 gap-6'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className='lg:col-span-2 rounded-3xl bg-slate-900 text-white p-8 shadow-xl'>
            <p className='text-xs uppercase tracking-[0.2em] text-brand/70 font-semibold'>Direct line</p>
            <h2 className='text-2xl font-semibold mt-2'>Speak with our planning team</h2>
            <p className='text-slate-300 mt-4 leading-relaxed'>From prime residential land to commercial plots, we guide you from first consultation to acquisition completion.</p>

            <div className='mt-8 space-y-4 text-sm'>
              <div className='rounded-xl bg-white/10 border border-white/15 p-4'>
                <p className='text-brand/60 uppercase text-[10px] tracking-widest'>Office Hours</p>
                <p className='mt-1 font-medium'>Mon - Fri, 10:00 AM - 5:00 PM</p>
              </div>
              <div className='rounded-xl bg-white/10 border border-white/15 p-4'>
                <p className='text-brand/60 uppercase text-[10px] tracking-widest'>Response Time</p>
                <p className='mt-1 font-medium'>Usually within 1 business day</p>
              </div>
            </div>

            <div className='mt-6 pt-5 border-t border-white/10 flex items-center justify-between'>
              <p className='text-xs text-slate-400'>Find us online</p>
              <div className='flex items-center gap-2'>
                {socialProfiles.map((profile) => (
                  <a
                    key={profile.name}
                    href={profile.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    title={profile.name}
                    className='w-8 h-8 flex items-center justify-center rounded-lg border border-white/15 bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white transition-colors text-sm'
                  >
                    {profile.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className='lg:col-span-3 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur px-8 pt-8 pb-5 shadow-lg'>
            <form onSubmit={onSubmit} className='text-slate-700'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-slate-700'>Your Name</label>
                  <input
                    className='w-full border border-slate-300 rounded-xl py-3 px-4 mt-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand'
                    type='text'
                    name='Name'
                    placeholder='Your full name'
                    required
                  />
                </div>
                <div>
                  <label className='text-sm font-medium text-slate-700'>Your Email</label>
                  <input
                    className='w-full border border-slate-300 rounded-xl py-3 px-4 mt-2 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand'
                    type='email'
                    name='Email'
                    placeholder='Your Email'
                    required
                  />
                </div>
              </div>

              <div className='mt-5'>
                <label className='text-sm font-medium text-slate-700'>Message</label>
                <textarea
                  className='w-full border border-slate-300 rounded-xl py-3 px-4 mt-2 h-44 resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand'
                  name='Message'
                  placeholder='Enter your message'
                  required
                />
              </div>

              <label className='mt-5 flex items-start gap-3 cursor-pointer group'>
                <input
                  type='checkbox'
                  checked={consent}
                  onChange={(e) => { setConsent(e.target.checked); setContactError(''); }}
                  className='mt-0.5 w-4 h-4 accent-brand cursor-pointer shrink-0'
                />
                <span className='text-xs text-slate-500 leading-relaxed'>
                  I consent to Citify Contractors collecting and using my details to respond to this enquiry, in accordance with their{' '}
                  <Link to='/privacy-policy' className='text-brand underline underline-offset-2 hover:text-brand-strong'>Privacy Policy</Link>.
                </span>
              </label>

              {contactError && <p className='text-sm text-red-600 mt-3'>{contactError}</p>}

              <div className='mt-4'>
                <button disabled={!consent} className='bg-brand text-white py-3 px-10 rounded-xl font-medium hover:bg-brand-strong transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                  {result ? result : 'Send Message'}
                </button>
              </div>
            </form>


          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Contact