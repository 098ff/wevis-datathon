"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import PartyClustering from "@/components/PartyClustering";
import { extractPartyColors } from "@/utils/colors";
import { partyClusteringData as partyMockData } from "@/data/mockData";
import { PartyData } from "@/types";
import SpiderChart from "@/components/SpiderChart";
import StackedBarChart from "@/components/StackedBarChart";
import CommentSection from "@/components/CommentSection";

export default function Home() {
    const [selectedPartyId, setSelectedPartyId] = useState("p1");
    const [globalPartyData, setGlobalPartyData] =
        useState<PartyData[]>(partyMockData);

    useEffect(() => {
        let isMounted = true;
        extractPartyColors(partyMockData).then((updated) => {
            if (isMounted) {
                setGlobalPartyData(updated);
            }
        });
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <Navbar />
            <main
                className="min-h-screen pt-28 p-6 md:p-12 lg:p-20 max-w-7xl mx-auto space-y-12 bg-slate-50"
                id="body"
            >
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
                    <motion.div
                        id="clustering"
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            bounce: 0.5,
                            duration: 1,
                        }}
                    >
                        <PartyClustering initialData={globalPartyData} />
                    </motion.div>
                    <div id="characteristics">
                        <SpiderChart
                            selectedPartyId={selectedPartyId}
                            onPartyChange={setSelectedPartyId}
                        />
                    </div>
                    <div id="performance">
                        <StackedBarChart
                            selectedPartyId={selectedPartyId}
                            globalPartyData={globalPartyData}
                        />
                    </div>
                    <div id="comments">
                        <CommentSection
                            selectedPartyId={selectedPartyId}
                            onPartyChange={setSelectedPartyId}
                        />
                    </div>
                </div>

                <footer className="mt-20 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
                    <p>
                        © {new Date().getFullYear()} Political Party Analysis
                        Dashboard
                    </p>
                </footer>
            </main>
        </>
    );
}
