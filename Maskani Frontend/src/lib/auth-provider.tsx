import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthContext, User } from './auth-context';
import { authAPI } from './api';
import { storageService } from './services/storage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // استخدام storageService للتحقق من وجود جلسة نشطة
        if (storageService.hasActiveSession()) {
          const userData = storageService.getUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // لا نقوم بمسح البيانات هنا لتجنب فقدان حالة المصادقة
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData: User) => {
    try {
      setIsAuthenticated(true);
      setUser(userData);
      
      // تحديد المعرف المناسب بناءً على نوع المستخدم
      let userId: number | undefined;
      if (userData.role.toLowerCase() === 'student') {
        userId = userData.studentID;
      } else if (userData.role.toLowerCase() === 'owner') {
        userId = userData.ownerID;
      } else {
        userId = userData.userID;
      }

      // تأكد من حفظ dormID إذا كان موجوداً
      const userDataToStore = {
        ...userData,
        dormID: userData.dormID || null
      };

      // استخدام storageService لحفظ بيانات المصادقة
      storageService.setAuthData({
        token: userData.token,
        user: userDataToStore,
        role: userData.role,
        id: userId
      });

      // حفظ dormID بشكل منفصل إذا كان موجوداً
      if (userData.dormID) {
        localStorage.setItem('dormID', userData.dormID);
      }

    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      // استخدام storageService لمسح بيانات المصادقة
      storageService.clearAuthData();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maskani-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 