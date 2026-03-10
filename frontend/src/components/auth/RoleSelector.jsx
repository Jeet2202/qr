import { GraduationCap, Building2 } from 'lucide-react';

const roles = [
  {
    id: 'student',
    label: 'Student',
    description: 'Participate in hackathons, create teams, and submit projects.',
    icon: GraduationCap,
  },
  {
    id: 'organizer',
    label: 'Organizer',
    description: 'Create and manage hackathons, review submissions and manage participants.',
    icon: Building2,
  },
];

export default function RoleSelector({ selectedRole, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            className={`relative flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${
              isSelected
                ? 'border-royal bg-royal/5 shadow-md'
                : 'border-gray-200 bg-white hover:border-royal/40 hover:bg-gray-50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-200 ${
                isSelected
                  ? 'bg-royal text-white'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-royal/10 group-hover:text-royal'
              }`}
            >
              <role.icon size={22} />
            </div>
            <h3
              className={`text-sm font-bold mb-1 ${
                isSelected ? 'text-royal' : 'text-dark'
              }`}
            >
              {role.label}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {role.description}
            </p>
            {/* Radio indicator */}
            <div
              className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected ? 'border-royal' : 'border-gray-300'
              }`}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-royal" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
