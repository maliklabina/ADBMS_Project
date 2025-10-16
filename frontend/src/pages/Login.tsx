import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Lock, User, Hotel, UserPlus } from 'lucide-react';

const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const adminLoginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserLoginFormData = z.infer<typeof userLoginSchema>;
type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register: userLoginRegister,
    handleSubmit: handleUserLoginSubmit,
    formState: { errors: userLoginErrors },
  } = useForm<UserLoginFormData>({
    resolver: zodResolver(userLoginSchema),
  });

  const {
    register: adminLoginRegister,
    handleSubmit: handleAdminLoginSubmit,
    formState: { errors: adminLoginErrors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { login, register: authRegister } = useAuth();

  const onLoginSubmit = async (data: UserLoginFormData | AdminLoginFormData) => {
    setIsLoading(true);
    try {
      if (isAdmin) {
        const adminData = data as AdminLoginFormData;
        await login(adminData.username, adminData.password, true);
      } else {
        const userData = data as UserLoginFormData;
        await login(userData.email, userData.password, false);
      }
      
      toast.success(isAdmin ? 'Admin login successful!' : 'Login successful!', {
        description: `Welcome to Royal Blue Rooms ${isAdmin ? 'Admin' : ''}`,
      });
      navigate(isAdmin ? '/guests' : '/bookings');
    } catch (error: any) {
      const errorMessage = error.message || 'Authentication failed';
      toast.error('Login failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authRegister(data.username, data.email, data.password);
      toast.success('Registration successful!', {
        description: 'Welcome to Royal Blue Rooms',
      });
      navigate('/bookings');
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      toast.error('Registration failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      
      <Card className="max-w-md w-full p-8 shadow-elegant animate-scale-in relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-glow mb-4">
            <Hotel className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Royal Blue Rooms</h1>
          <p className="text-muted-foreground">Welcome to our booking system</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-6">
            <form onSubmit={isAdmin ? handleAdminLoginSubmit(onLoginSubmit) : handleUserLoginSubmit(onLoginSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor={isAdmin ? "login-username" : "login-email"} className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>{isAdmin ? "Username" : "Email"}</span>
                </Label>
                {isAdmin ? (
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="Enter username"
                    {...adminLoginRegister('username')}
                    className={adminLoginErrors.username ? 'border-destructive' : ''}
                  />
                ) : (
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter email"
                    {...userLoginRegister('email')}
                    className={userLoginErrors.email ? 'border-destructive' : ''}
                  />
                )}
                {isAdmin ? (
                  adminLoginErrors.username && (
                    <p className="text-sm text-destructive">{adminLoginErrors.username.message}</p>
                  )
                ) : (
                  userLoginErrors.email && (
                    <p className="text-sm text-destructive">{userLoginErrors.email.message}</p>
                  )
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>Password</span>
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter password"
                  {...(isAdmin ? adminLoginRegister('password') : userLoginRegister('password'))}
                  className={
                    isAdmin
                      ? adminLoginErrors.password ? 'border-destructive' : ''
                      : userLoginErrors.password ? 'border-destructive' : ''
                  }
                />
                {isAdmin
                  ? adminLoginErrors.password && (
                      <p className="text-sm text-destructive">{adminLoginErrors.password.message}</p>
                    )
                  : userLoginErrors.password && (
                      <p className="text-sm text-destructive">{userLoginErrors.password.message}</p>
                    )}
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="isAdmin">Login as Admin</Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="register-username" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  <span>Username</span>
                </Label>
                <Input
                  id="register-username"
                  type="text"
                  placeholder="Enter username"
                  {...registerRegister('username')}
                  className={registerErrors.username ? 'border-destructive' : ''}
                />
                {registerErrors.username && (
                  <p className="text-sm text-destructive">{registerErrors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>Email</span>
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter email"
                  {...registerRegister('email')}
                  className={registerErrors.email ? 'border-destructive' : ''}
                />
                {registerErrors.email && (
                  <p className="text-sm text-destructive">{registerErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>Password</span>
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Enter password"
                  {...registerRegister('password')}
                  className={registerErrors.password ? 'border-destructive' : ''}
                />
                {registerErrors.password && (
                  <p className="text-sm text-destructive">{registerErrors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>Confirm Password</span>
                </Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  {...registerRegister('confirmPassword')}
                  className={registerErrors.confirmPassword ? 'border-destructive' : ''}
                />
                {registerErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{registerErrors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {activeTab === "login" && (
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo Admin Credentials:</strong><br />
              Username: admin | Password: admin123
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
