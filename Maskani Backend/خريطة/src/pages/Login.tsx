import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, User, Lock, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/lib/use-auth";
import { Checkbox } from "@/components/ui/checkbox";
import { authAPI } from "@/lib/api";
import { AxiosError } from 'axios';

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 8 characters" }),
});

// Registration form schema
const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  role: z.enum(['Owner', 'Admin', 'Student'], {
    required_error: "Please select a role",
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      role: "Student",
    },
  });

  // Show redirect message if exists
  useEffect(() => {
    const state = location.state as { message?: string; from?: string };
    if (state?.message) {
      toast({
        title: "Login Required",
        description: state.message
      });
    }
  }, [location, toast]);

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await authAPI.login({
        email: values.email,
        password: values.password,
      });

      // Store token and user data
      login(response);

      // Get the redirect path from state or default to home
      const state = location.state as { from?: string };
      const redirectTo = state?.from || '/';

      // Role-based redirection
      const role = response.role?.toLowerCase();
      
      if (role === 'admin' || role === 'user') {
        toast({
          title: "مرحباً بك في لوحة التحكم!",
          description: "تم تسجيل الدخول بنجاح",
        });
        navigate('/admin-dashboard');
        return;
      }

      // Handle other roles
      switch (role) {
        case 'owner':
          navigate('/owner-dashboard');
          break;
        case 'student':
          navigate(redirectTo);
          break;
        default:
          navigate(redirectTo);
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك!",
      });
      
    } catch (error) {
      console.error('Login error:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: "فشل تسجيل الدخول",
        description: axiosError.response?.data?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Sending registration data:", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
      });
      
      const response = await authAPI.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
      });

      // Store token and user data
      localStorage.setItem('userRole', values.role);
      
      // Create user object from response data
      const userData = {
        id: String(response.id || response.studentID || response.ownerID || response.adminID || response.userID),
        firstName: response.firstName || values.firstName,
        lastName: response.lastName || values.lastName,
        email: response.email || values.email,
        phone: response.phone || values.phone,
        role: values.role as 'Student' | 'Owner' | 'Admin'
      };
      
      login(userData);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Maskani!",
      });

      // Role-based redirection
      if (values.role === 'Admin') {
        toast({
          title: "Welcome Admin!",
          description: "You are being redirected to the Admin Dashboard.",
        });
        navigate('/admin-dashboard');
        return;
      }
      switch (values.role) {
        case 'Owner':
          navigate('/owner-dashboard');
          break;
        case 'Student':
          navigate('/');
          break;
        default:
          navigate('/');
      }
      
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;
      console.error('Registration error details:', {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status
      });
      
      toast({
        title: "Registration failed",
        description: axiosError.response?.data?.message || 
          (typeof axiosError.response?.data === 'string' 
            ? axiosError.response.data 
            : JSON.stringify(axiosError.response?.data)) || 
          "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToRegister = () => {
    document.querySelector('[data-value="register"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
  };

  const switchToLogin = () => {
    document.querySelector('[data-value="login"]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to Maskani
              </h1>
              <p className="text-gray-600">Sign in to access your account</p>
            </div>

            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 w-full mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Enter your email"
                                {...field}
                                className="pl-10" 
                              />
                            </FormControl>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Password</FormLabel>
                            <a href="#" className="text-sm text-maskani-primary hover:underline">
                              Forgot password?
                            </a>
                          </div>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10 pr-10"
                                {...field} 
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? 
                                <EyeOff className="h-5 w-5" /> : 
                                <Eye className="h-5 w-5" />
                              }
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-maskani-primary hover:bg-maskani-primary/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                    
                    <div className="mt-6 text-center text-sm text-gray-500">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-maskani-primary hover:underline"
                        onClick={switchToRegister}
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type="tel"
                                placeholder="Enter your phone number"
                                className="pl-10 pr-10"
                                {...field} 
                              />
                            </FormControl>
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Enter your email"
                                {...field}
                                className="pl-10" 
                              />
                            </FormControl>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-10 pr-10"
                                {...field} 
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? 
                                <EyeOff className="h-5 w-5" /> : 
                                <Eye className="h-5 w-5" />
                              }
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className="pl-10 pr-10"
                                {...field} 
                              />
                            </FormControl>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <select
                            {...field}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="Student">Student</option>
                            <option value="Owner">Owner</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField                 
                      control={registerForm.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => field.onChange(checked)}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I accept the{" "}
                              <a href="#" className="text-maskani-primary hover:underline">
                                terms and conditions
                              </a>
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    
                    <Button
                      type="submit"
                      className="w-full bg-maskani-primary hover:bg-maskani-primary/90 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </Button>
                    
                    <div className="mt-6 text-center text-sm text-gray-500">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-maskani-primary hover:underline"
                        onClick={switchToLogin}
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
