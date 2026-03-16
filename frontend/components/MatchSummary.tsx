import { motion, AnimatePresence } from "framer-motion";
import { PartyMatchResult } from "../utils/matchCalculator";
import { MatchBill, PartyStance } from "../types";
import { ArrowRight, Trophy, Users, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import BillCommentSection from "./BillCommentSection";
import { mockComments } from "../data/mockMatchData";
import { useState } from "react";

interface MatchSummaryProps {
    results: PartyMatchResult[];
    userVotes: Record<string, PartyStance>;
    bills: MatchBill[];
    onRestart: () => void;
    isMock?: boolean;
}

const getPartyLogo = (name: string) => {
    const logoMap: Record<string, string> = {
        "ประชาชน": "/partys/ประชาชน.jpg",
        "เพื่อไทย": "/partys/เพื่อไทย.jpg",
        "ภูมิใจไทย": "/partys/ภูมิใจไทย.jpg",
        "ประชาธิปัตย์": "/partys/ประชาธิปัตย์.jpg",
        "รวมไทยสร้างชาติ": "/partys/รวมไทยสร้างชาติ.jpg",
        "พลังประชารัฐ": "/partys/พลังประชารัฐ.jpg",
        "ประชาชาติ": "/partys/ประชาชาติ.jpg"
    };
    return logoMap[name] || "/partys/default.jpg";
};

const getPartyColor = (name: string) => {
    const colorMap: Record<string, string> = {
        "พรรค A": "#f97316",
        "พรรค B": "#ef4444",
        "พรรค C": "#1d4ed8",
        "พรรค D": "#0ea5e9",
        "พรรค E": "#2563eb",
        "พรรค F": "#3b82f6",
        "พรรค G": "#15803d",
        "ประชาชน": "#f97316",
        "เพื่อไทย": "#ef4444",
        "ภูมิใจไทย": "#1d4ed8",
    };
    return colorMap[name] || "#64748b";
};

export default function MatchSummary({ results, userVotes, bills, onRestart, isMock }: MatchSummaryProps) {
    const [expandedBill, setExpandedBill] = useState<string | null>(null);

    if (!results || results.length === 0) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white text-center">
                <h2 className="text-3xl font-extrabold mb-8 flex items-center justify-center gap-3">
                    <Trophy size={32} className="text-yellow-300" />
                    3 พรรคที่สะท้อนจุดยืนของคุณ!
                </h2>
                
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
                    {results.slice(0, 3).map((match, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 flex flex-col items-center flex-1 w-full relative transition-transform hover:scale-105">
                            {idx === 0 && (
                                <div className="absolute -top-4 bg-yellow-400 text-slate-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                                    ตรงใจที่สุด!
                                </div>
                            )}
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 mb-4 shadow-lg shrink-0 bg-white flex items-center justify-center">
                                {isMock ? (
                                    <div 
                                        className="w-full h-full flex items-center justify-center font-bold text-sm p-2 text-center"
                                        style={{ 
                                            color: getPartyColor(match.partyName),
                                            backgroundColor: `${getPartyColor(match.partyName)}15`
                                        }}
                                    >
                                        {match.partyName.replace("พรรค ","")}
                                    </div>
                                ) : (
                                    <img src={getPartyLogo(match.partyName)} alt={match.partyName} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="text-xl font-black text-white mb-2">{match.partyName}</div>
                            <div className="text-yellow-300 font-bold text-2xl">{match.matchPercentage}%</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8">
                {results.length > 3 && (
                    <>
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Users size={20} className="text-blue-500" />
                            พรรคอื่นๆ ละ?
                        </h3>
                        
                        <div className="space-y-4">
                            {results.slice(3).map((result, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="font-bold text-slate-700 text-lg">{result.partyName}</span>
                                    <div className="flex items-center gap-4">
                                        <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500 rounded-full" 
                                                style={{ width: `${result.matchPercentage}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-slate-600 w-12 text-right">
                                            {result.matchPercentage}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* --- Display User Voting History & Comments --- */}
                <div className="mt-12 border-t border-slate-200 pt-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <MessageSquare size={20} className="text-blue-500" />
                        ความเห็นต่อนโยบายที่คุณโหวต
                    </h3>
                    
                    <div className="space-y-4">
                        {bills.map(bill => {
                            const stance = userVotes[bill.id];
                            if (!stance) return null; // Skip if not voted
                            
                            const isExpanded = expandedBill === bill.id;
                            const stanceText = stance === "yes" ? "เห็นด้วย" : "ไม่เห็นด้วย";
                            const stanceColor = stance === "yes" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200";

                            return (
                                <div key={bill.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:border-slate-300">
                                    <button 
                                        onClick={() => setExpandedBill(isExpanded ? null : bill.id)}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                                    >
                                        <div className="flex-1 pr-4">
                                            <div className="text-xs font-bold text-slate-400 mb-1">{bill.category}</div>
                                            <div className="font-bold text-slate-800 text-sm">{bill.title}</div>
                                            <div className="text-xs font-bold text-blue-500 mt-2 bg-blue-50 border border-blue-100 inline-block px-2 py-1 rounded-md">
                                                {bill.userAgreementPct}% ของผู้ใช้งานตอบเหมือนกับคุณ
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${stanceColor}`}>
                                                {stanceText}
                                            </span>
                                            {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                                        </div>
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-slate-100"
                                            >
                                                <div className="p-4 lg:p-6 bg-slate-50/50">
                                                    <BillCommentSection 
                                                        billId={bill.id} 
                                                        initialComments={mockComments[bill.id] || []} 
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <button 
                        onClick={onRestart}
                        className="flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        ทบทวนจุดยืนอีกครั้ง
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
