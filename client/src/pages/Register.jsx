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
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Texture Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-6xl glass-panel rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-800/80 relative z-10">
        
        {/* Left Side: Brand Showcase */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/60 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <UtensilsCrossed className="w-80 h-80 text-amber-500" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 ring-2 ring-amber-400/30">
                <Flame className="w-7 h-7 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading tracking-wide text-white flex items-center gap-2">
                  SPICE<span className="text-amber-500">UP</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Smart Restaurant & POS Engine</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Create Account & Start Managing</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight font-heading mb-4">
              Join the future of restaurant & kitchen <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">management</span>.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Set up your admin profile or staff credentials to start managing table orders, kitchen display systems, and real-time billing.
            </p>
          </div>

          <div className="space-y-3 my-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instant POS Onboarding</p>
                <p className="text-[11px] text-slate-400">Register new Admin or Staff accounts in seconds</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Secure Encrypted Credentials</p>
                <p className="text-[11px] text-slate-400">Bcrypt password hashing & JWT token security</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              ISO 27001 Certified System
            </span>
            <span>v2.4.0 • Enterprise Edition</span>
          </div>

        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-slate-900/40">
          
          <div className="max-w-md mx-auto w-full">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold font-heading text-white">Create Account</h3>
                <Link 
                  to="/" 
                  className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              </div>
              <p className="text-slate-400 text-sm">Fill in your details to create a new user account</p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-300">Registration Error</p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-300">Success!</p>
                  <p className="mt-0.5">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email / Gmail */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email / Gmail Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 4 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Account Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Assign Account Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'admin' 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10' 
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('staff')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'staff' 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10' 
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    Staff
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'customer' 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/10' 
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
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
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm mt-3 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
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
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <Link to="/" className="text-amber-400 hover:text-amber-300 font-bold hover:underline">
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
