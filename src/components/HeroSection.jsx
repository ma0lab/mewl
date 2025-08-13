import React from 'react'

const HeroSection = () => {
  return (
    <section className="relative py-12 z-10 hero-section">
      <div className="mx-auto px-2 sm:px-6 lg:px-8 hero-container">
        <div className="flex justify-center rounded-lg hero-container">
          <img 
            src="/assets/images/hero.png" 
            alt="Mewl Studio - 七瀬もも" 
            className="w-full max-w-none h-auto object-contain rounded hero-image"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection