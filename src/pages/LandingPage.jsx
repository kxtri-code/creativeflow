import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAI } from '../context/AIContext';
import { useToast } from '../context/ToastContext';
import { Navigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Users, Layers, Zap, ShieldCheck, Mail, Key } from 'lucide-react';

const LandingPage = () => {
  const { user, login, signup, loading: authLoading } = useAuth();
  const { isAuthorized, authorize, manualAuthorize } = useAI();
  const { addToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '', department: 'tech', role: 'user' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, {
          full_name: formData.fullName,
          department: formData.department,
          role: formData.role
        });
        setIsLogin(true); // Switch to login after signup
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIAuth = async () => {
      // Optional: Handle AI key separately or after login
      if (apiKey) manualAuthorize(apiKey);
      else await authorize();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-x-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-400/20 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
            CF
          </div>
          <span className="font-bold text-xl text-slate-900">CreativeFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#roles" className="hover:text-indigo-600 transition-colors">Who is it for?</a>
          <a href="#why" className="hover:text-indigo-600 transition-colors">Why Us</a>
        </div>
        <button onClick={() => document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' })} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} /> The OS for Creative Agencies
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-6">
            Stop juggling apps. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Start flowing.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            The all-in-one workspace where Admin, HR, Heads of Departments, and Creatives unite. Powered by Gemini AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2">
              Start Your Free Trial <ArrowRight size={20} />
            </button>
            <button onClick={() => addToast('Launching demo soon', 'info')} className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Auth Card (Right Side) */}
        <div id="auth-section" className="relative">
          <div className="glass-card p-8 md:p-10 max-w-md mx-auto w-full relative z-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-500 mb-8 text-sm">
              {isLogin ? 'Enter your credentials to access the workspace.' : 'Join the new standard of agency management.'}
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Full Name</label>
                      <input 
                        required
                        type="text" 
                        className="glass-input w-full px-4 py-2.5 text-sm"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Role</label>
                      <select 
                        className="glass-input w-full px-4 py-2.5 text-sm"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="user">Creative</option>
                        <option value="hod">Head of Dept</option>
                        <option value="hr">HR Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Department</label>
                    <select 
                      className="glass-input w-full px-4 py-2.5 text-sm"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    >
                      <option value="tech">Tech</option>
                      <option value="design">Design</option>
                      <option value="social">Social Media</option>
                      <option value="media">Media & Prod</option>
                      <option value="content">Content</option>
                      <option value="hr">HR</option>
                      <option value="ops">Operations</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                  <input 
                    required
                    type="email" 
                    className="glass-input w-full pl-10 pr-4 py-2.5 text-sm"
                    placeholder="you@agency.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                  <input 
                    required
                    type="password" 
                    className="glass-input w-full pl-10 pr-4 py-2.5 text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Gemini Key Input (Optional for initial access) */}
              <div className="pt-2 border-t border-slate-100 mt-4">
                 <p className="text-xs text-slate-400 mb-2">Gemini API Key (Optional)</p>
                 <div className="relative">
                    <Key className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    <input 
                      type="password"
                      placeholder="Enter key later in settings if preferred"
                      className="glass-input w-full pl-10 pr-4 py-2.5 text-sm"
                      value={apiKey}
                      onChange={(e) => {
                          setApiKey(e.target.value);
                          if(e.target.value) manualAuthorize(e.target.value);
                      }}
                    />
                 </div>
              </div>

              {error && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl">
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        </div>
      )}

      <button 
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all mt-4"
              >
                {isSubmitting ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-slate-500 hover:text-indigo-600 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          </div>
          
          {/* Decorative Card Elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* USP Section */}
      <section id="features" className="py-24 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why CreativeFlow?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Built specifically for the chaotic, fast-paced world of modern creative agencies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: "Unified Ecosystem", desc: "Replace Trello, Slack, Drive, and HR tools with one cohesive glassmorphism interface." },
              { icon: Zap, title: "AI-Powered", desc: "Gemini 3 Flash integration for instant copy, strategy, and data analysis in every hub." },
              { icon: ShieldCheck, title: "Role-Based Access", desc: "Granular permissions ensure Admins, HODs, and Creatives see exactly what they need." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-3xl font-bold text-slate-900 mb-6">Built for every role in your agency.</h2>
             <div className="space-y-6">
                {[
                  { role: "Admins", desc: "Full oversight of operations, finance, and system settings." },
                  { role: "HR Managers", desc: "Manage talent, leave requests, and organizational structure." },
                  { role: "Head of Departments", desc: "Lead teams, approve assets, and track department KPIs." },
                  { role: "Creatives", desc: "Focus on work with a clutter-free interface and AI tools." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowRight size={12} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.role}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-3xl transform rotate-3 opacity-20"></div>
             <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2940" alt="Team collaboration" className="relative rounded-3xl shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 text-center text-sm">
        <p>&copy; 2026 CreativeFlow CRM. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
