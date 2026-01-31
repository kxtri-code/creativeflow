import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Building2, Globe, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Onboarding = () => {
  const { user, createCompany, currencies, setOrgName } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    orgName: '',
    companyName: '',
    currency: 'INR'
  });

  const handleNext = () => {
    if (step === 1 && !formData.orgName) {
      addToast('Please enter your organization name', 'error');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFinish = async () => {
    if (!formData.companyName) {
      addToast('Please enter a company name', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Create the first company
      await createCompany(
        formData.companyName, 
        formData.currency,
        formData.isGST,
        formData.gstNumber,
        formData.address
      );
      
      // Store Org name in localStorage for demo purposes (or update profile)
      localStorage.setItem('demo_org_name', formData.orgName);
      setOrgName(formData.orgName);
      
      addToast('Setup complete! Welcome to CreativeFlow.', 'success');
      
      // Small delay for effect
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error(error);
      addToast('Something went wrong during setup.', 'error');
      setLoading(false);
    }
  };

  const variants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
            <span className={step >= 1 ? 'text-slate-900' : ''}>Organization</span>
            <span className={step >= 2 ? 'text-slate-900' : ''}>First Company</span>
            <span className={step >= 3 ? 'text-slate-900' : ''}>Ready</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-slate-900"
              initial={{ width: '33%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[400px] flex flex-col">
          <div className="p-8 flex-1 relative">
            <AnimatePresence mode='wait'>
              
              {/* STEP 1: ORGANIZATION */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Building2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome to CreativeFlow</h2>
                    <p className="text-slate-500">Let's set up your organization workspace.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                    <input 
                      type="text" 
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-lg"
                      placeholder="e.g. Acme Corp Global"
                      value={formData.orgName}
                      onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: COMPANY */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Globe size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Create Your First Company</h2>
                    <p className="text-slate-500">Organizations can contain multiple companies.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none"
                        placeholder="e.g. Acme Corp"
                        value={formData.companyName}
                        onChange={e => setFormData({...formData, companyName: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                      <select 
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none"
                        value={formData.currency}
                        onChange={e => setFormData({...formData, currency: e.target.value})}
                      >
                        {currencies.map(c => (
                          <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2">
                       <label className="flex items-center gap-2 cursor-pointer mb-2">
                         <input 
                           type="checkbox"
                           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                           checked={formData.isGST}
                           onChange={e => setFormData({...formData, isGST: e.target.checked})}
                         />
                         <span className="text-sm font-medium text-slate-700">Is GST Compliant?</span>
                       </label>
                    </div>

                    {formData.isGST && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">GST Number</label>
                          <input 
                            type="text" 
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none uppercase"
                            value={formData.gstNumber}
                            onChange={e => setFormData({...formData, gstNumber: e.target.value.toUpperCase()})}
                            placeholder="e.g. 22AAAAA0000A1Z5"
                          />
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Registered Address</label>
                      <textarea 
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none resize-none h-20"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        placeholder="Official billing address..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SUCCESS */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6 text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">All Set!</h2>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    You're ready to manage {formData.companyName} with {formData.currency} currency.
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            {step > 1 && step < 3 ? (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-white rounded-lg transition-colors font-medium"
              >
                <ArrowLeft size={18} /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 2 ? (
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-bold shadow-lg shadow-slate-900/20"
              >
                Next Step <ArrowRight size={18} />
              </button>
            ) : step === 2 ? (
              <button 
                onClick={() => setStep(3)} // Transition to step 3 first
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-bold shadow-lg shadow-slate-900/20"
              >
                Create Company <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold shadow-lg shadow-green-600/20 w-full justify-center"
              >
                {loading ? 'Setting up...' : 'Go to Dashboard'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
