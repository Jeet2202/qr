import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Building2,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  Mail,
  Phone,
  User,
  GraduationCap,
  Hash,
} from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';
import TeamSection from '../../components/TeamSection';
import SubmissionSection from '../../components/SubmissionSection';
import ResultSection from '../../components/ResultSection';
import OfflineEventSection from '../../components/OfflineEventSection';
import FinalSubmissionSection from '../../components/FinalSubmissionSection';
import HelpSection from '../../components/HelpSection';

/* ─────────────────────── MOCK STUDENT PROFILE ───────────────────── */
const MOCK_STUDENT = {
  name: 'Arjun Mehta',
  email: 'arjun.mehta@college.edu',
  phone: '+91 99887 76655',
  college: 'VJTI Mumbai',
  branch: 'Computer Engineering',
  year: '3rd Year',
};

/* ───────────────────────── MOCK HACKATHON DB ─────────────────────── */
const HACKATHON_DB = {
  h1: {
    hackathonId: 'h1',
    title: 'CodeStorm 2026',
    organizerName: 'IIT Bombay',
    prizePool: '₹5,00,000',
    registrationDeadline: 'March 25, 2026',
    bannerImage: null,
    logoBg: 'bg-[#334155]',
    description:
      'CodeStorm 2026 is the flagship hackathon organized by IIT Bombay, bringing together the brightest minds to tackle real-world challenges across AI/ML, FinTech, HealthTech, and Sustainability.',
    problemStatements: [
      'Build an AI-powered solution for early disease detection in rural areas.',
      'Design a fintech tool that improves financial literacy for students.',
      'Create a sustainability tracker for college campuses.',
    ],
    rules: [
      'Teams of 2–4 members only.',
      'All work must be original and created during the hackathon.',
      'PPT submission is mandatory before the deadline.',
      'Plagiarism or pre-built solutions will lead to disqualification.',
      "Organizers' decision on results is final.",
    ],
    timeline: [
      { date: 'March 15, 2026', event: 'Registration Opens' },
      { date: 'March 25, 2026', event: 'Registration Deadline' },
      { date: 'March 26, 2026', event: 'PPT Submission Deadline' },
      { date: 'March 27, 2026', event: 'Shortlist Announcement' },
      { date: 'March 28, 2026', event: 'Offline Event Day' },
    ],
    organizerContact: 'hackathon@iitb.ac.in',
    whatsappLink: 'https://chat.whatsapp.com/example',
    team: null,
    submission: { pptUrl: '', resumeUrl: '', submissionDate: null },
    result: {
      selectionStatus: 'selected',  // 'selected' | 'not_selected'
      rank: 4,
    },
    offlineEvent: {
      workspaceNumber: 'WS-14B',
      eventDate: 'March 28, 2026',
      venue: 'IIT Bombay, Powai, Mumbai',
      reportingTime: '9:00 AM',
      lunchStatus: 'collected',
      dinnerStatus: 'pending',
      eventTimeline: [
        { time: '9:00 AM',  activity: 'Reporting & Check-in'       },
        { time: '10:00 AM', activity: 'Problem Statement Reveal'   },
        { time: '1:00 PM',  activity: 'Lunch Break'                },
        { time: '5:00 PM',  activity: 'PPT Freeze'                 },
        { time: '6:00 PM',  activity: 'Presentations Begin'        },
        { time: '8:00 PM',  activity: 'Results & Dinner'           },
      ],
    },
    finalSubmission: { githubLink: '', deployLink: '', finalPptUrl: '' },
    queries: [],
  },
  h2: {
    hackathonId: 'h2',
    title: 'InnoVerse Hack',
    organizerName: 'BITS Pilani',
    prizePool: '₹3,00,000',
    registrationDeadline: 'April 10, 2026',
    bannerImage: null,
    logoBg: 'bg-[#10b981]',
    description:
      'InnoVerse Hack is an interdisciplinary hackathon encouraging innovation at the intersection of technology and business.',
    problemStatements: ['Design a smart city solution for traffic management.'],
    rules: ['Teams of 2–5 members.', 'Submit PPT before the deadline.'],
    timeline: [
      { date: 'April 1, 2026', event: 'Registration Opens' },
      { date: 'April 10, 2026', event: 'Registration Deadline' },
    ],
    organizerContact: 'hack@bits.ac.in',
    whatsappLink: '#',
    team: null,
    submission: { pptUrl: '', resumeUrl: '', submissionDate: null },
    result: null,
    offlineEvent: null,
    finalSubmission: null,
    queries: [],
  },
};

