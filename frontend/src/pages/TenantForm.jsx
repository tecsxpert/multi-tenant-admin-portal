import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getTenant, createTenant, updateTenant } from '../services/api';
import CustomDropdown from '../components/CustomDropdown';

const TenantForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'ACTIVE'
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const statusOptions = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'SUSPENDED', label: 'Suspended' },
    ];

    useEffect(() => {
        if (isEditMode) {
            fetchTenant();
        }
    }, [id]);

    const fetchTenant = async () => {
        try {
            const response = await getTenant(id);
            setFormData(response.data);
        } catch (error) {
            console.error("Failed to fetch tenant", error);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Identification name is required';
        if (formData.name.length < 3) newErrors.name = 'Identification must be at least 3 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (isEditMode) {
                await updateTenant(id, formData);
            } else {
                await createTenant(formData);
            }
            navigate('/tenants');
        } catch (error) {
            console.error("Failed to save tenant", error);
            setErrors({ submit: 'Protocol Violation: Node name must be unique.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="mb-12 flex items-center justify-between border-l-8 border-[#078446] pl-8">
                <div>
                    <h1 className="text-5xl font-black text-white font-bold">
                        {isEditMode ? 'Modify Node' : 'Provision Node'}
                    </h1>
                    <p className="text-sm font-bold text-white/40 mt-1">
                        Node Identity & Protocol Configuration
                    </p>
                </div>
                <Link to="/tenants" className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                    ← Back to Registry
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 bg-white/5 p-12 rounded-[3rem] border border-white/5 shadow-2xl">
                {errors.submit && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest">
                        ⚠ {errors.submit}
                    </div>
                )}
                
                <div className="space-y-3">
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest ml-1">Node Identification</label>
                    <input
                        type="text"
                        placeholder="e.g. ALPHA_TERMINAL_01"
                        className={`w-full bg-white/5 border-2 rounded-2xl px-6 py-4 outline-none focus:border-[#078446] transition-all font-semibold text-white text-lg ${errors.name ? 'border-red-500/50' : 'border-white/5'}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors.name}</p>}
                </div>

                <div className="space-y-3">
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest ml-1">Description & Metadata</label>
                    <textarea
                        placeholder="Define the primary function of this node..."
                        className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#078446] transition-all font-medium text-white min-h-[120px]"
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <div className="space-y-3">
                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest ml-1">Protocol Status</label>
                    <CustomDropdown 
                        options={statusOptions} 
                        value={formData.status} 
                        onChange={(val) => setFormData({ ...formData, status: val })} 
                    />
                </div>

                <div className="pt-8 flex items-center justify-end space-x-6 border-t border-black/5 dark:border-white/10">
                    <button
                        type="button"
                        onClick={() => navigate('/tenants')}
                        className="bg-red-600/10 hover:bg-red-600 border-2 border-red-500/20 text-red-500 hover:text-white px-12 py-4 rounded-2xl font-black font-bold text-lg transition-all cursor-pointer"
                    >
                        Abort Action
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#078446] text-black px-12 py-4 rounded-2xl font-black font-bold text-lg hover:bg-green-500 transition-all disabled:opacity-20 cursor-pointer shadow-xl shadow-[#078446]/20"
                    >
                        {loading ? 'Processing...' : (isEditMode ? 'Authorize Update' : 'Initialize Node')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TenantForm;
