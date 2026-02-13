
import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  X,
  Lock,
  Building,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';

interface Props {
  users: UserProfile[];
  onAddUser: (user: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  onUpdateUser: (id: string, updates: Partial<UserProfile>) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<Props> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    fileNumber: '',
    password: '',
    role: 'officer' as 'admin' | 'officer',
    department: ''
  });

  const resetForm = () => {
    setFormData({ name: '', fileNumber: '', password: '', role: 'officer', department: '' });
    setEditingUser(null);
  };

  const handleOpenEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      fileNumber: user.fileNumber,
      password: user.password,
      role: user.role,
      department: user.department
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUser(editingUser.id, formData);
    } else {
      onAddUser(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personnel Management</h2>
          <p className="text-sm text-slate-500 font-medium">Control official access to investigative assets.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search officers..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-red-50 focus:border-red-400 w-72 shadow-sm transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-200 transition-all flex items-center gap-2"
          >
            <UserPlus size={18} /> Add Officer
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-md z-10 border-b border-slate-200">
            <tr>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Full Name & File #</th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Role</th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Added Date</th>
              <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-red-50/40 transition-all group">
                <td className="p-5 pl-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all shadow-sm ${user.role === 'admin' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-red-600'}`}>
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="block text-sm font-black text-slate-800">{user.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.fileNumber}</span>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="text-sm font-bold text-slate-700">{user.department}</span>
                </td>
                <td className="p-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                    {user.role === 'admin' ? <ShieldAlert size={10} /> : <ShieldCheck size={10} />}
                    {user.role}
                  </div>
                </td>
                <td className="p-5">
                  <span className="text-xs font-medium text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="p-5 text-right pr-8">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenEdit(user)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-xl text-red-600">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{editingUser ? 'Update Officer' : 'New Officer Record'}</h3>
                  <p className="text-xs text-slate-400 font-medium">Investigative access control system</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:border-red-500 outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File Number</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:border-red-500 outline-none transition-all"
                      value={formData.fileNumber}
                      onChange={(e) => setFormData({...formData, fileNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:border-red-500 outline-none transition-all"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:border-red-500 outline-none transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                  <div className="flex p-1 bg-slate-100 rounded-2xl border-2 border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, role: 'officer'})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === 'officer' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
                    >
                      Field Officer
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, role: 'admin'})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.role === 'admin' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400'}`}
                    >
                      Administrator
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> {editingUser ? 'Save Updates' : 'Authorize Personnel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
