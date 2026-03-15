    export interface Party {
    id: string;
    name: string;
}

export interface Metric {
    axis: string;
    value: number;
    bills: number;
}

export interface PartyClustering {
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

export interface PartySpider {
    id: string;
    name: string;
    color: string;
    metrics: Metric[];
}

export interface PerformanceDataPoint {
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
    data: PerformanceDataPoint[];
}

export interface Comment {
    id: string;
    partyId: string;
    author: string;
    date: string;
    text: string;
}
