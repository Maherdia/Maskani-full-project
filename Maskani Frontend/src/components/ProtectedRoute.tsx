import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('Owner' | 'Student' | 'Admin' | 'User')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // تحويل دور المستخدم إلى حروف صغيرة للمقارنة
  const userRole = user.role.toLowerCase();
  
  // إذا كان المستخدم "user" نعامله كـ "admin"
  const effectiveRole = userRole === 'user' ? 'admin' : userRole;
  
  // تحويل الأدوار المسموح بها إلى حروف صغيرة
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  if (!normalizedAllowedRoles.includes(effectiveRole)) {
    // التوجيه حسب الدور
    if (userRole === 'student') {
      return <Navigate to="/" replace />;
    } else if (userRole === 'owner') {
      return <Navigate to="/owner-dashboard" replace />;
    } else if (userRole === 'admin' || userRole === 'user') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}; 