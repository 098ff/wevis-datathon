"use client";

import { useState } from "react";
import { MessageSquare, User } from "lucide-react";

interface Comment {
    id: string;
    partyId: string;
    author: string;
    date: string;
    text: string;
}

const mockComments: Comment[] = [
    {
        id: "c1",
        partyId: "p1",
        author: "สมชาย รักดี",
        date: "2024-03-14T10:30:00Z",
        text: "พรรคนี้มีนโยบายเศรษฐกิจที่น่าสนใจมากครับ หวังว่าจะทำได้จริงตามที่หาเสียงไว้",
    },
    {
        id: "c2",
        partyId: "p1",
        author: "วิภาดา ใจเย็น",
        date: "2024-03-13T15:45:00Z",
        text: "อยากให้เน้นเรื่องการศึกษามากกว่านี้หน่อยค่ะ แต่โดยรวมถือว่าโอเค",
    },
    {
        id: "c3",
        partyId: "p2",
        author: "เอกพล คนขยัน",
        date: "2024-03-14T09:15:00Z",
        text: "ชอบแนวทางการแก้ปัญหาสิ่งแวดล้อมของพรรคนี้ เป็นรูปธรรมดี",
    },
    {
        id: "c4",
        partyId: "p3",
        author: "ณัฐวุฒิ กล้าหาญ",
        date: "2024-03-12T08:20:00Z",
        text: "การทำงานในสภาถือว่าโดดเด่นมากครับ ติดตามผลงานตลอด",
    },
];

const parties = [
    { id: "p1", name: "พรรค A" },
    { id: "p2", name: "พรรค B" },
    { id: "p3", name: "พรรค C" },
];

interface CommentSectionProps {
    selectedPartyId?: string;
    onPartyChange?: (id: string) => void;
}

export default function CommentSection({
    selectedPartyId: propPartyId,
    onPartyChange,
}: CommentSectionProps = {}) {
    const [localPartyId, setLocalPartyId] = useState<string>("p1");

    const activePartyId =
        propPartyId !== undefined ? propPartyId : localPartyId;

    const handlePartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setLocalPartyId(newId);
        if (onPartyChange) {
            onPartyChange(newId);
        }
    };

    // Filter and sort comments by date (newest first)
    const filteredComments = mockComments
        .filter((c) => c.partyId === activePartyId)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-blue-500" />
                        เสียงสะท้อนจากประชาชน
                    </h2>
                    <p className="text-slate-500 text-sm">
                        ความคิดเห็นและข้อเสนอแนะต่อพรรคการเมือง
                    </p>
                </div>

                <div className="w-full md:w-auto min-w-[200px]">
                    <select
                        value={activePartyId}
                        onChange={handlePartyChange}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-colors"
                    >
                        {parties.map((party) => (
                            <option key={party.id} value={party.id}>
                                {party.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredComments.length > 0 ? (
                    filteredComments.map((comment) => (
                        <div
                            key={comment.id}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-slate-200 p-2 rounded-full text-slate-500">
                                    <User className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-700 text-sm">
                                        {comment.author}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {formatDate(comment.date)}
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed ml-11">
                                {comment.text}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        ยังไม่มีความคิดเห็นสำหรับพรรคนี้
                    </div>
                )}
            </div>
        </section>
    );
}
