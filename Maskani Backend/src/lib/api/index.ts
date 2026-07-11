export { default as api } from './axiosConfig';
import { studentAPI } from './student';
import { ownerAPI } from './owner';
import { usersAPI } from './user';

export * from './types';
export * from './auth';
export * from './student';
export * from './owner';
export * from './user';
export * from './booking';
export * from './dorm';
export * from './property';
export * from './review';

// دالة موحدة لتحديث بيانات المستخدم لجميع الأنواع
export const updateUserProfile = async (userData: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
}) => {
  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('No user data found');
  }
  
  const user = JSON.parse(userStr);
  const role = user.role;
  
  // Get the appropriate ID based on role
  let userId: string;
  
  switch (role) {
    case 'Student':
      userId = localStorage.getItem('studentId') || user.id || user.studentId || '';
      return studentAPI.updateStudent({ 
        ...userData, 
        personID: parseInt(userId, 10), 
        studentID: parseInt(userId, 10),
        password: userData.password || '' 
      });
    case 'Owner':
      userId = localStorage.getItem('ownerId') || user.id || user.ownerId || '';
      return ownerAPI.updateOwner(userId, userData);
    case 'Admin':
    case 'User':
      userId = localStorage.getItem('userId') || user.id || user.userId || '';
      return usersAPI.updateUser(parseInt(userId, 10), { 
        ...userData, 
        userID: parseInt(userId, 10),
        password: userData.password || '' 
      });
    default:
      throw new Error('Invalid user role');
  }
}; 