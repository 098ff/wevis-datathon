export interface PartyData {
    id: string;
    name: string;
    cluster: number | string;
    pc1: number;
    pc2: number;
    pc3: number;
    color: string;
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
