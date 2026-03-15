"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import MatchCard from "@/components/MatchCard"
import MatchSummary from "@/components/MatchSummary"
import { mockBills, mockComments } from "@/data/mockMatchData"
import { calculatePartyMatch, PartyMatchResult } from "@/utils/matchCalculator"
import { PartyStance } from "@/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function MatchGame() {
    // Game State
    const [currentIndex, setCurrentIndex] = useState(0)
    const [userVotes, setUserVotes] = useState<Record<string, PartyStance>>({})
    const [showResults, setShowResults] = useState(false)
    const [matchResults, setMatchResults] = useState<PartyMatchResult[]>([])

    // UI State
    const isGameFinished = currentIndex >= mockBills.length

    const handleVote = (stance: PartyStance) => {
        const currentBill = mockBills[currentIndex]

        const newVotes = { ...userVotes, [currentBill.id]: stance }
        setUserVotes(newVotes)

        // Advance or Finish immediately
        if (currentIndex + 1 >= mockBills.length) {
            finishGame(newVotes)
        } else {
            setCurrentIndex((prev) => prev + 1)
        }
    }

    const finishGame = (finalVotes: Record<string, PartyStance>) => {
        const results = calculatePartyMatch(finalVotes, mockBills)
        setMatchResults(results)
        setShowResults(true)
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setUserVotes({})
        setShowResults(false)
        setMatchResults([])
    }

    const activeBill = mockBills[currentIndex]

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-24 pb-8 flex flex-col items-center">
                <header className="w-full flex justify-between items-center mb-8 px-4 max-w-4xl mx-auto">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium"
                    >
                        <ArrowLeft size={20} />
                        กลับสู่หน้าหลัก
                    </Link>
                    {!showResults && (
                        <div className="text-slate-600 font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                            นโยบาย{" "}
                            {Math.min(currentIndex + 1, mockBills.length)} /{" "}
                            {mockBills.length}
                        </div>
                    )}
                </header>

                <div className="flex-1 w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
                    {/* LEFT COLUMN: Tinder Cards or Results */}
                    <div className="w-full lg:w-[450px] relative shrink-0 flex flex-col items-center justify-center min-h-[500px]">
                        {showResults ? (
                            <MatchSummary
                                results={matchResults}
                                userVotes={userVotes}
                                bills={mockBills}
                                onRestart={handleRestart}
                            />
                        ) : (
                            <div className="w-full h-[550px] relative [perspective:1000px]">
                                <AnimatePresence mode="popLayout">
                                    {/* Map through bills backwards to stack them visually */}
                                    {mockBills.map((bill, index) => {
                                        if (index < currentIndex) return null // Already swiped past
                                        if (index > currentIndex + 2)
                                            return null // performance: limit visible stack range

                                        const isActive = index === currentIndex
                                        // Simple fake z-stack effect visually positioning nested cards below
                                        const isBelow1 =
                                            index === currentIndex + 1
                                        const isBelow2 =
                                            index === currentIndex + 2

                                        return (
                                            <motion.div
                                                key={bill.id}
                                                className="absolute inset-0"
                                                initial={
                                                    isBelow1
                                                        ? {
                                                              scale: 0.95,
                                                              y: -20,
                                                              opacity: 0,
                                                          }
                                                        : false
                                                }
                                                animate={{
                                                    scale: isActive
                                                        ? 1
                                                        : isBelow1
                                                          ? 0.95
                                                          : 0.9,
                                                    y: isActive
                                                        ? 0
                                                        : isBelow1
                                                          ? -20
                                                          : -40,
                                                    opacity: isActive
                                                        ? 1
                                                        : isBelow1
                                                          ? 0.8
                                                          : 0.5,
                                                    zIndex:
                                                        mockBills.length -
                                                        index,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    transition: {
                                                        duration: 0.2,
                                                    },
                                                }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <MatchCard
                                                    bill={bill}
                                                    onVote={handleVote}
                                                    active={isActive}
                                                    zIndex={
                                                        mockBills.length - index
                                                    }
                                                />
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
