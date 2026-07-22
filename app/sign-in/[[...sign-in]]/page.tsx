'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useSignIn } from '@clerk/nextjs/legacy';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowLeft, 
  Brain, 
  FileText, 
  Layers, 
  CalendarRange, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useUser();

  // UI state
  const [email, setEmail] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('email') || '';
    }
    return '';
  });
  const [password, setPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [resetCode, setResetCode] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  // Redirect to dashboard if already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);
  
  // "signin", "forgot-password", "reset-password"
  const [mode, setMode] = React.useState<'signin' | 'forgot-password' | 'reset-password'>('signin');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // Handle email/password sign-in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
        router.refresh();
      } else {
        console.warn('Sign in incomplete status:', result.status);
        setError('Verification or secondary factor required. Please sign in via the widget.');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(
        err.errors?.[0]?.longMessage || 
        err.errors?.[0]?.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleSignIn = async () => {
    if (!isLoaded || !signIn) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sign-in/sso-callback',
        redirectUrlComplete: '/dashboard',
      });
    } catch (err: any) {
      console.error('Google OAuth error:', err);
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Google authentication failed.');
      setIsLoading(false);
    }
  };

  // Forgot password -> Send Code
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setSuccess('A temporary verification code has been sent to your email.');
      setMode('reset-password');
    } catch (err: any) {
      console.error('Send reset code error:', err);
      setError(
        err.errors?.[0]?.longMessage || 
        err.errors?.[0]?.message || 
        'Could not initiate password reset. Verify your email is correct.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password with code and new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode,
        password: newPassword,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        setSuccess('Password updated successfully!');
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Password reset incomplete. Please try again.');
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Failed to verify code or update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0C0E] text-white flex overflow-hidden relative font-sans">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* LEFT COLUMN - Brand & Features Showcases (40%) */}
      <div className="hidden lg:flex w-[42%] bg-[#0f1013] border-r border-white/[0.04] p-12 flex-col justify-between relative overflow-hidden shrink-0 z-10">
        {/* Particle/Grid background */}
        <div className="absolute inset-0 bg-grid-dots text-white opacity-[0.015] pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-[0.01] pointer-events-none" />

        {/* Brand header */}
        <div className="flex items-center gap-3 relative">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.4)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            EducAI<span className="text-amber-500">.</span>
          </span>
        </div>

        {/* Main Pitch */}
        <div className="space-y-8 my-auto relative max-w-lg">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Adapting to you
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
              Start Your AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                Learning Journey.
              </span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              Join a workspace designed around active recall, custom cognitive mapping, and immediate retrieval feedback.
            </p>
          </div>

          {/* Premium cards list */}
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                icon: Brain,
                title: 'AI Tutor',
                desc: 'Adaptive questioning and cognitive mentoring.',
                color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
              },
              {
                icon: FileText,
                title: 'PDF Analyzer',
                desc: 'Deep synthesis and automatic semantic extraction.',
                color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
              },
              {
                icon: Layers,
                title: 'Flashcards',
                desc: 'Active recall backed by dynamic active rehearsal.',
                color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
              },
              {
                icon: CalendarRange,
                title: 'Personalized Study Plans',
                desc: 'Goal-aligned dynamic learning schedules.',
                color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-300 group"
              >
                <div className={`p-2 rounded-xl border shrink-0 transition-all duration-300 group-hover:scale-105 ${feature.color}`}>
                  <feature.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Statistics */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.04] relative">
          <div>
            <span className="block text-xl font-black text-amber-500">14.2k+</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-extrabold">Active Scholars</span>
          </div>
          <div>
            <span className="block text-xl font-black text-white">98.4%</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-extrabold">Retention Rate</span>
          </div>
          <div>
            <span className="block text-xl font-black text-white">4.8h</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-extrabold">Weekly Saved</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Glassmorphic Auth Form Container (60%) */}
      <div className="flex-1 flex flex-col justify-between items-center px-4 py-8 md:p-12 relative z-10 overflow-y-auto">
        {/* Floating Back Button */}
        <div className="w-full max-w-md flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white text-[11px] font-semibold transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          
          <div className="text-xs text-zinc-500 font-medium">
            New here?{' '}
            <Link href="/sign-up" className="text-amber-500 hover:text-amber-400 font-bold transition-colors">
              Create Account
            </Link>
          </div>
        </div>

        {/* Center Card */}
        <div className="w-full max-w-md my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-3xl border border-white/[0.06] bg-[#121316]/60 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Top Glow bar */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <AnimatePresence mode="wait">
              {/* MODE 1: SIGN IN */}
              {mode === 'signin' && (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">Welcome back</h2>
                    <p className="text-zinc-400 text-xs font-medium">
                      Enter your details to access your adaptive learning dashboard.
                    </p>
                  </div>

                  {/* Feedback Messages */}
                  {error && (
                    <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Social Google OAuth Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] disabled:opacity-50 text-zinc-300 hover:text-white transition-all duration-200 text-xs font-bold active:scale-[0.98] cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  {/* Divider */}
                  <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-white/[0.06]"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">
                      or continue with email
                    </span>
                    <div className="flex-grow border-t border-white/[0.06]"></div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@university.edu"
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none text-xs font-semibold placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setMode('forgot-password')}
                          className="text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none text-xs font-semibold placeholder:text-zinc-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs text-zinc-400 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-white/[0.08] bg-white/[0.02] text-amber-600 focus:ring-0 w-3.5 h-3.5 accent-amber-500"
                        />
                        Remember me
                      </label>
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(217,119,6,0.2)] hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] active:scale-[0.98] text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* MODE 2: FORGOT PASSWORD */}
              {mode === 'forgot-password' && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">Reset Password</h2>
                    <p className="text-zinc-400 text-xs font-medium">
                      Enter your email to receive a secure recovery verification code.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSendResetCode} className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@university.edu"
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none text-xs font-semibold placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setMode('signin')}
                        className="flex-1 h-11 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-zinc-300 hover:text-white transition-all text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 h-11 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)] active:scale-[0.98] text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Send Code'
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* MODE 3: RESET PASSWORD WITH CODE */}
              {mode === 'reset-password' && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-extrabold tracking-tight text-white">Enter New Password</h2>
                    <p className="text-zinc-400 text-xs font-medium">
                      Enter the verification code sent to your email and choose a new password.
                    </p>
                  </div>

                  {success && (
                    <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span>{success}</span>
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        required
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        placeholder="6-digit code"
                        className="w-full h-11 px-4 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none text-xs font-semibold tracking-wider text-center"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password (min 8 chars)"
                          className="w-full h-11 pl-10 pr-10 rounded-xl bg-white/[0.02] border border-white/[0.08] text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none text-xs font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_15px_rgba(217,119,6,0.3)] active:scale-[0.98] text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Verify & Save'
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Brand Copyright */}
        <div className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">
          © {new Date().getFullYear()} EducAI Technologies. Securely managed by Clerk.
        </div>
      </div>
    </div>
  );
}
