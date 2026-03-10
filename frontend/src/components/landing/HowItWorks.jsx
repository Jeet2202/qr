import {
  UserCheck,
  Users,
  ClipboardList,
  FileText,
  ListChecks,
  CalendarCheck,
  Award,
} from 'lucide-react';

const steps = [
  { icon: UserCheck, label: 'Student Verification' },
  { icon: Users, label: 'Team Formation' },
  { icon: ClipboardList, label: 'Hackathon Registration' },
  { icon: FileText, label: 'PPT Submission' },
  { icon: ListChecks, label: 'Shortlisting' },
  { icon: CalendarCheck, label: 'Offline Event Management' },
  { icon: Award, label: 'Certificate Generation' },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-royal uppercase tracking-widest mb-3">
            Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            How It <span className="text-royal">Works</span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            A streamlined 7-step process from verification to certification.
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-nowrap justify-center items-start gap-2 pt-4">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-start">
              {/* Step */}
              <div className="flex flex-col items-center w-28 sm:w-32 group">
                {/* Icon circle */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-royal/5 border-2 border-royal/20 flex items-center justify-center group-hover:bg-royal group-hover:border-royal transition-all duration-300">
                    <step.icon
                      size={22}
                      className="text-royal group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  {/* Step number */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-royal text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>
                {/* Label */}
                <p className="mt-4 text-xs font-semibold text-dark text-center leading-snug">
                  {step.label}
                </p>
              </div>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="hidden sm:flex items-center mt-7">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-royal/30 to-royal/10" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
