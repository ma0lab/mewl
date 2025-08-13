import React from 'react'

const HeroSection = () => {
  return (
    <section className="relative py-12 z-10 hero-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 hero-container">
        <div className="flex justify-center rounded-lg p-4 hero-container">
          <img 
            src="/assets/images/hero.png" 
            alt="Mewl Studio - 七瀬もも" 
            className="max-w-full h-auto max-h-96 object-contain rounded hero-image"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection