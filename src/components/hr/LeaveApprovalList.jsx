import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Check, X, Clock } from 'lucide-react';

const LeaveApprovalList = ({ refreshTrigger }) => {
  const { profile, currentCompany } = useAuth();
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);

  // Load requests from localStorage
  useEffect(() => {
    const loadRequests = () => {
      if (!currentCompany) return;
      const allRequests = JSON.parse(localStorage.getItem('leave_requests') || '[]');
      const companyRequests = allRequests.filter(req => req.companyId === currentCompany.id);
      setRequests(companyRequests);
    };
    loadRequests();
    // Listen for storage events if needed, but we use refreshTrigger prop for simple updates
  }, [refreshTrigger, currentCompany]);

  const handleAction = (id, status) => {
    const allRequests = JSON.parse(localStorage.getItem('leave_requests') || '[]');
    const updatedAll = allRequests.map(req => 
      req.id === id ? { ...req, status, actionedBy: profile?.full_name } : req
    );
    localStorage.setItem('leave_requests', JSON.stringify(updatedAll));
    
    // Update local state
    if (currentCompany) {
      setRequests(updatedAll.filter(req => req.companyId === currentCompany.id));
    }
    
    addToast(`Request ${status}`, status === 'Approved' ? 'success' : 'info');
  };

  const canApprove = profile?.role === 'admin' || profile?.role === 'hr';

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No leave requests found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700 mb-2">Recent Requests</h3>
      {requests.map((req) => (
        <div key={req.id} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="font-medium text-slate-800 text-sm">{req.userName}</div>
              <div className="text-xs text-slate-500">{req.type}</div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
              ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                req.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 
                'bg-amber-100 text-amber-600'}
            `}>
              {req.status}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Clock size={12} />
            {req.startDate} to {req.endDate}
          </div>

          {req.status === 'Pending' && canApprove && (
            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-50">
              <button 
                onClick={() => handleAction(req.id, 'Approved')}
                className="flex-1 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <Check size={12} /> Approve
              </button>
              <button 
                onClick={() => handleAction(req.id, 'Rejected')}
                className="flex-1 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <X size={12} /> Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveApprovalList;
