"use client";

import { useState } from "react";
import PartyClustering from "@/components/PartyClustering";
import SpiderChart from "@/components/SpiderChart";
import StackedBarChart from "@/components/StackedBarChart";
import CommentSection from "@/components/CommentSection";

export default function Home() {
    const [selectedPartyId, setSelectedPartyId] = useState("p1");

    return (
        <main className="min-h-screen p-6 md:p-12 lg:p-20 max-w-7xl mx-auto space-y-12 bg-slate-50">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Political Party Analysis
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    การสร้างภาพจำลองข้อมูลการเมืองแบบ 2 มิติ
                    เพื่อวิเคราะห์ลักษณะเฉพาะ ผลงาน
                    และความคิดเห็นของประชาชนต่อพรรคการเมือง
                </p>
            </header>

            <div className="space-y-12">
                <PartyClustering />
                <SpiderChart
                    selectedPartyId={selectedPartyId}
                    onPartyChange={setSelectedPartyId}
                />
                <StackedBarChart selectedPartyId={selectedPartyId} />
                <CommentSection
                    selectedPartyId={selectedPartyId}
                    onPartyChange={setSelectedPartyId}
                />
            </div>

            <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
                <p>
                    © {new Date().getFullYear()} Political Party Analysis
                    Dashboard
                </p>
            </footer>
        </main>
    );
}
