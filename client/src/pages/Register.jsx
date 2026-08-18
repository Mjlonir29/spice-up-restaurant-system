import { API_BASE_URL } from '../config';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  UtensilsCrossed, 
  ChefHat, 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Store, 
  AlertCircle,
  Receipt,
  Flame,
  Zap,
  Mail,
  UserPlus,
  ArrowLeft
} from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const regName = name.trim();
    const regEmail = email.trim().toLowerCase();
    const regPass = password.trim();
    const regConfirm = confirmPassword.trim();

    if (!regName || !regEmail || !regPass) {
      setErrorMessage('Please fill in all required fields (Name, Email, Password).');
      return;
    }

    if (!regEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (regPass.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (regPass !== regConfirm) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: regName,
        email: regEmail,
        password: regPass,
        role: role
      });

      if (res.data?.success) {
        setSuccessMessage('Account created successfully! Redirecting to POS Dashboard...');
        if (res.data?.token) {
          localStorage.setItem('pos_token', res.data.token);
        }
        localStorage.setItem('pos_user', JSON.stringify(res.data?.user || { name: regName, email: regEmail, role: role }));
        
        setTimeout(() => {
          setIsLoading(false);
          navigate('/admin');
        }, 1200);
      } else {
        setErrorMessage(res.data?.message || 'Failed to create account.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setErrorMessage(err.response?.data?.message || 'Server error during account creation.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-[#f0f6fc] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Subtle Nordic Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d15_1px,transparent_1px),linear-gradient(to_bottom,#30363d15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl bg-[#161b22] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#30363d] relative z-10">
        
        {/* Left Side: Brand Showcase */}
        <div className="lg:col-span-6 p-8 lg:p-10 bg-[#0d1117]/80 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#30363d] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <UtensilsCrossed className="w-80 h-80 text-emerald-500" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-md shadow-emerald-950/40">
                <Flame className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading tracking-tight text-white flex items-center gap-1.5">
                  SPICE<span className="text-emerald-400">UP</span>
                </h1>
                <p className="text-xs text-[#8b949e] font-medium">Smart Restaurant & POS Engine</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Account & Start Managing</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight font-heading mb-3">
              Join the future of restaurant & kitchen <span className="text-emerald-400">management</span>.
            </h2>
            <p className="text-[#8b949e] text-sm leading-relaxed mb-6">
              Set up your admin profile or staff credentials to start managing table orders, kitchen display systems, and real-time billing.
            </p>
          </div>

          <div className="space-y-2.5 my-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#161b22] border border-[#30363d]">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instant POS Onboarding</p>
                <p className="text-[11px] text-[#8b949e]">Register new Admin or Staff accounts in seconds</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#161b22] border border-[#30363d]">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Secure Encrypted Credentials</p>
                <p className="text-[11px] text-[#8b949e]">Bcrypt password hashing & JWT token security</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#30363d] flex items-center justify-between text-xs text-[#8b949e]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ISO 27001 Certified System
            </span>
            <span>v2.4.0 • Enterprise Edition</span>
          </div>

        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-center bg-[#161b22]">
          
          <div className="max-w-md mx-auto w-full">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold font-heading text-white">Create Account</h3>
                <Link 
                  to="/" 
                  className="px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-xs font-medium flex items-center gap-1.5 transition-colors border border-[#30363d]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              </div>
              <p className="text-[#8b949e] text-sm">Fill in your details to create a new user account</p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-300">Registration Error</p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-300">Success!</p>
                  <p className="mt-0.5">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleRegister} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm text-white placeholder-[#8b949e]/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email / Gmail */}
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                  Email / Gmail Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm text-white placeholder-[#8b949e]/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
                    <Lock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 4 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg glass-input text-sm text-white placeholder-[#8b949e]/60 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8b949e] hover:text-[#f0f6fc] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
                    <Lock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg glass-input text-sm text-white placeholder-[#8b949e]/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Account Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">
                  Assign Account Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'admin' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm' 
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('staff')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'staff' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm' 
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'
                    }`}
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    Staff
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'customer' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm' 
                        : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-[#c9d1d9]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Customer
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-all duration-150 shadow-md shadow-emerald-950/40 active:scale-[0.99] flex items-center justify-center gap-2 text-sm mt-3 disabled:opacity-60 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Enter POS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Back to Sign In Footer Link */}
            <div className="mt-5 text-center">
              <p className="text-xs text-[#8b949e]">
                Already registered?{' '}
                <Link to="/" className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline">
                  Sign In to POS
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;
