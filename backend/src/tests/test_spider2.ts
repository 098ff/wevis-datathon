import { parse } from "csv-parse/sync";
import * as fs from "fs";

const fileContent = fs.readFileSync("./data/bills_cleaned_and_labeled2.csv", "utf-8");
const billsData = parse(fileContent, { columns: true, skip_empty_lines: true });

const partyBills: Record<string, Record<string, number>> = {};
const categoriesSet = new Set<string>();

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
console.log("พรรคก้าวไกล bills:", partyBills["พรรคก้าวไกล"]);
console.log("พรรคพลังประชารัฐ bills:", partyBills["พรรคพลังประชารัฐ"]);
console.log("Party clean values sample:", Array.from(new Set(billsData.map((b:any) => b.party_cleaned))).slice(0, 10));
