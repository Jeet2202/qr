import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Building2,
  Trophy,
  Zap,
  Bell,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
} from 'lucide-react';

/* ═══════════════════════ MOCK DATA ═══════════════════════ */

const stats = [
  { title: 'Total Students', value: '1,250', desc: 'Registered on platform', icon: Users, gradient: 'from-blue-600 to-indigo-600' },
  { title: 'Total Organizers', value: '80', desc: 'Verified organizations', icon: Building2, gradient: 'from-violet-600 to-purple-600' },
  { title: 'Total Hackathons', value: '45', desc: 'Created to date', icon: Trophy, gradient: 'from-amber-500 to-orange-500' },
  { title: 'Active Hackathons', value: '12', desc: 'Currently running', icon: Zap, gradient: 'from-emerald-500 to-teal-500' },
];

const initialOrgRequests = [
  { organizerId: 'ORG101', clubName: 'AI Innovation Club', proofDocument: 'club-proof.pdf', status: 'Pending' },
  { organizerId: 'ORG102', clubName: 'Blockchain Society', proofDocument: 'blockchain-soc.pdf', status: 'Pending' },
  { organizerId: 'ORG103', clubName: 'Robotics Lab IITD', proofDocument: 'robotics-lab.pdf', status: 'Pending' },
  { organizerId: 'ORG104', clubName: 'Web Dev Community', proofDocument: 'webdev-proof.pdf', status: 'Pending' },
];

const initialHackRequests = [
  { hackathonId: 'HACK201', organizerId: 'ORG102', title: 'AI Innovation Hackathon', status: 'Pending' },
  { hackathonId: 'HACK202', organizerId: 'ORG101', title: 'Blockchain Build Sprint', status: 'Pending' },
  { hackathonId: 'HACK203', organizerId: 'ORG103', title: 'RoboCode Challenge 2026', status: 'Pending' },
  { hackathonId: 'HACK204', organizerId: 'ORG104', title: 'Full Stack Fiesta', status: 'Pending' },
];

/* ═══════════════════════ ANIMATIONS ═══════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const rowVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

/* ═══════════════════ STATUS BADGE ═════════════════════════ */

function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={status}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${styles[status] || styles.Pending}`}
      >
        {status === 'Pending' && <Clock size={12} />}
        {status === 'Approved' && <CheckCircle size={12} />}
        {status === 'Rejected' && <XCircle size={12} />}
        {status}
      </motion.span>
    </AnimatePresence>
  );
}

/* ═══════════════════ STAT CARD ════════════════════════════ */

function StatCard({ stat, index }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      {/* Gradient top border */}
      <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
            <stat.icon size={20} className="text-white" />
          </div>
          <ChevronDown size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
        </div>
        <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
        <p className="text-3xl font-extrabold text-dark tracking-tight">{stat.value}</p>
        <p className="text-xs text-gray-400 mt-2">{stat.desc}</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════ SECTION WRAPPER ══════════════════════ */

function Section({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-dark">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  );
}

/* ═══════════════════ ADMIN DASHBOARD ══════════════════════ */

export default function AdminDashboard() {
  const [orgRequests, setOrgRequests] = useState(initialOrgRequests);
  const [hackRequests, setHackRequests] = useState(initialHackRequests);

  const updateOrgStatus = (id, status) => {
    setOrgRequests((prev) => prev.map((r) => (r.organizerId === id ? { ...r, status } : r)));
  };

  const updateHackStatus = (id, status) => {
    setHackRequests((prev) => prev.map((r) => (r.hackathonId === id ? { ...r, status } : r)));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {/* ────── NAVBAR ────── */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-royal tracking-tight">
                Hack<span className="text-dark">Flow</span>
              </span>
              <span className="text-[10px] font-bold text-white bg-royal px-2 py-0.5 rounded-md uppercase tracking-wider">
                Admin
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-royal to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-dark leading-tight">Admin</p>
                  <p className="text-[11px] text-gray-400">Super Admin</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* ────── MAIN CONTENT ────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* ── SECTION 1: Stats ── */}
        <Section title="Platform Statistics" subtitle="Overview of key platform metrics">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.title} stat={stat} index={i} />
            ))}
          </motion.div>
        </Section>

        {/* ── SECTION 2: Organizer Requests ── */}
        <Section title="Pending Organizer Verification Requests" subtitle="Review and approve organization profiles" delay={0.2}>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Organizer ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Club Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Proof Document</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                  {orgRequests.map((req) => (
                    <motion.tr key={req.organizerId} variants={rowVariant} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-dark">{req.organizerId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{req.clubName}</td>
                      <td className="px-6 py-4">
                        <a href="#" className="inline-flex items-center gap-1.5 text-sm text-royal hover:text-royal-light font-medium transition-colors">
                          <FileText size={14} />
                          {req.proofDocument}
                        </a>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                      <td className="px-6 py-4">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center gap-2">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => updateOrgStatus(req.organizerId, 'Approved')}
                              className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                              Approve
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => updateOrgStatus(req.organizerId, 'Rejected')}
                              className="px-4 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
                              Reject
                            </motion.button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Action taken</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* ── SECTION 3: Hackathon Requests ── */}
        <Section title="Pending Hackathon Approval Requests" subtitle="Approve or reject new hackathon submissions" delay={0.4}>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hackathon ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Organizer ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                  {hackRequests.map((req) => (
                    <motion.tr key={req.hackathonId} variants={rowVariant} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-dark">{req.hackathonId}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{req.organizerId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{req.title}</td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                      <td className="px-6 py-4">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center gap-2">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => updateHackStatus(req.hackathonId, 'Approved')}
                              className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                              Approve
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => updateHackStatus(req.hackathonId, 'Rejected')}
                              className="px-4 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer">
                              Reject
                            </motion.button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Action taken</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </div>
        </Section>

      </main>
    </div>
  );
}
