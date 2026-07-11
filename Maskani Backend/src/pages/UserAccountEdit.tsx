import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/use-auth";
import { authAPI } from "@/lib/api";
import { API_URL } from "@/lib/config";
import axios, { AxiosError } from 'axios';
import { StudentDTO, OwnerDTO, UserDTO } from "@/lib/api/types";
import type { UserRole } from "@/lib/api/auth";
import { UnifiedUpdateDTO } from "@/lib/api/auth";
import { studentAPI } from "@/lib/api/student";
import { ownerAPI } from "@/lib/api/owner";
import { usersAPI } from "@/lib/api/user";

const UserAccountEdit = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<UnifiedUpdateDTO & {
    confirmPassword: string;
    currentPassword: string;
  }>({
    FirstName: "",
    LastName: "",
    Phone: "",
    Email: "",
    Password: "",
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRole>("User");
  const [studentId, setStudentId] = useState<number | null>(null);
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [normalUserId, setNormalUserId] = useState<number | null>(null);

  const [originalData, setOriginalData] = useState<{
    firstName: string, 
    lastName: string, 
    email: string, 
    phone: string
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  const [errors, setErrors] = useState<{[key: string]: string | null}>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const updateFormWithUserData = useCallback((userData: StudentDTO | OwnerDTO | UserDTO) => {
    console.log("تحديث النموذج بالبيانات:", userData);
    setFormData(prev => ({
      ...prev,
      FirstName: userData.firstName || "",
      LastName: userData.lastName || "",
      Email: userData.email || "",
      Phone: userData.phone || "",
      Password: "",
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
    }));

    setOriginalData({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
    });
  }, []);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    try {
      let currentUser = user;
      
      if (!currentUser) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
        }
      }
      
      if (!currentUser) {
        throw new Error("User data not found. Please login again.");
      }

      console.log("Current user data:", currentUser);

      // تحديث النموذج مباشرة بالبيانات المخزنة محلياً
      setFormData(prev => ({
        ...prev,
        FirstName: currentUser.firstName || "",
        LastName: currentUser.lastName || "",
        Email: currentUser.email || "",
        Phone: currentUser.phone || "",
        Password: "",
        newPassword: "",
        confirmPassword: "",
        currentPassword: "",
      }));

      setOriginalData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
      });

      let role: UserRole | null = null;
      let currentUserId: string | number | null = null;

      if (currentUser.studentID) {
        role = 'Student';
        currentUserId = currentUser.studentID;
        setStudentId(parseInt(currentUserId.toString()));
        setUserRole('Student');
        setUserId(currentUserId.toString());
      } else if (currentUser.ownerID) {
        role = 'Owner';
        currentUserId = currentUser.ownerID;
        setOwnerId(parseInt(currentUserId.toString()));
        setUserRole('Owner');
        setUserId(currentUserId.toString());
      } else if (currentUser.userID || currentUser.id) {
        const userIdVal = currentUser.userID || currentUser.id;
        role = 'User';
        if (typeof userIdVal === 'string' || typeof userIdVal === 'number') {
          currentUserId = userIdVal;
          setNormalUserId(parseInt(userIdVal.toString()));
          setUserRole('User');
          setUserId(userIdVal.toString());
        } else {
          throw new Error("Invalid user ID type");
        }
      } else {
        throw new Error("User ID not found");
      }

      try {
        let userData;
        
        switch (role) {
          case 'Student':
            if (!currentUserId) throw new Error("Student ID not found");
            userData = await studentAPI.getStudentById(Number(currentUserId));
            break;
          case 'Owner':
            if (!currentUserId) throw new Error("Owner ID not found");
            userData = await ownerAPI.getOwnerById(currentUserId);
            break;
          case 'User':
            if (!currentUserId) throw new Error("User ID not found");
            userData = await usersAPI.getUserById(currentUserId);
            break;
          default:
            throw new Error("Invalid user role");
        }

        if (!userData) {
          throw new Error("No user data found");
        }

        console.log("Successfully fetched user data:", userData);
        updateFormWithUserData(userData);

      } catch (apiError) {
        console.error("Error fetching user data from API:", apiError);
        // في حالة فشل جلب البيانات من API، نستخدم البيانات المخزنة محلياً
        // البيانات محدثة بالفعل من الخطوة السابقة
      }

    } catch (error) {
      console.error("Error in fetchUserData:", error);
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [user, updateFormWithUserData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      const newErrors = {...errors};
      delete newErrors[name];
      setErrors(newErrors);
    }
    
    setUpdateSuccess(false);
    setApiError(null);
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.FirstName?.trim()) {
      newErrors.firstName = "Please enter your first name";
    }
    
    if (!formData.LastName?.trim()) {
      newErrors.lastName = "Please enter your last name";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.Email || !emailRegex.test(formData.Email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    const phoneRegex = /^0\d{9}$/;
    if (!formData.Phone || !phoneRegex.test(formData.Phone)) {
      newErrors.phone = "Please enter a valid phone number (10 digits starting with 0)";
    }
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if ((formData.newPassword || formData.confirmPassword) && !formData.currentPassword) {
      newErrors.currentPassword = "Please enter your current password";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setApiError("User ID not available. Please refresh the page and try again.");
      return;
    }
    
    if (validate()) {
      setIsSubmitting(true);
      setApiError(null);
      setUpdateSuccess(false);
      
      try {
        const updateData: UnifiedUpdateDTO = {
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Phone: formData.Phone,
          Email: formData.Email,
          Password: formData.currentPassword || "",
          newPassword: formData.newPassword || ""
        };

        console.log("Submitting update with data:", updateData);
        
        const currentId = userRole === 'Student' ? studentId : 
                         userRole === 'Owner' ? ownerId : 
                         parseInt(userId);

        if (!currentId) {
          throw new Error(`${userRole} ID not found`);
        }

        const result = await authAPI.updateUserProfile(updateData, currentId);
        
        if (result?.userData) {
          // تحديث البيانات المحلية
          const updatedUserData = {
            ...result.userData,
            firstName: updateData.FirstName,
            lastName: updateData.LastName,
            email: updateData.Email,
            phone: updateData.Phone,
            role: userRole,
            id: userId
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          
          setOriginalData({
            firstName: formData.FirstName,
            lastName: formData.LastName,
            email: formData.Email,
            phone: formData.Phone,
          });
          
          setFormData(prev => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          }));
          
          setUpdateSuccess(true);
          setApiError(null);
        }
        
      } catch (error) {
        console.error("Error updating profile:", error);
        
        if (error instanceof AxiosError) {
          if (error.response) {
            const status = error.response.status;
            switch (status) {
              case 400:
                setApiError("خطأ في البيانات المدخلة. يرجى التحقق من جميع الحقول.");
                break;
              case 401:
                setApiError("كلمة المرور الحالية غير صحيحة.");
                break;
              case 404:
                setApiError("لم يتم العثور على المستخدم. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
                break;
              case 405:
                setApiError("خطأ في الخادم: الطريقة غير مسموح بها. يرجى الاتصال بالدعم الفني.");
                break;
              case 500:
                setApiError("خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.");
                break;
              default:
                setApiError(`خطأ في الخادم (${status}). يرجى الاتصال بالدعم الفني.`);
            }
          } else if (error.request) {
            setApiError("تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.");
          } else {
            setApiError("خطأ في إعداد الطلب: " + error.message);
          }
        } else if (error instanceof Error) {
          setApiError(error.message);
        } else {
          setApiError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      FirstName: originalData.firstName || "",
      LastName: originalData.lastName || "",
      Email: originalData.email || "",
      Phone: originalData.phone || "",
      Password: "",
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
    });
    setErrors({});
    setUpdateSuccess(false);
    setApiError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto pt-8 pb-12">
        <div className="account-edit-container">
          <h2 className="title">Edit Account Information</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading data...</p>
            </div>
          ) : (
            <>
              {apiError && (
                <div className="error-alert">
                  {apiError}
                </div>
              )}
              
              {updateSuccess && (
                <div className="success-alert">
                  Information saved successfully!
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className={errors.firstName ? "input-error" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className={errors.lastName ? "input-error" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={errors.phone ? "input-error" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={errors.email ? "input-error" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className={errors.currentPassword ? "input-error" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className={errors.newPassword ? "input-error" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    className={errors.confirmPassword ? "input-error" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
                
                <div className="button-group">
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`save-button ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="button-spinner"></span>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <style>
        {`
        .account-edit-container {
          max-width: 350px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .title {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
          font-size: 1.5rem;
        }
        
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        label {
          margin-bottom: 5px;
          font-size: 14px;
          color: #555;
        }
        
        input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        input:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
        }
        
        input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
        
        .input-error {
          border-color: #e74c3c;
        }
        
        .error-message {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 5px;
        }
        
        .button-group {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
        
        button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s, transform 0.1s;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        
        button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .save-button {
          background-color: #4ade80;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .save-button:hover:not(:disabled) {
          background-color: #22c55e;
        }
        
        .cancel-button {
          background-color: #f3f4f6;
          color: #4b5563;
        }
        
        .cancel-button:hover:not(:disabled) {
          background-color: #e5e7eb;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }
        
        .loading-spinner, .button-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #4ade80;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin-left: 8px;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          margin-bottom: 15px;
        }
        
        .error-alert {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .success-alert {
          background-color: #dcfce7;
          color: #15803d;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          text-align: center;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 600px) {
          .account-edit-container {
            width: 100%;
            height: auto;
            max-height: 600px;
            overflow-y: auto;
            padding: 15px;
            border-radius: 0;
            box-shadow: none;
          }
          
          .button-group {
            flex-direction: column;
            gap: 10px;
          }
          
          button {
            width: 100%;
          }
        }
        `}
      </style>
    </div>
  );
};

export default UserAccountEdit; 