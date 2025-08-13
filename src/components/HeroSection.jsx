import React from 'react'

const HeroSection = () => {
  return (
    <section className="relative py-12 z-10 hero-section">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 hero-container">
        <div className="flex justify-center rounded-lg p-1 md:p-4 hero-container">
          <img 
            src="/assets/images/hero.png" 
            alt="Mewl Studio - 七瀬もも" 
            className="w-full h-auto max-h-screen sm:max-h-[28rem] md:max-h-[32rem] lg:max-h-[36rem] object-contain rounded hero-image"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection