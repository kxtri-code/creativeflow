import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import StaffDirectory from '../components/hr/StaffDirectory';
import LeaveCalendar from '../components/hr/LeaveCalendar';
import LeaveRequestModal from '../components/hr/LeaveRequestModal';
import LeaveApprovalList from '../components/hr/LeaveApprovalList';
import EmployeeOnboardingModal from '../components/hr/EmployeeOnboardingModal';
import OrgChartModal from '../components/hr/OrgChartModal';
import PayrollModule from '../components/hr/PayrollModule';
import RecruitmentBoard from '../components/hr/RecruitmentBoard';
import HRExpenseLogger from '../components/hr/HRExpenseLogger';

const HRHub = () => {
  const { addToast } = useToast();
  const { profile } = useAuth();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isOrgChartOpen, setIsOrgChartOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('directory'); // directory | recruitment | payroll | expenses
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleOnboardClick = () => {
    setEditingEmployee(null);
    setIsOnboardingModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsOnboardingModalOpen(true);
  };

  const canOnboard = profile?.role === 'admin' || profile?.role === 'hr';

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">People & HR</h1>
          <p className="text-slate-500">Staff directory, payroll, and goal tracking.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {canOnboard && (
            <button 
              onClick={handleOnboardClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex-1 lg:flex-none whitespace-nowrap"
            >
              Onboard Employee
            </button>
          )}
          <button 
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all flex-1 lg:flex-none whitespace-nowrap"
          >
            Apply for Leave
          </button>
          <button 
            onClick={() => setIsOrgChartOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex-1 lg:flex-none whitespace-nowrap"
          >
            View Org Chart
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4 border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('directory')}
          className={`pb-2 px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'directory' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Team Directory
          {activeTab === 'directory' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('recruitment')}
          className={`pb-2 px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'recruitment' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Recruitment
          {activeTab === 'recruitment' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('payroll')}
          className={`pb-2 px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'payroll' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Payroll & Salaries
          {activeTab === 'payroll' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('expenses')}
          className={`pb-2 px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'expenses' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Expenses & Budget
          {activeTab === 'expenses' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8 h-full min-h-[500px]">
          {activeTab === 'directory' && (
            <StaffDirectory 
              refreshTrigger={refreshTrigger} 
              onOnboard={handleOnboardClick}
              onEdit={handleEditEmployee}
              canOnboard={canOnboard}
            />
          )}
          {activeTab === 'recruitment' && <RecruitmentBoard />}
          {activeTab === 'payroll' && <PayrollModule />}
          {activeTab === 'expenses' && <HRExpenseLogger />}
        </div>

        {/* Sidebar - Leave & Goals */}
        <div className="col-span-12 lg:col-span-4 h-full min-h-[500px] flex flex-col gap-6 overflow-y-auto pr-2">
          <LeaveApprovalList refreshTrigger={refreshTrigger} />
          <LeaveCalendar />
        </div>
      </div>

      <LeaveRequestModal 
        isOpen={isLeaveModalOpen} 
        onClose={() => setIsLeaveModalOpen(false)} 
        onRefresh={handleRefresh}
      />
      
      <EmployeeOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onRefresh={handleRefresh}
        initialData={editingEmployee}
        readOnly={!canOnboard}
      />

      <OrgChartModal 
        isOpen={isOrgChartOpen}
        onClose={() => setIsOrgChartOpen(false)}
      />
    </div>
  );
};

export default HRHub;
