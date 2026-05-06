import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequest } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            setError('PROTOCOL_MISMATCH: Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await registerRequest({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            navigate('/login');
        } catch (err) {
            setError('SYSTEM_REJECTION: Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-12">
            <div className="max-w-md w-full space-y-12">
                <div className="space-y-4 text-center">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-6 object-contain" />
                    <h2 className="text-4xl font-black text-white">
                        Join Portal <span className="text-brand italic font-normal">v1.0</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                        Tier-1 Registration Protocol
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-center text-[10px] font-black uppercase text-red-500 border-2 border-red-500/20 py-4">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 font-semibold uppercase tracking-widest ml-1">Username</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-brand transition-all text-white text-xs font-black"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 font-semibold uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-brand transition-all text-white text-xs font-black"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 font-semibold uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-brand transition-all text-white text-xs font-black uppercase"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 font-semibold uppercase tracking-widest ml-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-brand transition-all text-white text-xs font-black uppercase"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 bg-brand text-black font-black font-semibold uppercase tracking-[0.5em] text-xs hover:bg-green-500 hover:text-black transition-all border-2 border-brand"
                        >
                            {loading ? 'Processing...' : 'REGISTER'}
                        </button>
                    </div>
                    
                    <p className="text-center text-[10px] font-black text-white/20 uppercase font-bold tracking-widest">
                        Already authorized? <Link to="/login" className="text-brand font-bold hover:underline">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
