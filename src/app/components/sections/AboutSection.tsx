// components/sections/AboutSection.tsx

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <div className="bg-amber-200 border-4 border-amber-300 rounded-2xl w-full h-96 flex items-center justify-center">
              <div className="bg-amber-300 w-4/5 h-4/5 rounded-xl flex items-center justify-center">
                <div className="bg-amber-100 w-4/5 h-4/5 rounded-lg flex items-center justify-center">
                  <span className="text-amber-800 font-bold text-2xl">Our Workshop</span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6">Crafted with Passion, Built to Last</h2>
            <p className="text-amber-700 mb-6">
              For over two decades, Melcraft has been synonymous with exceptional craftsmanship and timeless design.
              Our master artisans combine traditional techniques with contemporary aesthetics to create pieces that
              become heirlooms for generations.
            </p>
            <p className="text-amber-700 mb-8">
              We source only the finest sustainable materials and employ meticulous attention to detail in every
              project we undertake. From concept to completion, we partner with you to bring your vision to life.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { value: '25+', label: 'Years Experience' },
                { value: '500+', label: 'Projects Completed' },
                { value: '100%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">{stat.value}</span>
                  </div>
                  <span className="text-amber-800">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}