import { GraduationCap, Building2, CheckCircle2 } from 'lucide-react';

const userTypes = [
  {
    icon: GraduationCap,
    title: 'For Students',
    description: 'Find hackathons, build teams, and grow your portfolio.',
    features: [
      'Discover hackathons',
      'Join teams',
      'Submit projects',
      'Receive certificates',
    ],
    accent: 'border-royal',
    iconBg: 'bg-royal/5 text-royal',
    buttonClass: 'bg-royal text-white hover:bg-royal-light',
    buttonText: 'Get Started as Student',
  },
  {
    icon: Building2,
    title: 'For Organizers',
    description: 'Create, manage, and scale your hackathons effortlessly.',
    features: [
      'Create hackathons',
      'Manage participants',
      'Evaluate submissions',
      'Generate certificates',
    ],
    accent: 'border-dark',
    iconBg: 'bg-dark/5 text-dark',
    buttonClass: 'bg-dark text-white hover:bg-gray-800',
    buttonText: 'Get Started as Organizer',
  },
];

export default function UserTypes() {
  return (
    <section id="user-types" className="bg-light-gray py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-royal uppercase tracking-widest mb-3">
            Who It's For
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Built for <span className="text-royal">Everyone</span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Whether you're a student looking for opportunities or an organizer managing events — HackFlow has you covered.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {userTypes.map((type) => (
            <div
              key={type.title}
              className={`bg-white rounded-2xl p-8 border-t-4 ${type.accent} shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(30,58,138,0.1)] hover:-translate-y-1 transition-all duration-300`}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${type.iconBg} mb-5`}
              >
                <type.icon size={22} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">{type.title}</h3>
              <p className="text-sm text-gray-600 mb-6">{type.description}</p>
              <ul className="space-y-3 mb-8">
                {type.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl text-sm font-semibold ${type.buttonClass} transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer`}
              >
                {type.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
