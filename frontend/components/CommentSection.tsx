"use client";

import { useState, useEffect } from "react";
import { MessageSquare, User } from "lucide-react";
import { PartyData } from "../types";
import { CommentDTO } from "../types/dto";
import { getComments } from "../apis/comments";

interface CommentSectionProps {
    selectedPartyId?: string;
    onPartyChange?: (id: string) => void;
    globalPartyData?: PartyData[];
}

export default function CommentSection({
    selectedPartyId: propPartyId,
    onPartyChange,
    globalPartyData = [],
}: CommentSectionProps = {}) {
    const [localPartyId, setLocalPartyId] = useState<string>("");
    const [comments, setComments] = useState<CommentDTO[]>([]);
    const [newCommentText, setNewCommentText] = useState("");

    useEffect(() => {
        getComments().then(data => {
            setComments(data);
            if (data.length > 0 && !localPartyId && propPartyId === undefined) {
                setLocalPartyId(data[0].partyId);
            }
        }).catch(err => console.error("Failed to load comments", err));
    }, []);

    const activePartyId =
        propPartyId !== undefined ? propPartyId : localPartyId;

    const handlePartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setLocalPartyId(newId);
        if (onPartyChange) {
            onPartyChange(newId);
        }
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        const newComment: CommentDTO = {
            id: `c${Date.now()}`,
            partyId: activePartyId,
            author: "ผู้ใช้งาน",
            date: new Date().toISOString(),
            text: newCommentText,
        };

        setComments([newComment, ...comments]);
        setNewCommentText("");
    };

    // Filter and sort comments by date (newest first)
    const filteredComments = comments
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
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-colors cursor-pointer"
                    >
                        {globalPartyData.map((party) => (
                            <option key={party.id} value={party.id}>
                                {party.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <form onSubmit={handleAddComment} className="mb-8">
                <div className="flex flex-col gap-3">
                    <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="อยากฝากอะไรถึงพรรคนี้..."
                        className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition-colors resize-none h-24"
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={!newCommentText.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-colors"
                        >
                            ส่งความคิดเห็น
                        </button>
                    </div>
                </div>
            </form>

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
