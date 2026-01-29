import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Search, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const InventoryModal = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hardware',
    quantity: 1,
    value: '',
    status: 'In Stock',
    location: 'Main Office'
  });

  useEffect(() => {
    if (isOpen) {
      const savedItems = localStorage.getItem('inventory_items');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      } else {
        // Mock data for demo
        const mockItems = [
          { id: 1, name: 'MacBook Pro M3', category: 'Hardware', quantity: 5, value: 12500, status: 'In Stock', location: 'Design Studio' },
          { id: 2, name: 'Canon R5 Camera', category: 'Equipment', quantity: 2, value: 3800, status: 'In Use', location: 'Media Room' },
          { id: 3, name: 'Adobe CC License', category: 'Software', quantity: 25, value: 1200, status: 'Active', location: 'Digital' },
        ];
        setItems(mockItems);
        localStorage.setItem('inventory_items', JSON.stringify(mockItems));
      }
    }
  }, [isOpen]);

  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem('inventory_items', JSON.stringify(newItems));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      const updatedItems = items.map(item => 
        item.id === editingItem.id ? { ...formData, id: item.id } : item
      );
      saveItems(updatedItems);
      addToast('Item updated successfully', 'success');
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
      };
      saveItems([...items, newItem]);
      addToast('Item added to inventory', 'success');
    }
    
    closeForm();
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== id);
      saveItems(updatedItems);
      addToast('Item removed', 'info');
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Hardware',
      quantity: 1,
      value: '',
      status: 'In Stock',
      location: 'Main Office'
    });
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Global Inventory</h2>
              <p className="text-sm text-slate-500">Manage assets, equipment, and licenses</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {isFormOpen ? (
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-slate-800">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                <button onClick={closeForm} className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="e.g. Dell XPS 15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option>Hardware</option>
                      <option>Software</option>
                      <option>Furniture</option>
                      <option>Equipment</option>
                      <option>Office Supplies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                    <input 
                      type="number" 
                      min="1"
                      required
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Value (per unit)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">$</span>
                      <input 
                        type="number" 
                        min="0"
                        required
                        value={formData.value}
                        onChange={e => setFormData({...formData, value: e.target.value})}
                        className="w-full p-3 pl-8 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option>In Stock</option>
                      <option>In Use</option>
                      <option>Maintenance</option>
                      <option>Retired</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="e.g. Server Room, Shelf A2"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeForm} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-100 flex gap-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search inventory..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/10"
                >
                  <Plus size={18} /> Add Item
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <Package size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No items found matching your search.</p>
                    </div>
                  ) : (
                    filteredItems.map(item => (
                      <div key={item.id} className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${
                            item.category === 'Hardware' ? 'bg-blue-100 text-blue-600' :
                            item.category === 'Software' ? 'bg-purple-100 text-purple-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800">{item.name}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.category}</span>
                              <span>• {item.location}</span>
                              <span>• ${item.value}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="font-bold text-slate-900">{item.quantity} Units</div>
                            <div className={`text-xs font-medium flex items-center justify-end gap-1 ${
                              item.status === 'In Stock' ? 'text-emerald-600' : 
                              item.status === 'In Use' ? 'text-amber-600' : 'text-slate-400'
                            }`}>
                              {item.status === 'In Stock' && <CheckCircle size={12} />}
                              {item.status}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEdit(item)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;