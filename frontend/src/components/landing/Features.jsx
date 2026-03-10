import { ShieldCheck, LayoutDashboard, QrCode } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Student Verification',
    description:
      'Aadhaar and college ID verification ensures only real students participate.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Smart Hackathon Management',
    description:
      'Manage teams, submissions, evaluations and results from one dashboard.',
    color: 'bg-blue-50 text-royal',
  },
  {
    icon: QrCode,
    title: 'QR Based Event Operations',
    description:
      'QR codes for gate entry, workspace allocation and food distribution.',
    color: 'bg-violet-50 text-violet-600',
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-light-gray py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-royal uppercase tracking-widest mb-3">
            Why HackFlow?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Everything You Need in{' '}
            <span className="text-royal">One Platform</span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Streamline every aspect of hackathon management with powerful tools built for organizers and participants alike.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(30,58,138,0.1)] hover:-translate-y-1 transition-all duration-300 group"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
