import React from 'react';

/**
 * ChartTooltip — Custom Recharts tooltip matching the Tier-1 green aesthetic.
 * @param {boolean} active - Whether the tooltip is active
 * @param {Array} payload - Recharts payload data
 * @param {string} label - X-axis label (e.g. month name)
 */
const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0a1205] border border-[#078446]/30 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">{label}</p>
                <p className="text-2xl font-black text-white">
                    {payload[0].value} <span className="text-xs font-bold text-[#078446] ml-1">Nodes</span>
                </p>
            </div>
        );
    }
    return null;
};

export default ChartTooltip;
