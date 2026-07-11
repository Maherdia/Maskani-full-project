import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/use-auth";
import { userAPI, authAPI, studentAPI, ownerAPI, usersAPI, updateUserProfile } from "@/lib/api";
import { API_URL } from "@/lib/config";
import axios, { AxiosError } from 'axios';
import { StudentData, OwnerData, AdminData } from "@/types";

const UserAccountEdit = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

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

  const updateFormWithUserData = useCallback((userData: StudentData | OwnerData | AdminData) => {
    console.log("Updating form with:", userData);
    setFormData({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

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
          try {
            currentUser = JSON.parse(storedUser);
          } catch (e) {
            console.error("Failed to parse stored user:", e);
          }
        }
      }
      
      if (!currentUser) {
        setApiError("No user data found. Please log in again.");
        setLoading(false);
        return;
      }
      
      let userData;
      const role = currentUser.role;

      switch (role) {
        case 'Student': {
          const studentId = localStorage.getItem('studentId');
          if (studentId) {
            try {
              userData = await studentAPI.getStudentById(studentId);
              setUserId(String(studentId));
            } catch (error) {
              console.error("Failed to fetch student data:", error);
              setApiError("Failed to load student data. Please try again.");
            }
          }
          break;
        }

        case 'Owner': {
          const ownerId = localStorage.getItem('ownerId');
          if (ownerId) {
            try {
              userData = await ownerAPI.getOwnerById(ownerId);
              setUserId(String(ownerId));
            } catch (error) {
              console.error("Failed to fetch owner data:", error);
              setApiError("Failed to load owner data. Please try again.");
            }
          }
          break;
        }

        case 'Admin': {
          const userId = localStorage.getItem('userId');
          if (userId) {
            try {
              userData = await usersAPI.getUserById(userId);
              setUserId(String(userId));
            } catch (error) {
              console.error("Failed to fetch admin data:", error);
              setApiError("Failed to load admin data. Please try again.");
            }
          }
          break;
        }
      }

      if (userData) {
        updateFormWithUserData(userData);
        setUserRole(role);
      } else {
        setApiError("Unable to find user data. Please try logging in again.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setApiError("Failed to load user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user, updateFormWithUserData]);

  useEffect(() => {
    if (user) {
      setUserRole(user.role);
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
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
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = "Please enter your first name";
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Please enter your last name";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    const phoneRegex = /^0\d{9}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
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
        let updateData;
        
        switch (userRole) {
          case 'Student': {
            updateData = {
              studentID: parseInt(userId),
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
              email: formData.email,
              role: 'Student',
              password: formData.newPassword || '123456'
            };
            break;
          }
          case 'Owner': {
            updateData = {
              ownerID: parseInt(userId),
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
              email: formData.email,
              role: 'Owner',
              password: formData.newPassword || '123456'
            };
            break;
          }
          case 'Admin': {
            updateData = {
              userID: parseInt(userId),
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
              email: formData.email,
              role: 'Admin',
              password: formData.newPassword || '123456'
            };
            break;
          }
          default:
            throw new Error('Invalid user role');
        }

        let result;
        
        switch (userRole) {
          case 'Student':
            result = await studentAPI.updateStudent(userId, updateData);
            break;
          case 'Owner':
            result = await ownerAPI.updateOwner(userId, updateData);
            break;
          case 'Admin':
            result = await usersAPI.updateUser(userId, updateData);
            break;
        }
        
        setOriginalData({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        });
        
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        
        setUpdateSuccess(true);
        
        const updatedUserStr = localStorage.getItem('user');
        if (updatedUserStr) {
          const updatedUser = JSON.parse(updatedUserStr);
          updatedUser.firstName = formData.firstName;
          updatedUser.lastName = formData.lastName;
          updatedUser.email = formData.email;
          updatedUser.phone = formData.phone;
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
      } catch (error) {
        console.error("Error updating profile:", error);
        
        if (error instanceof AxiosError) {
          if (error.response) {
            const status = error.response.status;
            if (status === 400) {
              setApiError("Invalid data. Please check all fields.");
            } else if (status === 404) {
              setApiError("User not found. Please refresh the page and try again.");
            } else if (status === 500) {
              setApiError("Server error. Please try again later or contact support.");
            } else {
              setApiError(`Server error (${status}). Please contact support.`);
            }
          } else if (error.request) {
            setApiError("Unable to connect to server. Please check your internet connection.");
          } else {
            setApiError("Error setting up request: " + error.message);
          }
        } else if (error instanceof Error) {
          setApiError(error.message);
        } else {
          setApiError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: originalData.firstName || "",
      lastName: originalData.lastName || "",
      email: originalData.email || "",
      phone: originalData.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
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
                    name="firstName"
                    value={formData.firstName}
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
                    name="lastName"
                    value={formData.lastName}
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
                    name="phone"
                    value={formData.phone}
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
                    name="email"
                    value={formData.email}
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