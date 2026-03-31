import React from 'react'
import About from '../components/About/About'
import WhyChooseUs from '../components/About/WhyChooseUs'
import Aboutsides from '../components/About/Aboutsides'
import SitePageLayout from '../components/SitePageLayout'

const AboutPage = () => {
  return (
    <SitePageLayout>
      <div>
        <About />
        <Aboutsides />
        <WhyChooseUs />
      </div>
    </SitePageLayout>
  )
}

export default AboutPage
