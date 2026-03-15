"use client";

import { useState } from "react";
import { MatchComment } from "../types";
import { MessageSquare, ThumbsUp, Send } from "lucide-react";

interface BillCommentSectionProps {
    billId: string;
    initialComments: MatchComment[];
}

export default function BillCommentSection({ billId, initialComments }: BillCommentSectionProps) {
    const [comments, setComments] = useState<MatchComment[]>(initialComments);
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: MatchComment = {
            id: `usr_${Date.now()}`,
            author: "You",
            text: newComment.trim(),
            timestamp: "Just now",
            likeCount: 0
        };

        setComments(prev => [comment, ...prev]);
        setNewComment("");
    };

    const handleLike = (id: string) => {
        setComments(prev => 
            prev.map(c => c.id === id ? { ...c, likeCount: c.likeCount + 1 } : c)
        );
    };

    return (
        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <MessageSquare className="text-slate-500" size={20} />
                <h3 className="font-bold text-slate-700">ความเห็นสาธารณะ</h3>
                <span className="text-slate-400 text-sm ml-auto">{comments.length} ความเห็น</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {comments.length === 0 ? (
                    <div className="text-center text-slate-400 py-10 text-sm">ยังไม่มีความเห็น เป็นคนแรกที่เริ่มการสนทนาสิ!</div>
                ) : (
                    comments.map(c => (
                        <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm text-slate-800">{c.author}</span>
                                <span className="text-xs text-slate-400">{c.timestamp}</span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-3">{c.text}</p>
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => handleLike(c.id)}
                                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-500 transition-colors"
                                >
                                    <ThumbsUp size={14} />
                                    <span>{c.likeCount}</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-full focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <input
                        type="text"
                        placeholder="แสดงความคิดเห็น..."
                        className="flex-1 bg-transparent px-4 outline-none text-sm text-slate-700 placeholder:text-slate-400"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:bg-slate-300 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
