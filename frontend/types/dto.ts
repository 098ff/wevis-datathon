export interface PartyDTO {
    id: string;
    name: string;
}

export interface MetricDTO {
    axis: string;
    value: number;
    bills: number;
}

export interface PartyClusteringDTO {
    id: string;
    name: string;
    cluster: number;
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

export interface PartySpiderDTO {
    id: string;
    name: string;
    color: string;
    metrics: MetricDTO[];
}

export interface PerformanceDataPointDTO {
    year: string;
    votes: number;
    multitask: number;
    passedLaws: number;
}

export interface PartyPerformanceDTO {
    id: string;
    name: string;
    color: string;
    logoUrl: string;
    data: PerformanceDataPointDTO[];
}

export interface CommentDTO {
    id: string;
    partyId: string;
    author: string;
    date: string;
    text: string;
}
