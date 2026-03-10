import { Trophy, Calendar, ArrowRight } from 'lucide-react';

const hackathons = [
  {
    name: 'CodeStorm 2026',
    organizer: 'IIT Bombay',
    prize: '₹5,00,000',
    deadline: 'March 25, 2026',
    tag: 'Open',
    tagColor: 'bg-emerald-50 text-emerald-700',
  },
  {
    name: 'InnoVerse Hack',
    organizer: 'BITS Pilani',
    prize: '₹3,00,000',
    deadline: 'April 10, 2026',
    tag: 'Closing Soon',
    tagColor: 'bg-amber-50 text-amber-700',
  },
  {
    name: 'HackIndia National',
    organizer: 'NASSCOM',
    prize: '₹10,00,000',
    deadline: 'May 1, 2026',
    tag: 'Featured',
    tagColor: 'bg-royal/5 text-royal',
  },
];

export default function FeaturedHackathons() {
  return (
    <section id="hackathons" className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-royal uppercase tracking-widest mb-3">
            Explore
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Featured <span className="text-royal">Hackathons</span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Discover trending hackathons and register before the deadline.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.map((hack) => (
            <div
              key={hack.name}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(30,58,138,0.1)] hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-royal to-royal-light" />

              <div className="p-7">
                {/* Tag */}
                <span
                  className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full ${hack.tagColor} mb-4`}
                >
                  {hack.tag}
                </span>

                <h3 className="text-lg font-bold text-dark mb-1">
                  {hack.name}
                </h3>
                <p className="text-sm text-gray-500 mb-5">by {hack.organizer}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Trophy size={16} className="text-amber-500" />
                    <span>
                      Prize Pool:{' '}
                      <span className="font-semibold text-dark">{hack.prize}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Calendar size={16} className="text-royal" />
                    <span>
                      Deadline:{' '}
                      <span className="font-semibold text-dark">{hack.deadline}</span>
                    </span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-royal border-2 border-royal/20 hover:bg-royal hover:text-white hover:border-royal transition-all duration-200 cursor-pointer group-hover:border-royal">
                  Register Now
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
