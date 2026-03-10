import { ArrowRight, Rocket } from 'lucide-react';

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-royal py-20 lg:py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-8">
          <Rocket size={26} className="text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Run Your Next Hackathon the{' '}
          <span className="text-blue-200">Smart Way</span>
        </h2>

        <p className="text-lg text-blue-100/80 max-w-2xl mx-auto mb-10">
          Join thousands of organizers who trust HackFlow to deliver seamless hackathon experiences.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-royal bg-white rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Create Hackathon
            <ArrowRight size={16} />
          </a>
          <a
            href="#hackathons"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/60 transition-all duration-200"
          >
            Explore Hackathons
          </a>
        </div>
      </div>
    </section>
  );
}
