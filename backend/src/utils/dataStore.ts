import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";
import type { Party } from "../types/index.js";

const dataDir = path.join(process.cwd(), "data");

const parseCsv = (filename: string) => {
    try {
        const fileContent = fs.readFileSync(
            path.join(dataDir, filename),
            "utf-8",
        );
        return parse(fileContent, { columns: true, skip_empty_lines: true });
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
};

let billsData: any[] = [];
let entropyData: any[] = [];
let trendVoteData: any[] = [];
let voteAbsenceData: any[] = [];
let partiesCache: Party[] = [];
let clusteringData: any[] = [];

export const initDataStore = () => {
    billsData = parseCsv("bills_cleaned_and_labeled2.csv");
    entropyData = parseCsv("entropy.csv");
    trendVoteData = parseCsv("trend_vote.csv");
    voteAbsenceData = parseCsv("vote_absence.csv");
    clusteringData = parseCsv("clustering.csv");

    const sanitizeParty = (p: string) => {
        if (!p) return "";
        let name = p.trim();
        if (name.startsWith("พรรค")) name = name.replace(/^พรรค/, "");
        return name;
    };

    billsData.forEach((row: any) => {
        if (row.party_cleaned) row.party_cleaned = sanitizeParty(row.party_cleaned);
    });
    entropyData.forEach((row: any) => {
        if (row.voter_party) row.voter_party = sanitizeParty(row.voter_party);
    });
    trendVoteData.forEach((row: any) => {
        if (row.voter_party) row.voter_party = sanitizeParty(row.voter_party);
    });
    voteAbsenceData.forEach((row: any) => {
        if (row.voter_party) row.voter_party = sanitizeParty(row.voter_party);
    });
    clusteringData.forEach((row: any) => {
        if (row.voter_party) row.voter_party = sanitizeParty(row.voter_party);
    });

    const partiesSet = new Set<string>();
    entropyData.forEach((row: any) => partiesSet.add(row.voter_party));
    trendVoteData.forEach((row: any) => partiesSet.add(row.voter_party));
    voteAbsenceData.forEach((row: any) => partiesSet.add(row.voter_party));
    billsData.forEach((row: any) => {
        if (row.party_cleaned) partiesSet.add(row.party_cleaned);
    });

    partiesCache = Array.from(partiesSet)
        .filter(
            (p) =>
                p &&
                p !== "" &&
                p !== "สมาชิกวุฒิสภา" &&
                p !== "ไม่สังกัดพรรค",
        )
        .map((name, index) => ({ id: `p${index + 1}`, name }));
};

export const getBillsData = () => billsData;
export const getEntropyData = () => entropyData;
export const getTrendVoteData = () => trendVoteData;
export const getVoteAbsenceData = () => voteAbsenceData;
export const getParties = () => partiesCache;
export const getClusteringData = () => clusteringData;