import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  QrCode,
  UserCheck,
  Users,
  ClipboardList,
  FileText,
  ListChecks,
  CalendarCheck,
  Award,
  GraduationCap,
  Building2,
  CheckCircle2,
  Trophy,
  Calendar,
  Rocket,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroImg from '../assets/hero-illustration.png';

/* ───────────────────────── DATA ───────────────────────── */

const features = [
  {
    icon: ShieldCheck,
    title: 'Student Verification',
    description: 'Aadhaar and college ID verification ensures only real students participate.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Smart Hackathon Management',
    description: 'Manage teams, submissions, evaluations and results from one dashboard.',
    color: 'bg-blue-50 text-royal',
  },
  {
    icon: QrCode,
    title: 'QR Based Event Operations',
    description: 'QR codes for gate entry, workspace allocation and food distribution.',
    color: 'bg-violet-50 text-violet-600',
  },
];

const steps = [
  { icon: UserCheck, label: 'Student Verification' },
  { icon: Users, label: 'Team Formation' },
  { icon: ClipboardList, label: 'Hackathon Registration' },
  { icon: FileText, label: 'PPT Submission' },
  { icon: ListChecks, label: 'Shortlisting' },
  { icon: CalendarCheck, label: 'Offline Event Management' },
  { icon: Award, label: 'Certificate Generation' },
];

const userTypes = [
  {
    icon: GraduationCap,
    title: 'For Students',
    description: 'Find hackathons, build teams, and grow your portfolio.',
    features: ['Discover hackathons', 'Join teams', 'Submit projects', 'Receive certificates'],
    accent: 'border-royal',
    iconBg: 'bg-royal/5 text-royal',
    buttonClass: 'bg-royal text-white hover:bg-royal-light',
    buttonText: 'Get Started as Student',
  },
  {
    icon: Building2,
    title: 'For Organizers',
    description: 'Create, manage, and scale your hackathons effortlessly.',
    features: ['Create hackathons', 'Manage participants', 'Evaluate submissions', 'Generate certificates'],
    accent: 'border-dark',
    iconBg: 'bg-dark/5 text-dark',
    buttonClass: 'bg-dark text-white hover:bg-gray-800',
    buttonText: 'Get Started as Organizer',
  },
];

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

/* ───────────────────────── HERO ───────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-royal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-royal-light/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
              <a href="#hackathons" className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-royal rounded-xl hover:bg-royal-light transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Explore Hackathons
                <ArrowRight size={16} />
              </a>
              <a href="#cta" className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-royal border-2 border-royal/20 rounded-xl hover:border-royal hover:bg-royal/5 transition-all duration-200">
                Organize a Hackathon
              </a>
            </div>

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

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-royal/10 to-royal-light/10 rounded-3xl blur-2xl scale-95" />
              <img src={heroImg} alt="Students collaborating at a hackathon" className="relative w-full h-auto rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── FEATURES ───────────────────── */

function Features() {
  return (
    <section id="features" className="bg-light-gray py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-royal uppercase tracking-widest mb-3">Why HackFlow?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Everything You Need in <span className="text-royal">One Platform</span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Streamline every aspect of hackathon management with powerful tools built for organizers and participants alike.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(30,58,138,0.1)] hover:-translate-y-1 transition-all duration-300 group">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-dark mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── HOW IT WORKS ───────────────────── */

function HowItWorks() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-royal uppercase tracking-widest mb-3">Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            How It <span className="text-royal">Works</span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">A streamlined 7-step process from verification to certification.</p>
        </div>

        <div className="flex flex-nowrap justify-center items-start gap-2 pt-4">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-start">
              <div className="flex flex-col items-center w-28 sm:w-32 group">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-royal/5 border-2 border-royal/20 flex items-center justify-center group-hover:bg-royal group-hover:border-royal transition-all duration-300">
                    <step.icon size={22} className="text-royal group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-royal text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>
                <p className="mt-4 text-xs font-semibold text-dark text-center leading-snug">{step.label}</p>
              </div>
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

/* ───────────────────── USER TYPES ─────────────────────── */

function UserTypes() {
  return (
    <section id="user-types" className="bg-light-gray py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-royal uppercase tracking-widest mb-3">Who It's For</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Built for <span className="text-royal">Everyone</span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Whether you're a student looking for opportunities or an organizer managing events — HackFlow has you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {userTypes.map((type) => (
            <div key={type.title} className={`bg-white rounded-2xl p-8 border-t-4 ${type.accent} shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(30,58,138,0.1)] hover:-translate-y-1 transition-all duration-300`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${type.iconBg} mb-5`}>
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
              <button className={`w-full py-3 rounded-xl text-sm font-semibold ${type.buttonClass} transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer`}>
                {type.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────── FEATURED HACKATHONS ────────────────── */

function FeaturedHackathons() {
  return (
    <section id="hackathons" className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold text-royal uppercase tracking-widest mb-3">Explore</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
            Featured <span className="text-royal">Hackathons</span>
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">Discover trending hackathons and register before the deadline.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.map((hack) => (
            <div key={hack.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(30,58,138,0.1)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="h-1.5 bg-gradient-to-r from-royal to-royal-light" />
              <div className="p-7">
                <span className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full ${hack.tagColor} mb-4`}>{hack.tag}</span>
                <h3 className="text-lg font-bold text-dark mb-1">{hack.name}</h3>
                <p className="text-sm text-gray-500 mb-5">by {hack.organizer}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Trophy size={16} className="text-amber-500" />
                    <span>Prize Pool: <span className="font-semibold text-dark">{hack.prize}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Calendar size={16} className="text-royal" />
                    <span>Deadline: <span className="font-semibold text-dark">{hack.deadline}</span></span>
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

/* ───────────────────────── CTA ─────────────────────────── */

function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-royal py-20 lg:py-24">
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-8">
          <Rocket size={26} className="text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Run Your Next Hackathon the <span className="text-blue-200">Smart Way</span>
        </h2>

        <p className="text-lg text-blue-100/80 max-w-2xl mx-auto mb-10">
          Join thousands of organizers who trust HackFlow to deliver seamless hackathon experiences.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-royal bg-white rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Create Hackathon
            <ArrowRight size={16} />
          </a>
          <a href="#hackathons" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/60 transition-all duration-200">
            Explore Hackathons
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── LANDING PAGE ───────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <UserTypes />
      <FeaturedHackathons />
      <CTA />
      <Footer />
    </div>
  );
}
