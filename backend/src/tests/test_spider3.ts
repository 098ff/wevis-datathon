import { parse } from "csv-parse/sync";
import * as fs from "fs";

const sanitizeParty = (p: string) => {
    if (!p) return "";
    let name = p.trim();
    if (name.startsWith("พรรค")) name = name.replace(/^พรรค/, "");
    return name;
};

const fileContent = fs.readFileSync("./data/bills_cleaned_and_labeled2.csv", "utf-8");
const billsData = parse(fileContent, { columns: true, skip_empty_lines: true });

const partyBills: Record<string, Record<string, number>> = {};
const categoriesSet = new Set<string>();

billsData.forEach((row: any) => {
    if (row.party_cleaned) row.party_cleaned = sanitizeParty(row.party_cleaned);
});

billsData.forEach((bill: any) => {
    const party = bill.party_cleaned;
    const category = bill.categories;
    if (party && category) {
        categoriesSet.add(category);
        if (!partyBills[party]) partyBills[party] = {};
        partyBills[party][category] = (partyBills[party][category] || 0) + 1;
    }
});

console.log("Categories:", Array.from(categoriesSet).slice(0, 5));
console.log("ไทยสร้างไทย bills:", partyBills["ไทยสร้างไทย"]);
console.log("Party keys:", Object.keys(partyBills).filter(k => k.includes("ไทยสร้างไทย")));
