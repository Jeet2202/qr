import { ArrowRight, Sparkles } from 'lucide-react';
import heroImg from '../../assets/hero-illustration.png';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle gradient orb */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-royal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-royal-light/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-royal/5 border border-royal/10">
              <Sparkles size={14} className="text-royal" />
              <span className="text-xs font-semibold text-royal tracking-wide uppercase">
                All-in-one Hackathon Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-dark leading-[1.1] tracking-tight">
              Manage Hackathons Seamlessly —{' '}
              <span className="text-royal">From Registration to Certificates</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              A unified platform for student verification, team formation, submissions, QR based entry, meal tracking and automated certificate generation.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#hackathons"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore Hackathons
                <ArrowRight size={16} />
              </a>
              <a
                href="#cta"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-royal border-2 border-royal/20 rounded-xl hover:border-royal hover:bg-royal/5 transition-all duration-200"
              >
                Organize a Hackathon
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-dark">50+</p>
                <p className="text-xs text-gray-500">Hackathons Hosted</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-dark">10K+</p>
                <p className="text-xs text-gray-500">Students Registered</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-dark">100+</p>
                <p className="text-xs text-gray-500">Colleges</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-royal/10 to-royal-light/10 rounded-3xl blur-2xl scale-95" />
              <img
                src={heroImg}
                alt="Students collaborating at a hackathon"
                className="relative w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
