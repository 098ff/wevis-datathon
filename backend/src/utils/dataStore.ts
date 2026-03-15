import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";
import type { Party } from "../types/index.js";
import { party_list } from "../../data/pary_list.js";

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
let vizResultData: any[] = [];
let partiesCache: Party[] = [];

export const initDataStore = () => {
    billsData = parseCsv("bills_cleaned_and_labeled2.csv");
    entropyData = parseCsv("entropy.csv");
    trendVoteData = parseCsv("trend_vote.csv");
    voteAbsenceData = parseCsv("vote_absence.csv");
    vizResultData = parseCsv("viz_result.csv");
    const sanitizeParty = (p: string) => {
        if (!p) return "";
        let name = p.trim();
        if (name.startsWith("พรรค")) name = name.replace(/^พรรค/, "");
        return name;
    };
    const partiesSet = new Set<string>();

    party_list.forEach((p: any) => {
        if (p) partiesSet.add(sanitizeParty(p));
    });
    billsData.forEach((row: any) => {
        if (row.party_cleaned) row.party_cleaned = sanitizeParty(row.party_cleaned);
    });


    partiesCache = Array.from(partiesSet)
        .filter(
            (p) =>
                p &&
                p !== "" &&
                p !== "สมาชิกวุฒิสภา" &&
                p !== "ไม่สังกัดพรรค" &&
                p !== "ประชาอาสาชาติ" && // Assuming these are also parties to exclude
                p !== "ไทยทรัพย์ทวี" &&
                p !== "รวมพลังประชาชน" &&
                p !== "อนาคตไกล" &&
                p !== "ยางพาราไทย" && // Corrected party name
                p !== "เพื่อบ้านเมือง",
        )
        .map((name, index) => ({ id: `p${index + 1}`, name }));
};

export const getBillsData = () => billsData;
export const getEntropyData = () => entropyData;
export const getTrendVoteData = () => trendVoteData;
export const getVoteAbsenceData = () => voteAbsenceData;
export const getVizResultData = () => vizResultData;
export const getParties = () => partiesCache;
