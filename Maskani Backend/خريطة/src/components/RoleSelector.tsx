import React from 'react';
import { User, Building2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  selectedRole: 'tenant' | 'owner' | 'admin';
  onRoleChange: (role: 'tenant' | 'owner' | 'admin') => void;
}

const roleConfig = {
  tenant: {
    icon: User,
    label: 'Student',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    textColor: 'text-blue-500',
  },
  owner: {
    icon: Building2,
    label: 'Property Owner',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    textColor: 'text-green-500',
  },
  admin: {
    icon: ShieldCheck,
    label: 'Admin',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    textColor: 'text-red-500',
  },
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {(Object.keys(roleConfig) as Array<keyof typeof roleConfig>).map((role) => {
        const { icon: Icon, label, color, hoverColor, textColor } = roleConfig[role];
        const isSelected = selectedRole === role;

        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange(role)}
            className={cn(
              'relative flex flex-col items-center p-4 rounded-lg transition-all duration-200 transform',
              'border-2',
              isSelected
                ? `${color} text-white border-transparent`
                : `bg-white ${textColor} border-gray-200 ${hoverColor.replace('bg', 'hover:border')}`,
              'group hover:scale-105'
            )}
          >
            <Icon className={cn(
              'h-6 w-6 mb-2 transition-transform duration-200',
              'group-hover:scale-110'
            )} />
            <span className="text-sm font-medium">{label}</span>
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div className={cn('w-2 h-2 rounded-full', color)} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}; 