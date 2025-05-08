import React from 'react'
import Banner from '../Components/Banner'
import About from '../Components/About'
import Service from '../Components/Service'
import StepFundRising from '../Components/StepFundRaising'
import Campaigns from '../Components/Campaigns'

const page = () => {
  return (
    <div>
      <Banner/>
      <About/>
      <Service/>
      <StepFundRising/>
      <Campaigns/>
    </div>
  )
}

export default page
