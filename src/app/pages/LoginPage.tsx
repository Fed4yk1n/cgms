import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Mail, Lock, Eye, EyeOff, Phone, User, CheckCircle, Zap, Bell, Upload } from 'lucide-react';
import { useAuth, type UserRole } from '../contexts/AuthContext';

type Tab = 'login' | 'register';

export function LoginPage() {
  const { login, register, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (show2FA && otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [show2FA, otpTimer]);

  const passwordStrength = (p: string) => {
    if (p.length < 6) return { label: 'Weak', color: 'bg-red-500', w: 'w-1/3' };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Medium', color: 'bg-amber-500', w: 'w-2/3' };
    return { label: 'Strong', color: 'bg-green-500', w: 'w-full' };
  };

  const [loginError, setLoginError] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (role === 'official' || role === 'admin') {
      setShow2FA(true);
      setLoading(false);
      return;
    }
    const success = await login(email, password, role);
    if (!success) setLoginError('Invalid email or password');
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setLoginError('');
    await new Promise(r => setTimeout(r, 500));
    const success = await login(email, password, role);
    if (!success) setLoginError('Invalid email or password');
    setLoading(false);
    setShow2FA(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regPass !== regConfirm) {
      setRegError('Passwords do not match');
      return;
    }
    if (regPass.length < 6) {
      setRegError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(regName, regEmail, regPass, 'citizen');
    setLoading(false);

    if (result.success) {
      setRegSuccess(true);
    } else {
      setRegError(result.error || 'Registration failed');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const strength = passwordStrength(regPass);

  const demoAccounts = [
    { role: 'citizen' as UserRole, email: 'citizen@demo.com', label: 'Citizen' },
    { role: 'official' as UserRole, email: 'official@demo.com', label: 'Official' },
    { role: 'admin' as UserRole, email: 'admin@demo.com', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A56DB] to-[#0D9488] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 flex-1 text-white">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-bold">Citizen Portal</div>
            <div className="text-blue-200 text-sm">Government Services</div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 leading-tight">
          File & Track Your<br />Complaints
        </h1>
        <p className="text-blue-100 text-lg mb-10">
          Transparent grievance redressal for every citizen — fast, accountable, and secure.
        </p>

        <div className="space-y-5">
          {[
            { icon: Zap, title: 'Real-time tracking', desc: 'Monitor complaint status at every step' },
            { icon: Upload, title: 'Secure uploads', desc: 'Share evidence with end-to-end security' },
            { icon: Bell, title: 'Instant notifications', desc: 'Get alerts on every status change' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">{f.title}</div>
                <div className="text-blue-200 text-sm">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 p-4 bg-white/10 rounded-xl">
          <p className="text-sm text-blue-100 mb-3">Quick Demo Access:</p>
          <div className="flex gap-2">
            {demoAccounts.map(acc => (
              <button
                key={acc.role}
                onClick={() => { setEmail(acc.email); setPassword('demo123'); setRole(acc.role); setTab('login'); }}
                className="flex-1 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:flex-initial lg:w-[420px] flex items-center justify-center p-6 bg-white lg:rounded-l-3xl">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 bg-[#1A56DB] rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Citizen Portal</span>
          </div>

          <h2 className="text-gray-900 mb-1">{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p className="text-sm text-gray-500 mb-6">{tab === 'login' ? 'Sign in to your account' : 'Join the citizen portal'}</p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 pb-2 text-sm font-medium capitalize transition-colors ${
                  tab === t ? 'border-b-2 border-[#1A56DB] text-[#1A56DB]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">{loginError}</div>
              )}
              {/* Role selector */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide mb-1.5 block">Sign in as</label>
                <div className="grid grid-cols-3 gap-2">
                  {demoAccounts.map(acc => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => { setRole(acc.role); setEmail(acc.email); setPassword('demo123'); }}
                      className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                        role === acc.role ? 'border-[#1A56DB] bg-blue-50 text-[#1A56DB]' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-700">Password</label>
                  <button type="button" className="text-xs text-[#1A56DB] hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                className="w-full h-10 border border-gray-300 rounded-lg text-sm text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
            </form>
          ) : regSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your account has been created. Please check your email for verification, then sign in.
              </p>
              <button
                onClick={() => { setRegSuccess(false); setTab('login'); }}
                className="w-full h-10 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">{regError}</div>
              )}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Your full name" className="w-full pl-10 pr-3 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-3 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <select className="h-10 border border-gray-300 rounded-lg text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>+91</option><option>+1</option><option>+44</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="98765 43210" className="w-full pl-10 pr-3 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Create a strong password" className="w-full pl-10 pr-3 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                {regPass && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.w} transition-all`} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{strength.label} password</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="Confirm password" className="w-full pl-10 pr-3 h-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  {regConfirm && regPass === regConfirm && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-blue-600" />
                <span className="text-xs text-gray-600">I agree to the <span className="text-blue-600 hover:underline">Terms of Service</span> and <span className="text-blue-600 hover:underline">Privacy Policy</span></span>
              </label>
              <button
                type="submit"
                disabled={!agreed || loading}
                className="w-full h-10 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 2FA Modal */}
      {show2FA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-[#1A56DB]" />
              </div>
              <h3 className="text-gray-900 mb-1">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Enter the 6-digit OTP sent to your email</p>
            </div>
            <div className="flex gap-2 justify-center mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  className="w-10 h-12 border-2 border-gray-300 rounded-lg text-center text-lg font-bold focus:outline-none focus:border-[#1A56DB] transition-colors"
                />
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mb-4">
              {otpTimer > 0 ? `Resend OTP in 00:${String(otpTimer).padStart(2, '0')}` : (
                <button className="text-blue-600 hover:underline" onClick={() => setOtpTimer(45)}>Resend OTP</button>
              )}
            </p>
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.some(d => !d)}
              className="w-full h-10 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button onClick={() => setShow2FA(false)} className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
