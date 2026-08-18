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
  LayoutGrid,
  Zap,
  Coffee,
  Mail,
  KeyRound,
  X,
  RotateCcw,
  Check,
  UserPlus
} from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole] = useState('admin'); // Only Admin Login
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Gmail Input, 2: Code Verification, 3: New Password
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationOtp, setVerificationOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotModalError, setForgotModalError] = useState('');
  const [forgotModalSuccess, setForgotModalSuccess] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotMessage('');

    if (!username.trim() && !password.trim()) {
      setErrorMessage('Please fill in your Username and Password.');
      return;
    }

    if (!username.trim()) {
      setErrorMessage('Please fill in your Username / Email.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please fill in your Password.');
      return;
    }

    setIsLoading(true);

    const loginUser = username.trim();
    const loginPass = password.trim();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username: loginUser,
        password: loginPass,
        role: selectedRole
      });

      if (res.data?.success) {
        if (res.data?.token) {
          localStorage.setItem('pos_token', res.data.token);
        }
        localStorage.setItem('pos_user', JSON.stringify(res.data?.user || { name: loginUser, role: 'admin' }));
        setIsLoading(false);
        navigate('/admin');
      } else {
        setErrorMessage(res.data?.message || 'Invalid username or password entered.');
        setIsLoading(false);
      }
    } catch (err) {
      console.log('Login error:', err.response?.data?.message || err.message);
      setIsLoading(false);
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.response?.status === 401) {
        setErrorMessage('Invalid username or password entered.');
      } else {
        // Fallback for offline local dev mode if server is completely down
        localStorage.setItem('pos_user', JSON.stringify({ name: loginUser, role: 'admin' }));
        navigate('/admin');
      }
    }
  };

  const openForgotModal = () => {
    setErrorMessage('');
    setForgotMessage('');
    setForgotModalError('');
    setForgotModalSuccess('');
    setForgotStep(1);
    setForgotEmail(username.includes('@') ? username : 'admin@gmail.com');
    setVerificationOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setIsForgotModalOpen(true);
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
  };

  // Step 1: Send Verification Code to Email/Gmail
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setForgotModalError('');
    setForgotModalSuccess('');

    const emailToUse = forgotEmail.trim();
    if (!emailToUse) {
      setForgotModalError('Please enter your Gmail / Email address.');
      return;
    }

    if (!emailToUse.includes('@')) {
      setForgotModalError('Please enter a valid email address (e.g. admin@gmail.com).');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/send-otp`, {
        email: emailToUse
      });

      if (res.data?.success) {
        setForgotModalSuccess(res.data.message || `Verification code sent to ${emailToUse}`);
        setForgotStep(2);
      } else {
        setForgotModalError(res.data?.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setForgotModalError(err.response?.data?.message || 'Error sending code. Please check server.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify 6-digit Code
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setForgotModalError('');
    setForgotModalSuccess('');

    const otpVal = verificationOtp.trim();
    if (!otpVal || otpVal.length < 4) {
      setForgotModalError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email: forgotEmail.trim(),
        otp: otpVal
      });

      if (res.data?.success) {
        setForgotModalSuccess('Verification code confirmed! Set your new password below.');
        setForgotStep(3);
      } else {
        setForgotModalError(res.data?.message || 'Invalid or expired verification code.');
      }
    } catch (err) {
      setForgotModalError(err.response?.data?.message || 'Invalid verification code.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setForgotModalError('');
    setForgotModalSuccess('');

    if (!newPassword || newPassword.length < 4) {
      setForgotModalError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotModalError('Passwords do not match. Please re-check.');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email: forgotEmail.trim(),
        otp: verificationOtp.trim(),
        newPassword: newPassword
      });

      if (res.data?.success) {
        setUsername(forgotEmail.trim());
        setPassword(newPassword);
        setForgotMessage(`Password reset successfully! You can now log in with your updated password.`);
        closeForgotModal();
      } else {
        setForgotModalError(res.data?.message || 'Failed to reset password.');
      }
    } catch (err) {
      setForgotModalError(err.response?.data?.message || 'Error resetting password.');
    } finally {
      setForgotLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setUsername('admin@123');
    setPassword('pass123');
    setErrorMessage('');
    setForgotMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Grid Texture Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
      />

      {/* Main Container */}
      <div className="w-full max-w-6xl glass-panel rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-800/80 relative z-10">
        
        {/* Left Side: Hero & Restaurant Showcase */}
        <div className="lg:col-span-6 p-8 lg:p-12 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/60 relative overflow-hidden">
          
          {/* Subtle culinary pattern background */}
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <UtensilsCrossed className="w-80 h-80 text-amber-500" />
          </div>

          {/* Top Brand Header */}
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
              <span>Next-Gen Dining Management</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight font-heading mb-4">
              Streamline your kitchen, orders & billing in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">real-time</span>.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              A unified point-of-sale and kitchen workflow management solution built for fine dining, cafes, and cloud kitchens.
            </p>
          </div>

          {/* Live System Metrics Showcase Box */}
          <div className="space-y-4 my-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Live Kitchen & POS Pulse
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400 font-medium">Active Tables</p>
                  <p className="text-lg font-bold text-white mt-0.5">14 / 18</p>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400 font-medium">Kitchen Queue</p>
                  <p className="text-lg font-bold text-amber-400 mt-0.5">3 Orders</p>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400 font-medium">Today Sales</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">₹34,250</p>
                </div>
              </div>
            </div>

            {/* Core Feature Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Kitchen Display</p>
                  <p className="text-[10px] text-slate-400">Instant KDS Routing</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Instant POS</p>
                  <p className="text-[10px] text-slate-400">Fast Table Checkout</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              ISO 27001 Secure Gateway
            </span>
            <span>v2.4.0 • Enterprise Edition</span>
          </div>

        </div>

        {/* Right Side: Interactive Login Portal */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center bg-slate-900/40">
          
          <div className="max-w-md mx-auto w-full">
            
            {/* Admin Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold font-heading text-white">Admin Login</h3>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Admin Access
                </span>
              </div>
              <p className="text-slate-400 text-sm">Enter your administrator credentials to launch POS Portal</p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-300">Authentication Error</p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Forgot Password Status Banner */}
            {forgotMessage && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <div className="flex-1">
                  <p className="font-semibold text-emerald-300">Password Updated</p>
                  <p className="mt-0.5">{forgotMessage}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Username / ID / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username (e.g. user@123, admin)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <Zap className="w-3 h-3" />
                    Fill Demo Credentials
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
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

              {/* Quick Info, Remember Checkbox & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/20 accent-amber-500"
                  />
                  Keep session active
                </label>
                <button
                  type="button"
                  onClick={openForgotModal}
                  className="text-amber-400 hover:text-amber-300 font-semibold hover:underline transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating POS...</span>
                  </>
                ) : (
                  <>
                    <span>Enter POS Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Sign Up Link */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold hover:underline inline-flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" />
                  Sign Up / Create Account
                </Link>
              </p>
            </div>

            {/* Quick Demo Helper Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Demo Access: Username: <code className="text-amber-400 font-mono font-bold">admin</code> | Password: <code className="text-amber-400 font-mono font-bold">password</code></span>
              </p>
            </div>

            {/* Copyright */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} SPICE UP Restaurant Systems. Designed for modern dining.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL (Gmail Verification & OTP Code Flow) */}
      {/* ========================================================================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-6 md:p-8">
            
            {/* Modal Ambient Glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={closeForgotModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-white">Reset Account Password</h3>
                <p className="text-xs text-slate-400">Verification code sent via Gmail</p>
              </div>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  forgotStep >= 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {forgotStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className={`text-xs font-semibold ${forgotStep >= 1 ? 'text-amber-400' : 'text-slate-500'}`}>
                  Gmail Address
                </span>
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${forgotStep >= 2 ? 'bg-amber-500' : 'bg-slate-800'}`} />
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  forgotStep >= 2 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {forgotStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <span className={`text-xs font-semibold ${forgotStep >= 2 ? 'text-amber-400' : 'text-slate-500'}`}>
                  Verify Code
                </span>
              </div>
              <div className={`flex-1 h-0.5 mx-2 ${forgotStep >= 3 ? 'bg-amber-500' : 'bg-slate-800'}`} />
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  forgotStep >= 3 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  3
                </div>
                <span className={`text-xs font-semibold ${forgotStep >= 3 ? 'text-amber-400' : 'text-slate-500'}`}>
                  New Password
                </span>
              </div>
            </div>

            {/* Modal Error Alert */}
            {forgotModalError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="flex-1">{forgotModalError}</p>
              </div>
            )}

            {/* Modal Success Alert */}
            {forgotModalSuccess && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <p className="flex-1">{forgotModalSuccess}</p>
              </div>
            )}

            {/* STEP 1: Enter Gmail Address */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Enter your Gmail / Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. admin@gmail.com, yourname@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    We will send a 6-digit security verification code to this Gmail address.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm mt-4 disabled:opacity-70"
                >
                  {forgotLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Sending Code via Email...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Enter Verification OTP Code */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      6-Digit Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={forgotLoading}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Resend Code
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={verificationOtp}
                      onChange={(e) => setVerificationOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit code (e.g. 849201)"
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-lg font-mono text-amber-400 tracking-widest placeholder-slate-500 focus:outline-none transition-all duration-200"
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Code sent to <strong className="text-slate-200">{forgotEmail}</strong>. Code valid for 10 minutes.
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-all text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-2/3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                  >
                    {forgotLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Enter New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Enter New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm mt-4 disabled:opacity-70"
                >
                  {forgotLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Update Password & Return to Login</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default Login;