/* ─────────────────────── TAB DEFINITIONS ────────────────────────── */
const TABS = [
  { id: 'overview',     label: 'Overview'     },
  { id: 'timeline',     label: 'Timeline'     },
  { id: 'application',  label: 'Application'  },
  { id: 'results',      label: 'Results'      },
];

/* ─────────────────────── CARD WRAPPER ───────────────────────────── */
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] ${className}`}>
      {children}
    </div>
  );
}

function CardSection({ title, children }) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">{title}</h3>
      {children}
    </div>
  );
}

/* ─────────────────────── TAB: OVERVIEW ─────────────────────────── */
function OverviewTab({ hack }) {
  return (
    <div className="space-y-5">
      {/* Hero banner */}
      <Card>
        <div className={`w-full h-40 rounded-t-2xl ${hack.logoBg} flex items-center justify-center overflow-hidden`}>
          {hack.bannerImage
            ? <img src={hack.bannerImage} alt={hack.title} className="w-full h-full object-cover" />
            : <span className="text-white/10 text-[100px] font-black select-none">{hack.title[0]}</span>
          }
        </div>
        <div className="px-7 py-6">
          {/* Quick meta strip */}
          <div className="flex flex-wrap gap-5 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={15} className="text-gray-400" />
              <span className="font-semibold">{hack.organizerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Trophy size={15} className="text-amber-400" />
              <span className="font-semibold">{hack.prizePool}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={15} className="text-red-400" />
              <span className="font-semibold">Deadline: {hack.registrationDeadline}</span>
            </div>
          </div>

          {/* Description */}
          <CardSection title="About">
            <p className="text-sm text-gray-600 leading-relaxed">{hack.description}</p>
          </CardSection>

          {/* Problem Statements */}
          <CardSection title="Problem Statements">
            <ol className="space-y-3">
              {hack.problemStatements.map((ps, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 rounded-lg bg-royal/5 text-royal font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {ps}
                </li>
              ))}
            </ol>
          </CardSection>

          {/* Rules */}
          <CardSection title="Rules & Regulations">
            <ul className="space-y-2.5">
              {hack.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  {rule}
                </li>
              ))}
            </ul>
          </CardSection>

          {/* Contact */}
          <CardSection title="Organizer Contact">
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${hack.organizerContact}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-semibold text-dark hover:border-royal hover:text-royal transition-all"
              >
                <Mail size={14} /> {hack.organizerContact}
              </a>
              <a
                href={hack.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-all shadow-sm"
              >
                <MessageSquare size={14} /> Join WhatsApp Group
                <ExternalLink size={12} />
              </a>
            </div>
          </CardSection>
        </div>
      </Card>

      {/* Help / Query */}
      <HelpSection queries={hack.queries ?? []} organizerContact={hack.organizerContact} />
    </div>
  );
}

/* ─────────────────────── TAB: TIMELINE ─────────────────────────── */
function TimelineTab({ hack }) {
  return (
    <Card className="px-7 py-8">
      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-8">Schedule</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gray-100" />

        <div className="space-y-0">
          {hack.timeline.map((t, i) => {
            const isPast = i < 2;   // mock: first 2 are "past"
            const isCurrent = i === 2;
            return (
              <div key={i} className="flex gap-5 pb-8 last:pb-0 relative">
                {/* Dot */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                  isCurrent
                    ? 'bg-royal border-royal shadow-md shadow-royal/20'
                    : isPast
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'bg-white border-gray-200'
                }`}>
                  {isPast
                    ? <span className="text-white text-xs font-bold">✓</span>
                    : isCurrent
                    ? <span className="text-white text-xs font-bold">{i + 1}</span>
                    : <span className="text-gray-300 text-xs font-bold">{i + 1}</span>
                  }
                </div>

                {/* Content */}
                <div className="pt-1.5">
                  <p className={`text-base font-bold ${isCurrent ? 'text-royal' : isPast ? 'text-gray-400 line-through' : 'text-dark'}`}>
                    {t.event}
                  </p>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5 flex items-center gap-1">
                    <Calendar size={11} /> {t.date}
                  </p>
                  {isCurrent && (
                    <span className="mt-2 inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-royal/10 text-royal uppercase tracking-wide">
                      Current Stage
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────── TAB: APPLICATION ──────────────────────── */
function ApplicationTab({ hack }) {
  return (
    <div className="space-y-5">

      {/* Your Profile card */}
      <Card className="px-7 py-6">
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-5">Your Profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: User,           label: 'Full Name',  value: MOCK_STUDENT.name   },
            { icon: Mail,           label: 'Email',      value: MOCK_STUDENT.email  },
            { icon: Phone,          label: 'Phone',      value: MOCK_STUDENT.phone  },
            { icon: GraduationCap,  label: 'College',    value: MOCK_STUDENT.college},
            { icon: Hash,           label: 'Branch',     value: MOCK_STUDENT.branch },
            { icon: Calendar,       label: 'Year',       value: MOCK_STUDENT.year   },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-semibold text-dark">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          This info will be shared with the organizer. Update it in{' '}
          <a href="/student/profile" className="text-royal font-semibold hover:underline">your profile</a>.
        </p>
      </Card>

      {/* Team */}
      <TeamSection team={hack.team} />

      {/* Initial Submission */}
      <SubmissionSection submission={hack.submission} />

    </div>
  );
}

/* ─────────────────────── TAB: RESULTS ──────────────────────────── */
function ResultsTab({ hack }) {
  const hasResult = !!hack.result;
  const isSelected = hack.result?.selectionStatus === 'selected';

  if (!hasResult) {
    return (
      <Card className="px-7 py-14 text-center">
        <p className="text-4xl mb-4">⏳</p>
        <p className="text-base font-extrabold text-dark mb-2">Results Not Announced Yet</p>
        <p className="text-sm text-gray-500">Check back after the shortlist announcement date on the Timeline tab.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Shortlist status */}
      <ResultSection result={hack.result} />

      {/* Offline event — only if selected */}
      {isSelected && hack.offlineEvent && (
        <OfflineEventSection event={hack.offlineEvent} />
      )}

      {/* Final submission — only if selected */}
      {isSelected && (
        <FinalSubmissionSection finalSubmission={hack.finalSubmission} />
      )}
    </div>
  );
}

/* ─────────────────────── MAIN PAGE ─────────────────────────────── */
export default function HackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const hack = HACKATHON_DB[id];

  if (!hack) {
    return (
      <div className="min-h-screen bg-light-gray">
        <StudentNavbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <h2 className="text-2xl font-extrabold text-dark mb-3">Hackathon Not Found</h2>
          <p className="text-gray-500 mb-6 text-sm">This hackathon doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-royal text-white rounded-xl text-sm font-semibold hover:bg-royal-light transition-all cursor-pointer"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <StudentNavbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-royal transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight">{hack.title}</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            <Building2 size={13} /> {hack.organizerName}
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-7 bg-white border border-gray-100 shadow-sm rounded-2xl p-1.5 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-royal text-white shadow-md'
                  : 'text-gray-500 hover:text-dark hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview'    && <OverviewTab    hack={hack} />}
        {activeTab === 'timeline'    && <TimelineTab    hack={hack} />}
        {activeTab === 'application' && <ApplicationTab hack={hack} />}
        {activeTab === 'results'     && <ResultsTab     hack={hack} />}

      </div>
    </div>
  );
}
