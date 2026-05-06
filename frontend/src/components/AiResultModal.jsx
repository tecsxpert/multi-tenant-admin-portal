import React from 'react';

/**
 * AiResultModal — Glassmorphic overlay to display AI Describe/Recommend results.
 * @param {{ type: string, content: string|string[] }} result - The AI response
 * @param {function} onClose - Callback to dismiss the modal
 */
const AiResultModal = ({ result, onClose }) => {
    if (!result) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="max-w-2xl w-full bg-[#0a1205] border border-[#078446]/30 rounded-[3rem] p-12 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-8 border-l-4 border-[#078446] pl-6">
                    <div>
                        <h2 className="text-3xl font-black text-white font-bold">AI Intelligence Result</h2>
                        <p className="text-xs font-bold text-[#078446] uppercase tracking-widest mt-1">{result.type}</p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white text-2xl cursor-pointer">×</button>
                </div>
                
                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-white/90 leading-relaxed font-medium">
                    {Array.isArray(result.content) ? (
                        <ul className="space-y-4">
                            {result.content.map((rec, i) => (
                                <li key={i} className="flex items-start space-x-4">
                                    <span className="text-[#078446] font-black">0{i+1}.</span>
                                    <span>{rec}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="italic">"{result.content}"</p>
                    )}
                </div>

                <button 
                    onClick={onClose}
                    className="mt-8 w-full bg-[#078446] text-black py-4 rounded-2xl font-black font-bold uppercase tracking-widest hover:bg-green-400 transition-all cursor-pointer"
                >
                    Acknowledge & Close
                </button>
            </div>
        </div>
    );
};

export default AiResultModal;
