import React, { useMemo } from 'react';
import Modal from '../shared/Modal';
import { useAuth } from '../../context/AuthContext';
import { Users, User, ChevronRight } from 'lucide-react';

const OrgChartModal = ({ isOpen, onClose }) => {
  const { currentCompany } = useAuth();

  const employees = useMemo(() => {
    if (!currentCompany) return [];
    const allStaff = JSON.parse(localStorage.getItem('staff_directory') || '[]');
    return allStaff.filter(s => s.companyId === currentCompany.id);
  }, [currentCompany, isOpen]);

  const departments = useMemo(() => {
    const deps = {};
    employees.forEach(emp => {
      const d = emp.department || 'Unassigned';
      if (!deps[d]) deps[d] = [];
      deps[d].push(emp);
    });
    return deps;
  }, [employees]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Organization Chart">
      <div className="space-y-6">
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
            {currentCompany?.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{currentCompany?.name}</h2>
          <p className="text-sm text-slate-500">{employees.length} Employees</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(departments).map(([deptName, staff]) => (
            <div key={deptName} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">{deptName}</h3>
                <span className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500">
                  {staff.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {staff.map(emp => (
                  <div key={emp.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {employees.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <Users size={48} className="mx-auto mb-3 opacity-20" />
            <p>No employees found to generate organization chart.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OrgChartModal;
