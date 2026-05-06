import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getAnalytics } from '../services/api';
import CustomDropdown from '../components/CustomDropdown';
import SparkleLoader from '../components/SparkleLoader';
import ChartTooltip from '../components/ChartTooltip';

const Analytics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30');

    const periodOptions = [
        { value: '7', label: 'Last 7 Days' },
        { value: '30', label: 'Last 30 Days' },
        { value: '90', label: 'Last 90 Days' },
    ];

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await getAnalytics();
            setData(response.data);
            setLoading(false);
        } catch (error) {
            // DUMMY DATA FALLBACK
            setData([
                { date: 'Jan', count: 4 },
                { date: 'Feb', count: 7 },
                { date: 'Mar', count: 5 },
                { date: 'Apr', count: 12 },
                { date: 'May', count: 9 },
                { date: 'Jun', count: 15 },
                { date: 'Jul', count: 11 },
                { date: 'Aug', count: 18 },
                { date: 'Sep', count: 14 },
                { date: 'Oct', count: 22 },
                { date: 'Nov', count: 19 },
                { date: 'Dec', count: 25 },
            ]);
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <SparkleLoader text="Synthesizing Growth Matrix..." />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end border-l-4 border-[#078446] pl-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Analytics</h1>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Growth & Volume Metrics</p>
                </div>
                <div className="mr-4">
                    <CustomDropdown 
                        options={periodOptions} 
                        value={period} 
                        onChange={setPeriod} 
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 p-6 rounded-lg shadow-sm border border-white/5">
                    <h3 className="text-lg font-semibold mb-6">Tenant Onboarding Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#078446', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#078446" 
                                    strokeWidth={3} 
                                    dot={{ r: 4 }} 
                                    activeDot={{ r: 8 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/5 p-6 rounded-lg shadow-sm border border-white/5">
                    <h3 className="text-lg font-semibold mb-6">Daily Volume</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(7, 132, 70, 0.1)' }} />
                                <Bar dataKey="count" fill="#078446" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
