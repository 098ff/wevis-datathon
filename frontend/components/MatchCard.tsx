"use client";

import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { MatchBill, PartyStance } from "../types";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface MatchCardProps {
    bill: MatchBill;
    onVote: (stance: PartyStance) => void;
    active: boolean;
    zIndex: number;
}

export default function MatchCard({ bill, onVote, active, zIndex }: MatchCardProps) {
    const [exitX, setExitX] = useState<number>(0);
    const x = useMotionValue(0);
    const controls = useAnimation();

    const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
    const rotate = useTransform(x, [-150, 150], [-15, 15]);
    
    // Background color overlays based on swipe direction
    const bgAccept = useTransform(x, [0, 100], ["rgba(34, 197, 94, 0)", "rgba(34, 197, 94, 0.15)"]);
    const bgReject = useTransform(x, [-100, 0], ["rgba(239, 68, 68, 0.15)", "rgba(239, 68, 68, 0)"]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;
        
        if (info.offset.x > threshold) {
            handleVote("yes");
        } else if (info.offset.x < -threshold) {
            handleVote("no");
        } else {
            // SNAP back
            controls.start({ x: 0, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    const handleVote = async (stance: PartyStance) => {
        const targetX = stance === "yes" ? 300 : -300;
        setExitX(targetX);
        await controls.start({ x: targetX, opacity: 0, transition: { duration: 0.2 } });
        onVote(stance);
    };

    return (
        <motion.div
            className="absolute rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden"
            style={{ 
                width: "100%", 
                height: "100%", 
                x: active ? x : 0, 
                opacity: active ? opacity : 1, 
                rotate: active ? rotate : 0,
                zIndex 
            }}
            drag={active ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={false}
            whileDrag={{ scale: 1.05 }}
        >
            <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: bgAccept }} />
            <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: bgReject }} />
            
            <div className="relative z-10 p-8 flex flex-col h-full pointer-events-none">
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-sm font-semibold mb-6 tracking-wide uppercase">
                        {bill.category}
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-6 leading-tight">
                        {bill.title}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        {bill.description}
                    </p>
                </div>
            </div>

            {/* Voting Control Buttons (Only interactive when active) */}
            {active && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-8 z-20">
                    <button 
                        onClick={() => handleVote("no")}
                        className="w-16 h-16 rounded-full bg-white border-2 border-red-100 text-red-500 flex items-center justify-center shadow-md hover:bg-red-50 hover:scale-110 hover:border-red-200 transition-all focus:outline-none"
                    >
                        <X size={32} strokeWidth={3} />
                    </button>
                    <button 
                        onClick={() => handleVote("yes")}
                        className="w-16 h-16 rounded-full bg-white border-2 border-green-100 text-green-500 flex items-center justify-center shadow-md hover:bg-green-50 hover:scale-110 hover:border-green-200 transition-all focus:outline-none"
                    >
                        <Check size={32} strokeWidth={3} />
                    </button>
                </div>
            )}
        </motion.div>
    );
}
