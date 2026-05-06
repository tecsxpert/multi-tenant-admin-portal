import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTenant, aiDescribe, aiRecommend, deleteTenant } from '../services/api';
import SparkleLoader from '../components/SparkleLoader';
import AiResultModal from '../components/AiResultModal';

const TenantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    useEffect(() => {
        fetchTenant();
    }, [id]);

    const fetchTenant = async () => {
        try {
            setLoading(true);
            const response = await getTenant(id);
            setTenant(response.data);
            setLoading(false);
        } catch (error) {
            // DUMMY DATA FALLBACK
            setTenant({
                id: id,
                name: 'Acme Core Node',
                description: 'Primary high-availability cluster serving the North Atlantic region. Handles distributed isolation protocols and real-time matrix synchronization.',
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            setLoading(false);
        }
    };

    const handleAiDescribe = async () => {
        setAiLoading(true);
        try {
            const response = await aiDescribe(id);
            setAiResult({ type: 'DESCRIBE', content: response.data.description });
        } catch (error) {
            setAiResult({ type: 'ERROR', content: 'AI Engine Offline: Description Sync Failed.' });
        } finally {
            setAiLoading(false);
        }
    };

    const handleAiRecommend = async () => {
        setAiLoading(true);
        try {
            const response = await aiRecommend();
            setAiResult({ type: 'RECOMMEND', content: response.data });
        } catch (error) {
            setAiResult({ type: 'ERROR', content: 'AI Engine Offline: Recommendations Sync Failed.' });
        } finally {
            setAiLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("CRITICAL: Authorize soft-delete for this node?")) {
            try {
                await deleteTenant(id);
                navigate('/tenants');
            } catch (error) {
                alert("Protocol Error: Node isolation failed.");
            }
        }
    };

    if (loading || !tenant) return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <SparkleLoader text="Scanning Node Matrix..." />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
            {/* HEADER AREA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-l-8 border-[#078446] pl-8 py-4">
                <div>
                    <h1 className="text-6xl font-black text-white font-bold leading-none">
                        Node Profile
                    </h1>
                    <p className="text-sm font-bold text-[#078446] uppercase tracking-[0.3em] mt-3">
                        Partition Index: {tenant.id}
                    </p>
                </div>
                <div className="flex space-x-4">
                    <Link 
                        to="/tenants" 
                        className="text-xs font-black text-white/40 hover:text-white font-bold transition-colors py-3 px-6 border border-white/10 rounded-xl"
                    >
                        Return to Registry
                    </Link>
                    <Link 
                        to={`/edit/${tenant.id}`} 
                        className="bg-[#078446] text-black text-xs font-bold px-8 py-3 rounded-xl hover:bg-green-500 transition-all shadow-xl shadow-[#078446]/20"
                    >
                        Modify Node
                    </Link>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/5 border border-white/5 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <span className="text-8xl font-black">{tenant.status?.[0] || 'N'}</span>
                        </div>
                        <div className="space-y-6">
                            <span className={`inline-block px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 ${tenant.status === 'ACTIVE' ? 'bg-[#078446] text-black border-[#078446]' : 'border-white/20 text-white/50'}`}>
                                Protocol: {tenant.status}
                            </span>
                            <h2 className="text-4xl font-black text-white font-bold">{tenant.name}</h2>
                            <p className="text-lg text-white/60 leading-relaxed font-medium italic">
                                "{tenant.description}"
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-10 rounded-[2.5rem] grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Provisioned On</h4>
                            <p className="text-sm font-bold text-white">{new Date(tenant.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Last Sync</h4>
                            <p className="text-sm font-bold text-white">{new Date(tenant.updatedAt).toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* ACTION CENTER SIDEBAR */}
                <div className="space-y-6">
                    <div className="bg-[#0a1205] border border-[#078446]/30 p-10 rounded-[2.5rem] space-y-8">
                        <h3 className="text-xs font-black text-[#078446] uppercase tracking-[0.4em]">Action Center</h3>
                        
                        <div className="space-y-4">
                            <button 
                                onClick={handleAiDescribe}
                                className="w-full bg-white/5 border border-[#078446]/30 text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#078446] hover:text-black transition-all cursor-pointer"
                            >
                                AI Describe Node
                            </button>
                            <button 
                                onClick={handleAiRecommend}
                                className="w-full bg-[#078446] text-black py-4 rounded-2xl font-black text-sm hover:bg-green-500 transition-all cursor-pointer shadow-lg shadow-[#078446]/20"
                            >
                                Get AI Recommendations
                            </button>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <button 
                                onClick={handleDelete}
                                className="w-full bg-red-600/10 border border-red-500/20 text-red-500 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                            >
                                Delete Node
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI RESULT MODAL — Extracted Component */}
            <AiResultModal result={aiResult} onClose={() => setAiResult(null)} />

            {/* AI LOADING OVERLAY */}
            {aiLoading && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0a1205]/60 backdrop-blur-sm">
                    <SparkleLoader text="AI Engine: Synthesizing Protocol Intelligence..." />
                </div>
            )}
        </div>
    );
};

export default TenantDetail;
