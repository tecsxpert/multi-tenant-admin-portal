import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getStats, getAuditLogs } from '../services/api';
import SparkleLoader from '../components/SparkleLoader';
import KPICard from '../components/KPICard';
import ActivityItem from '../components/ActivityItem';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchStats(), fetchLogs()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await getStats();
            setStats(response.data);
        } catch (error) {
            setStats({
                totalTenants: 15,
                activeTenants: 10,
                suspendedTenants: 3,
                deletedTenants: 2,
                statusDistribution: { ACTIVE: 10, SUSPENDED: 3, INACTIVE: 2 }
            });
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await getAuditLogs(0, 5);
            setLogs(response.data.content);
        } catch (error) {
            // DUMMY LOGS FALLBACK
            setLogs([
                { id: 1, action: 'NODE_OPTIMIZED', entityId: 241, createdAt: new Date() },
                { id: 2, action: 'NODE_PROVISIONED', entityId: 112, createdAt: new Date() },
                { id: 3, action: 'ISOLATION_PROTOCOL', entityId: 88, createdAt: new Date() }
            ]);
        }
    };

    if (loading || !stats) return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <SparkleLoader text="Initializing Orchestration Matrix..." />
        </div>
    );

    const chartData = Object.keys(stats.statusDistribution).map(key => ({
        name: key,
        value: stats.statusDistribution[key]
    }));

    const maxIndex = chartData.reduce((maxIdx, current, idx, arr) => 
        current.value > arr[maxIdx].value ? idx : maxIdx, 0);

    const getCellColor = (index) => {
        if (index === maxIndex) return '#078446';
        const others = ['#0f2d1dff', '#4a594bff', '#007B5F', '#007B5F'];
        return others[index % others.length];
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0a1205] border border-[#078446]/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{payload[0].name}</p>
                    </div>
                    <p className="text-2xl font-black text-white">
                        {payload[0].value} <span className="text-xs font-bold text-white/30 uppercase ml-1">Nodes</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-12">
            
            {/* MAIN HEADER */}
            <section className="border-l-8 border-brand pl-12 py-8 bg-white/5 rounded-r-[3rem]">
                <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 text-white uppercase tracking-tighter">
                    Multi-Tenant <br />
                    <span className="text-brand">Orchestration</span>
                </h1>
                <p className="max-w-xl text-lg font-medium text-white/60 leading-relaxed italic">
                    Universal control layer for distributed enterprise nodes. <br />
                    Providing absolute isolation and real-time observability.
                </p>
            </section>
            
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Nodes" value={stats.totalTenants} accent={true} icon="🏢" />
                <KPICard title="Operational" value={stats.activeTenants} icon="⚡" />
                <KPICard title="Restricted" value={stats.suspendedTenants} icon="🔒" />
                <KPICard title="Archived" value={stats.deletedTenants} icon="📂" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Status Distribution Chart */}
                <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white">Status Matrix</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getCellColor(index)} cornerRadius={10} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    content={<CustomTooltip />} 
                                    animationDuration={200}
                                    animationEasing="ease-out"
                                    wrapperStyle={{ 
                                        transition: 'left 150ms ease-out, top 150ms ease-out',
                                        pointerEvents: 'none',
                                        zIndex: 50
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Dynamic Legend */}
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {chartData.map((entry, i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getCellColor(i) }} />
                                <div className="flex justify-between w-full items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{entry.name}</span>
                                    <span className="text-xs font-black text-white">{entry.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Operation Feed */}
                <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold text-white">Operation Feed</h3>
                    <div className="space-y-4">
                        {logs.length > 0 ? (
                            logs.map(log => (
                                <ActivityItem key={log.id} log={log} />
                            ))
                        ) : (
                            <p className="text-xs font-bold text-white/20 uppercase tracking-widest text-center py-10">
                                No activity recorded
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
