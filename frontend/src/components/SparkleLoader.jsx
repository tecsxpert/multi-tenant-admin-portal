import React from 'react';

const SparkleLoader = ({ text = "Synchronizing..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <div className="w-20 h-20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" role="img" aria-label="Sparkle">
                    <title>Sparkle</title>
                    <desc>Independent dots twinkle on a deterministic loop.</desc>
                    <defs>
                        <circle id="b" r="2.4" fill="currentColor" opacity="0.1"/>
                        <circle id="l" r="3.1"/>
                    </defs>
                    <style>{`
                        .l { fill: #078446; opacity: 0; animation: icon-09-k 2600ms cubic-bezier(0.65, 0, 0.35, 1) infinite both; }
                        @keyframes icon-09-k { 0% { opacity: 0.05; } 40% { opacity: 0.05; } 50% { opacity: 1; } 60% { opacity: 0.05; } 100% { opacity: 0.05; } }
                        .d00 { animation-delay: 0ms; } .d01 { animation-delay: 2283ms; } .d02 { animation-delay: 1617ms; } .d03 { animation-delay: 1466ms; } .d04 { animation-delay: 31ms; }
                        .d10 { animation-delay: 2106ms; } .d11 { animation-delay: 296ms; } .d12 { animation-delay: 1206ms; } .d13 { animation-delay: 333ms; } .d14 { animation-delay: 2241ms; }
                        .d20 { animation-delay: 1929ms; } .d21 { animation-delay: 967ms; } .d22 { animation-delay: 1238ms; } .d23 { animation-delay: 1004ms; } .d24 { animation-delay: 2252ms; }
                        .d30 { animation-delay: 1955ms; } .d31 { animation-delay: 2517ms; } .d32 { animation-delay: 1139ms; } .d33 { animation-delay: 1076ms; } .d34 { animation-delay: 1362ms; }
                        .d40 { animation-delay: 2132ms; } .d41 { animation-delay: 920ms; } .d42 { animation-delay: 1274ms; } .d43 { animation-delay: 1310ms; } .d44 { animation-delay: 1019ms; }
                    `}</style>
                    <use href="#b" x="6" y="6"/><use href="#b" x="17" y="6"/><use href="#b" x="28" y="6"/><use href="#b" x="39" y="6"/><use href="#b" x="50" y="6"/>
                    <use href="#b" x="6" y="17"/><use href="#b" x="17" y="17"/><use href="#b" x="28" y="17"/><use href="#b" x="39" y="17"/><use href="#b" x="50" y="17"/>
                    <use href="#b" x="6" y="28"/><use href="#b" x="17" y="28"/><use href="#b" x="28" y="28"/><use href="#b" x="39" y="28"/><use href="#b" x="50" y="28"/>
                    <use href="#b" x="6" y="39"/><use href="#b" x="17" y="39"/><use href="#b" x="28" y="39"/><use href="#b" x="39" y="39"/><use href="#b" x="50" y="39"/>
                    <use href="#b" x="6" y="50"/><use href="#b" x="17" y="50"/><use href="#b" x="28" y="50"/><use href="#b" x="39" y="50"/><use href="#b" x="50" y="50"/>
                    <use className="l d00" href="#l" x="6" y="6"/><use className="l d01" href="#l" x="17" y="6"/><use className="l d02" href="#l" x="28" y="6"/><use className="l d03" href="#l" x="39" y="6"/><use className="l d04" href="#l" x="50" y="6"/>
                    <use className="l d10" href="#l" x="6" y="17"/><use className="l d11" href="#l" x="17" y="17"/><use className="l d12" href="#l" x="28" y="17"/><use className="l d13" href="#l" x="39" y="17"/><use className="l d14" href="#l" x="50" y="17"/>
                    <use className="l d20" href="#l" x="6" y="28"/><use className="l d21" href="#l" x="17" y="28"/><use className="l d22" href="#l" x="28" y="28"/><use className="l d23" href="#l" x="39" y="28"/><use className="l d24" href="#l" x="50" y="28"/>
                    <use className="l d30" href="#l" x="6" y="39"/><use className="l d31" href="#l" x="17" y="39"/><use className="l d32" href="#l" x="28" y="39"/><use className="l d33" href="#l" x="39" y="39"/><use className="l d34" href="#l" x="50" y="39"/>
                    <use className="l d40" href="#l" x="6" y="50"/><use className="l d41" href="#l" x="17" y="50"/><use className="l d42" href="#l" x="28" y="50"/><use className="l d43" href="#l" x="39" y="50"/><use className="l d44" href="#l" x="50" y="50"/>
                </svg>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-[#078446] animate-pulse">{text}</p>
        </div>
    );
};

export default SparkleLoader;
