import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('ACCESS_DENIED');
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
                        Admin Portal <span className="text-brand italic font-normal">v1.0</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                        Tier-1 Auth Protocol
                    </p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-center text-[10px] font-black uppercase text-red-500 border-2 border-red-500/20 py-4">
                            System Error: {error}
                        </div>
                    )}
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 font-semibold uppercase tracking-widest ml-1">Username</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-brand transition-all text-white text-xs font-black"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/30 font-semibold uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-transparent border-b-2 border-white/10 py-4 outline-none focus:border-brand transition-all text-white text-xs font-black uppercase"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-6 bg-brand text-black font-black font-semibold uppercase tracking-[0.5em] text-xs hover:bg-green-500 hover:text-black transition-all border-2 border-brand"
                    >
                        {loading ? 'Initializing...' : 'Login'}
                    </button>
                    
                    <p className="text-center text-[10px] font-black font-bold text-white/20 uppercase tracking-widest">
                        New Identity? <Link to="/register" className="text-brand font-bold hover:underline">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
