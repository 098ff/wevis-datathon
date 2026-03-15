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

export const initDataStore = () => {
    billsData = parseCsv("bills_cleaned_and_labeled2.csv");
    entropyData = parseCsv("entropy.csv");
    trendVoteData = parseCsv("trend_vote.csv");
    voteAbsenceData = parseCsv("vote_absence.csv");
    const party_list = [
        'พรรคประชาธิปัตย์', 'พรรคประชากรไทย', 'พรรคความหวังใหม่', 
        'พรรคเครือข่ายชาวนาแห่งประเทศไทย', 'พรรคเพื่อไทย', 'พรรคชาติพัฒนา', 
        'พรรคชาติไทยพัฒนา', 'พรรคอนาคตไทย', 'พรรคภูมิใจไทย', 
        'พรรคสังคมประชาธิปไตยไทย', 'พรรครักชาติ', 'พรรคประชาธิปไตยใหม่', 
        'พรรคพลังบูรพา', 'พรรคครูไทยเพื่อประชาชน', 'พรรคพลังท้องถิ่นไท', 
        'พรรคประชาชน', 'พรรคไทยก้าวใหม่', 'พรรคเสรีรวมไทย', 
        'พรรครักษ์ธรรม', 'พรรคพลังประชาธิปไตย', 'พรรคพลังสุราษฎร์', 
        'พรรคพลังไทยรักชาติ', 'พรรคเพื่อชีวิตใหม่', 'พรรคทางเลือกใหม่', 
        'พรรคเศรษฐกิจ', 'พรรคสร้างอนาคตไทย', 'พรรคพลังธรรมใหม่', 
        'พรรคไทยธรรม', 'พรรครวมพลัง', 'พรรคไทยพร้อม', 
        'พรรคปวงชนไทย', 'พรรคเพื่อชาติไทย', 'พรรคก้าวอิสระ', 
        'พรรคประชาชาติ', 'พรรคแผ่นดินธรรม', 'พรรคคลองไทย', 
        'พรรคพลังประชารัฐ', 'พรรคเศรษฐกิจใหม่', 'พรรคพลังสังคม', 
        'พรรคเป็นธรรม', 'พรรคพลังเพื่อไทย', 'พรรคประชาไทย', 
        'พรรคกรีน', 'พรรควิชชั่นใหม่', 'พรรคพลวัต', 
        'พรรคกล้าธรรม', 'พรรคไทยรวมไทย', 'พรรคกล้า', 
        'พรรคฟิวชัน', 'พรรคพลังสังคมใหม่', 'พรรคไทยสร้างไทย', 
        'พรรคมิติใหม่', 'พรรครวมไทยสร้างชาติ', 'พรรคไทยสมาร์ท', 
        'พรรคไทยภักดี', 'พรรคไทยพิทักษ์ธรรม', 'พรรคไทยชนะ', 
        'พรรคไทรวมพลัง', 'พรรคราษฎร์วิถี', 'พรรคโอกาสใหม่', 
        'พรรคท้องที่ไทย', 'พรรคใหม่', 'พรรคแรงงานสร้างชาติ', 
        'พรรคไทยก้าวหน้า', 'พรรคตะวันใหม่', 'พรรคพร้อม', 
        'พรรครวมใจไทย', 'พรรคสัมมาธิปไตย', 'พรรครักภูเก็ต', 
        'พรรคประชาอาสาชาติ', 'พรรคไทยทรัพย์ทวี', 'พรรครวมพลังประชาชน', 
        'พรรคอนาคตไกล', 'พรยยางพาราไทย', 'พรรคเพื่อบ้านเมือง'
    ]
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
                p !== "ไม่สังกัดพรรค",
        )
        .map((name, index) => ({ id: `p${index + 1}`, name }));
};

export const getBillsData = () => billsData;
export const getEntropyData = () => entropyData;
export const getTrendVoteData = () => trendVoteData;
export const getVoteAbsenceData = () => voteAbsenceData;
export const getParties = () => partiesCache;
