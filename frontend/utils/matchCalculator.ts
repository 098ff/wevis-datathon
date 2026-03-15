import { MatchBill, PartyStance } from "../types";

export interface PartyMatchResult {
    partyName: string;
    matchScore: number; // 0 to 1
    matchPercentage: number; // 0 to 100
    matchedBills: number;
    totalCalculableBills: number;
}

/**
 * Calculates the match percentage for each party based on the user's yes/no votes.
 * @param userVotes A dictionary of billId -> 'yes' | 'no'
 * @param bills The array of MatchBill definition objects
 * @returns Array of PartyMatchResult sorted from highest match to lowest
 */
export const calculatePartyMatch = (
    userVotes: Record<string, PartyStance>, 
    bills: MatchBill[]
): PartyMatchResult[] => {
    
    // 1. Gather all unique party names from the bills
    const partyNames = new Set<string>();
    bills.forEach(b => {
        Object.keys(b.partyStances).forEach(p => partyNames.add(p));
    });

    const results: PartyMatchResult[] = [];

    // 2. Score each party against the user's votes
    partyNames.forEach(party => {
        let matchedBills = 0;
        let calculableBills = 0; // Only count bills the user voted on AND the party has a stance on

        Object.entries(userVotes).forEach(([billId, userStance]) => {
            const bill = bills.find(b => b.id === billId);
            if (bill && bill.partyStances[party]) {
                calculableBills++;
                if (bill.partyStances[party] === userStance) {
                    matchedBills++;
                }
            }
        });

        const score = calculableBills > 0 ? (matchedBills / calculableBills) : 0;

        results.push({
            partyName: party,
            matchScore: score,
            matchPercentage: Math.round(score * 100),
            matchedBills,
            totalCalculableBills: calculableBills
        });
    });

    // 3. Sort by highest matchPercentage descending
    return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
};
