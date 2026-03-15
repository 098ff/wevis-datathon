export interface PartyData {
    id: string;
    name: string;
    cluster: number | string;
    pc1: number;
    pc2: number;
    pc3: number;
    color: string;
    clusterColor?: string;
    scoreX: number;
    scoreY: number;
    logoUrl: string;
    metrics: {
        billTypes: string;
        unity: number;
        successRate: number;
        attendanceRate: number;
        votingAlignment: string;
    };
}

export interface Metric {
    axis: string;
    value: number;
    bills: number;
}

export interface PartyDetail {
    id: string;
    name: string;
    color: string;
    metrics: Metric[];
}

export interface YearData {
    year: string;
    votes: number;
    multitask: number;
    passedLaws: number;
}

export interface PartyPerformance {
    id: string;
    name: string;
    color: string;
    logoUrl: string;
    data: YearData[];
}

export interface Comment {
    id: string;
    partyId: string;
    author: string;
    date: string;
    text: string;
}

export type PartyStance = "yes" | "no";

export interface MatchComment {
    id: string;
    author: string;
    text: string;
    timestamp: string;
    avatarUrl?: string;
    likeCount: number;
}

export interface MatchBill {
    id: string;
    title: string;
    description: string;
    category: string;
    userAgreementPct: number; // Mock % of users who voted "Yes"
    partyStances: Record<string, PartyStance>; // Party Name -> "yes" | "no"
}
