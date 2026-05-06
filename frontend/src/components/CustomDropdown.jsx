import React, { useState } from 'react';

const CustomDropdown = ({ options, value, onChange, placeholder = "Select option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    return (
        <div className="relative w-full font-schibsted min-w-[180px]">
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/5 border border-white/10 px-5 py-4 rounded-2xl text-sm font-semibold text-white flex justify-between items-center hover:bg-white/10 transition-all cursor-pointer focus:ring-2 focus:ring-[#078446]/50"
            >
                <span className={value ? 'text-white' : 'text-white/30'}>{selectedLabel}</span>
                <span className={`transition-transform duration-300 text-[#078446] ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full mt-3 w-full bg-[#0a1205] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
                        {options.map((opt) => (
                            <div 
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`px-5 py-4 text-sm font-medium cursor-pointer transition-colors ${
                                    value === opt.value 
                                    ? 'bg-[#078446] text-black font-extrabold' 
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomDropdown;
