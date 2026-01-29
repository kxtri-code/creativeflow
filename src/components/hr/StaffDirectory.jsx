import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Phone, MapPin, Building, Home, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const StaffDirectory = ({ refreshTrigger, onOnboard, onEdit, canOnboard }) => {
  const { currentCompany } = useAuth();
  const { addToast } = useToast();
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const loadStaff = () => {
      const storedStaff = JSON.parse(localStorage.getItem('staff_directory') || '[]');
      setStaff(storedStaff);
    };
    loadStaff();
  }, [refreshTrigger]);

  const companyStaff = useMemo(() => {
    if (!currentCompany) return [];
    return staff.filter(s => s.companyId === currentCompany.id);
  }, [staff, currentCompany]);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    const updatedStaff = staff.filter(s => s.id !== id);
    setStaff(updatedStaff);
    localStorage.setItem('staff_directory', JSON.stringify(updatedStaff));
    addToast('Employee deleted successfully', 'success');
  };

  if (!currentCompany) {
    return <div className="p-6 text-center text-slate-500">Please select a company to view directory.</div>;
  }

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">Team Directory</h2>
          <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-lg text-slate-500">
            {companyStaff.length} Employees
          </span>
        </div>
        {canOnboard && (
          <button 
            onClick={onOnboard}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Employee</span>
          </button>
        )}
      </div>

      {companyStaff.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <p>No employees found for {currentCompany.name}.</p>
          {canOnboard && (
             <button onClick={onOnboard} className="mt-2 text-indigo-600 hover:underline text-sm font-medium">
               Onboard your first employee
             </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {companyStaff.map((person) => (
            <div key={person.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg hover:border-indigo-100 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-500 relative">
                  {person.name.charAt(0)}
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                    ${person.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}
                  `}></span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{person.name}</h3>
                  <p className="text-xs text-indigo-600 font-medium">{person.role}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail size={12} /> {person.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone size={12} /> {person.phone || 'N/A'}
                </div>
                {person.workMode && (
                  <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-md w-fit
                    ${person.workMode === 'Remote' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}
                  `}>
                    {person.workMode === 'Remote' ? <Home size={12} /> : <Building size={12} />}
                    {person.workMode}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-slate-50">
                <button 
                  onClick={() => onEdit && onEdit(person)}
                  className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                  title="View/Edit Profile"
                >
                  <Eye size={14} /> View
                </button>
                {canOnboard && (
                  <>
                    <button 
                      onClick={() => onEdit && onEdit(person)}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                      title="Edit Profile"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(person.id)}
                      className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                      title="Delete Employee"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDirectory;
