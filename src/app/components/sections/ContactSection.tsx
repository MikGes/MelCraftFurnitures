// components/sections/ContactSection.tsx
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaTiktok, FaClock, FaLightbulb } from 'react-icons/fa';

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-amber-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Get In Touch</h2>
          <p className="mt-4 text-amber-200 max-w-2xl mx-auto">
            Ready to transform your space? Contact our design team for a personalized consultation.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Column: Contact Info */}
          <div className="md:w-1/2">
            <div className="bg-amber-800 p-8 rounded-xl h-full">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-amber-700 p-3 rounded-lg mr-4 flex-shrink-0">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Our Location</h4>
                    <p className="text-amber-200">
                      123 Design Avenue, Creative District<br />
                      London, UK
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-amber-700 p-3 rounded-lg mr-4 flex-shrink-0">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Phone Number</h4>
                    <p className="text-amber-200">+44 20 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-amber-700 p-3 rounded-lg mr-4 flex-shrink-0">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Email Address</h4>
                    <p className="text-amber-200">hello@melcraft.design</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-amber-700 p-3 rounded-lg mr-4 flex-shrink-0">
                    <FaTiktok className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">TikTok</h4>
                    <p className="text-amber-200">@melcraft.design</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-amber-700">
                <h4 className="font-bold text-white mb-4">Opening Hours</h4>
                <div className="text-amber-200 space-y-1">
                  <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                  <p>Saturday: 10:00 AM – 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Helpful Notes / Tips */}
          <div className="md:w-1/2">
            <div className="bg-amber-800 p-8 rounded-xl h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <FaLightbulb className="mr-2 text-amber-400" />
                Before You Reach Out
              </h3>
              <div className="text-amber-200 space-y-4 flex-grow">
                <p>
                  To help us serve you better, here’s what we recommend including in your first message:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Project scope or goals (e.g., brand refresh, full website)</li>
                  <li>Preferred timeline or launch date</li>
                  <li>Any visual references or inspiration</li>
                  <li>Budget range (optional but helpful)</li>
                </ul>

                <div className="mt-6 p-4 bg-amber-900/50 rounded-lg border border-amber-700">
                  <h5 className="font-bold text-white flex items-center">
                    <FaClock className="mr-2" /> Quick Response Promise
                  </h5>
                  <p className="mt-2 text-sm">
                    We aim to reply within <strong>1 business day</strong>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 text-sm italic text-amber-300 border-t border-amber-700">
                🌟 <strong>Fun Fact:</strong> Over 80% of our clients begin with a 30-minute discovery call—no obligation, just great conversation and clarity.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}