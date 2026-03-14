import type { Request, Response } from "express";
import { getParties } from "../utils/dataStore.js";
import type { Comment } from "../types/index.js";

export const getCommentsHandler = (req: Request, res: Response) => {
    const parties = getParties();
    
    // Generate some mock comments based on the real parties
    const comments: Comment[] = parties.slice(0, 3).flatMap((party, i) => [
        {
            id: `c${i}1`,
            partyId: party.id,
            author: `ผู้ใช้ ${i + 1}`,
            date: new Date().toISOString(),
            text: `ความคิดเห็นเกี่ยวกับ ${party.name} ...`,
        },
        {
            id: `c${i}2`,
            partyId: party.id,
            author: `ประชาชน ${i + 1}`,
            date: new Date(Date.now() - 86400000).toISOString(),
            text: `ติดตามผลงานของ ${party.name} ตลอดครับ`,
        },
    ]);
    res.json(comments);
};
