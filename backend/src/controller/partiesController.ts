import type { Request, Response } from "express";
import {
    getParties,
    getEntropyData,
    getTrendVoteData,
    getVoteAbsenceData,
    getBillsData,
} from "../utils/dataStore.js";
import type {
    PartyClustering,
    PartySpider,
    PartyPerformance,
} from "../types/index.js";

export const getPartiesHandler = (req: Request, res: Response) => {
    res.json(getParties());
};

export const getPartiesClusteringHandler = (req: Request, res: Response) => {
    const parties = getParties();
    const entropyData = getEntropyData();
    const trendVoteData = getTrendVoteData();
    const voteAbsenceData = getVoteAbsenceData();

    const clusteringData: PartyClustering[] = parties.map((party, index) => {
        const entropyRow = entropyData.find(
            (r: any) => r.voter_party === party.name,
        ) as any;
        const trendRow = trendVoteData.find(
            (r: any) => r.voter_party === party.name,
        ) as any;
        const absenceRow = voteAbsenceData.find(
            (r: any) => r.voter_party === party.name,
        ) as any;

        const unity = trendRow ? parseFloat(trendRow.avg_follow_pct) : 50;
        const attendance = absenceRow
            ? 100 - parseFloat(absenceRow.avg_absence_pct)
            : 50;
        const entropy = entropyRow
            ? parseFloat(entropyRow.avg_entropy_bits)
            : 0.5;

        return {
            id: party.id,
            name: party.name,
            cluster: (index % 3) + 1,
            color: index % 2 === 0 ? "#ef4444" : "#3b82f6",
            scoreX: unity,
            scoreY: attendance,
            logoUrl: `/partys/${party.name}.jpg`,
            metrics: {
                billTypes: "หลากหลาย",
                unity: Math.round(unity),
                successRate: Math.round(100 - entropy * 100),
                attendanceRate: Math.round(attendance),
                votingAlignment: "ฝ่ายรัฐบาล",
            },
        };
    });

    res.json(clusteringData);
};

export const getPartiesSpiderHandler = (req: Request, res: Response) => {
    const parties = getParties();
    const billsData = getBillsData();

    const partyBills: Record<string, Record<string, number>> = {};
    const categoriesSet = new Set<string>();

    billsData.forEach((bill: any) => {
        const party = bill.party_cleaned;
        const category = bill.categories;
        if (party && category) {
            categoriesSet.add(category);
            if (!partyBills[party]) partyBills[party] = {};
            partyBills[party][category] =
                (partyBills[party][category] || 0) + 1;
        }
    });

    const topCategories = Array.from(categoriesSet).slice(0, 5);

    const spiderData: PartySpider[] = parties.map((party, index) => {
        // Merge top categories with the party's own unique categories so nothing is lost
        const partyCatNames = Object.keys(partyBills[party.name] || {});
        const displayCategories = Array.from(new Set([...topCategories, ...partyCatNames]));
        
        // Ensure we always have at least 3 categories for a polygon (spider chart needs >= 3)
        while (displayCategories.length < 3) {
            const filler = ["เศรษฐกิจ", "การศึกษา", "สังคม", "สาธารณสุข"].find(c => !displayCategories.includes(c));
            if (filler) displayCategories.push(filler);
        }

        const metrics = displayCategories.map((cat) => ({
            axis: cat,
            value: (partyBills[party.name]?.[cat] || 0) * 10 + 20,
            bills: partyBills[party.name]?.[cat] || 0,
        }));

        return {
            id: party.id,
            name: party.name,
            color: index % 2 === 0 ? "#ef4444" : "#3b82f6",
            logoUrl: `/partys/${party.name}.jpg`,
            metrics: metrics,
        };
    });

    res.json(spiderData);
};

export const getPartiesPerformanceHandler = (req: Request, res: Response) => {
    const parties = getParties();
    const trendVoteData = getTrendVoteData();

    const performanceData: PartyPerformance[] = parties.map((party, index) => {
        const trendRow = trendVoteData.find(
            (r: any) => r.voter_party === party.name,
        ) as any;
        const baseVotes = trendRow ? parseInt(trendRow.vote_events) : 20;

        return {
            id: party.id,
            name: party.name,
            color: index % 2 === 0 ? "#ef4444" : "#3b82f6",
            logoUrl: `/partys/${party.name}.jpg`,
            data: [
                {
                    year: "ปีที่ 1",
                    votes: baseVotes,
                    multitask: Math.round(baseVotes * 0.4),
                    passedLaws: Math.round(baseVotes * 0.1),
                },
                {
                    year: "ปีที่ 2",
                    votes: baseVotes + 5,
                    multitask: Math.round((baseVotes + 5) * 0.45),
                    passedLaws: Math.round((baseVotes + 5) * 0.15),
                },
                {
                    year: "ปีที่ 3",
                    votes: baseVotes + 10,
                    multitask: Math.round((baseVotes + 10) * 0.5),
                    passedLaws: Math.round((baseVotes + 10) * 0.2),
                },
                {
                    year: "ปีที่ 4",
                    votes: baseVotes + 15,
                    multitask: Math.round((baseVotes + 15) * 0.55),
                    passedLaws: Math.round((baseVotes + 15) * 0.25),
                },
            ],
        };
    });

    res.json(performanceData);
};
