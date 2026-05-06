import React from 'react';

/**
 * KPICard — Dashboard stat card with optional accent highlight.
 * @param {string} title - Label text
 * @param {number|string} value - Stat value
 * @param {boolean} accent - Whether this card uses the brand accent style
 * @param {string} icon - Emoji icon
 */
const KPICard = ({ title, value, accent, icon }) => {
    return (
        <div className={`p-8 rounded-[2rem] border transition-all ${
            accent 
            ? 'bg-brand border-brand shadow-xl shadow-brand/10' 
            : 'bg-white/5 border-white/10 hover:border-brand'
        }`}>
            <div className="flex justify-between items-center mb-4">
                <span className={`text-xl ${accent ? 'text-black' : ''}`}>{icon}</span>
                <p className={`text-xs font-bold uppercase tracking-widest ${accent ? 'text-black/60' : 'text-white/40'}`}>{title}</p>
            </div>
            <p className={`text-5xl font-black ${accent ? 'text-black' : 'text-white'}`}>{value}</p>
        </div>
    );
};

export default KPICard;
