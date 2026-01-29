import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, X } from 'lucide-react';

const EmployeeOnboardingModal = ({ isOpen, onClose, onRefresh, initialData, readOnly }) => {
  const { addToast } = useToast();
  const { currentCompany } = useAuth();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    emergencyContact: '',
    bloodGroup: '',
    presentAddress: '',
    permanentAddress: '',
    panNumber: '',
    aadharNumber: '',
    dateOfJoining: '',
    status: 'Active',
    workMode: 'Office', // Office or Remote
    salary: '',
    annualLeaves: '12',
    sickLeaves: '6',
  });

  const [files, setFiles] = useState({
    resume: null,
    aadharCard: null,
    panCard: null,
    other: null
  });

  // Load initial data if provided (Edit Mode)
  React.useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      // Reset form if no initialData (Add Mode)
      setForm({
        name: '', email: '', phone: '', role: '', department: '',
        emergencyContact: '', bloodGroup: '', presentAddress: '', permanentAddress: '',
        panNumber: '', aadharNumber: '', dateOfJoining: '', status: 'Active', workMode: 'Office',
        salary: '', annualLeaves: '12', sickLeaves: '6'
      });
      setFiles({ resume: null, aadharCard: null, panCard: null, other: null });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentCompany) {
      addToast('No active company found', 'error');
      return;
    }

    if (!form.name || !form.email || !form.role) {
      addToast('Please fill required fields (Name, Email, Role)', 'error');
      return;
    }

    const employeeData = {
      ...form,
      companyId: currentCompany.id,
      // In a real app, we would upload files to storage and get URLs.
      // Here we just simulate it by storing filenames if present.
      documents: {
        resume: files.resume ? files.resume.name : form.documents?.resume,
        aadharCard: files.aadharCard ? files.aadharCard.name : form.documents?.aadharCard,
        panCard: files.panCard ? files.panCard.name : form.documents?.panCard,
        other: files.other ? files.other.name : form.documents?.other
      }
    };

    const existingStaff = JSON.parse(localStorage.getItem('staff_directory') || '[]');
    let updatedStaff;

    if (initialData) {
      // Edit Mode
      updatedStaff = existingStaff.map(emp => emp.id === initialData.id ? { ...employeeData, id: initialData.id } : emp);
      addToast('Employee profile updated', 'success');
    } else {
      // Add Mode
      const newEmployee = {
        id: crypto.randomUUID(),
        ...employeeData,
        createdAt: new Date().toISOString()
      };
      updatedStaff = [newEmployee, ...existingStaff];
      addToast('Employee onboarded successfully', 'success');
    }

    localStorage.setItem('staff_directory', JSON.stringify(updatedStaff));

    if (onRefresh) onRefresh();
    onClose();
    
    if (!initialData) {
        setForm({
            name: '', email: '', phone: '', role: '', department: '',
            emergencyContact: '', bloodGroup: '', presentAddress: '', permanentAddress: '',
            panNumber: '', aadharNumber: '', dateOfJoining: '', status: 'Active', workMode: 'Office',
            salary: '', annualLeaves: '12', sickLeaves: '6'
        });
        setFiles({ resume: null, aadharCard: null, panCard: null, other: null });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? (readOnly ? "Employee Details" : "Edit Employee Profile") : "Onboard New Employee"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={readOnly} className="contents">
        
        {/* Personal Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name *</label>
              <input name="name" required value={form.name} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Emergency Contact</label>
              <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                <option value="">Select...</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date of Joining</label>
                <input name="dateOfJoining" type="date" value={form.dateOfJoining} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Work Details */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">Work Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Role *</label>
              <input name="role" required value={form.role} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
              <input name="department" value={form.department} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Work Mode</label>
              <select name="workMode" value={form.workMode} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                <option value="Office">Office</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Monthly Salary</label>
              <input name="salary" type="number" value={form.salary} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. 50000" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Annual Leaves</label>
              <input name="annualLeaves" type="number" value={form.annualLeaves} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Sick Leaves</label>
              <input name="sickLeaves" type="number" value={form.sickLeaves} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Address & Identity */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">Address & Identity</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Present Address</label>
              <textarea name="presentAddress" rows="2" value={form.presentAddress} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Permanent Address</label>
              <textarea name="permanentAddress" rows="2" value={form.permanentAddress} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">PAN Number</label>
                <input name="panNumber" value={form.panNumber} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Aadhar Number</label>
                <input name="aadharNumber" value={form.aadharNumber} onChange={handleChange} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3 border-b pb-2">Documents Upload</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {['resume', 'aadharCard', 'panCard', 'other'].map((doc) => (
               <div key={doc} className="border border-dashed border-slate-300 rounded-lg p-3 text-center">
                 <label className="cursor-pointer block">
                   <Upload size={16} className="mx-auto text-slate-400 mb-1" />
                   <span className="text-xs text-slate-600 capitalize block">{doc.replace(/([A-Z])/g, ' $1').trim()}</span>
                   <input type="file" name={doc} onChange={handleFileChange} className="hidden" />
                 </label>
                 {files[doc] && (
                   <div className="text-[10px] text-emerald-600 mt-1 truncate">
                     {files[doc].name}
                   </div>
                 )}
               </div>
             ))}
          </div>
        </div>

        </fieldset>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm">
            {readOnly ? 'Close' : 'Cancel'}
          </button>
          {!readOnly && (
            <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">
              {initialData ? 'Update Profile' : 'Onboard Employee'}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeOnboardingModal;