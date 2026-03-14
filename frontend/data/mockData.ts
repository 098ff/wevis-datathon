import {
    PartyData,
    PartyDetail,
    PartyPerformance,
    Comment
} from "../types";

export const partyClusteringData: PartyData[] = [
    {
        id: "p1",
        name: "พรรค A",
        cluster: 1,
        color: "#ef4444",
        scoreX: 20,
        scoreY: 80,
        logoUrl: "/partys/party_1.jpg",
        metrics: {
            billTypes: "เศรษฐกิจ, สังคม",
            unity: 95,
            successRate: 40,
            attendanceRate: 85,
            votingAlignment: "ฝ่ายรัฐบาล (80%)",
        },
    },
    {
        id: "p2",
        name: "พรรค B",
        cluster: 1,
        color: "#f87171",
        scoreX: 30,
        scoreY: 70,
        logoUrl: "/partys/party_2.jpg",
        metrics: {
            billTypes: "การศึกษา",
            unity: 88,
            successRate: 35,
            attendanceRate: 78,
            votingAlignment: "ฝ่ายรัฐบาล (75%)",
        },
    },
    {
        id: "p3",
        name: "พรรค C",
        cluster: 2,
        color: "#3b82f6",
        scoreX: 80,
        scoreY: 20,
        logoUrl: "/partys/party_6.jpg",
        metrics: {
            billTypes: "สิ่งแวดล้อม, สิทธิมนุษยชน",
            unity: 92,
            successRate: 20,
            attendanceRate: 90,
            votingAlignment: "ฝ่ายค้าน (90%)",
        },
    },
    {
        id: "p4",
        name: "พรรค D",
        cluster: 2,
        color: "#60a5fa",
        scoreX: 70,
        scoreY: 30,
        logoUrl: "/partys/party_7.jpg",
        metrics: {
            billTypes: "กระจายอำนาจ",
            unity: 85,
            successRate: 15,
            attendanceRate: 82,
            votingAlignment: "ฝ่ายค้าน (85%)",
        },
    },
    {
        id: "p5",
        name: "พรรค E",
        cluster: 3,
        color: "#10b981",
        scoreX: 50,
        scoreY: 50,
        logoUrl: "/partys/party_8.jpg",
        metrics: {
            billTypes: "สวัสดิการ",
            unity: 75,
            successRate: 50,
            attendanceRate: 70,
            votingAlignment: "สวิงโหวต",
        },
    },
];

export const spiderChartData: PartyDetail[] = [
    {
        id: "p1",
        name: "พรรค A",
        color: "#ef4444", // Red
        metrics: [
            { axis: "เศรษฐกิจ", value: 80, bills: 45 },
            { axis: "การศึกษา", value: 60, bills: 25 },
            { axis: "สิ่งแวดล้อม", value: 40, bills: 12 },
            { axis: "สังคม", value: 70, bills: 38 },
            { axis: "การเมือง", value: 90, bills: 50 },
        ],
    },
    {
        id: "p2",
        name: "พรรค B",
        color: "#3b82f6", // Blue
        metrics: [
            { axis: "เศรษฐกิจ", value: 50, bills: 20 },
            { axis: "การศึกษา", value: 80, bills: 40 },
            { axis: "สิ่งแวดล้อม", value: 90, bills: 55 },
            { axis: "สังคม", value: 60, bills: 28 },
            { axis: "การเมือง", value: 40, bills: 15 },
        ],
    },
    {
        id: "p3",
        name: "พรรค C",
        color: "#10b981", // Green
        metrics: [
            { axis: "เศรษฐกิจ", value: 60, bills: 30 },
            { axis: "การศึกษา", value: 70, bills: 35 },
            { axis: "สิ่งแวดล้อม", value: 80, bills: 42 },
            { axis: "สังคม", value: 80, bills: 45 },
            { axis: "การเมือง", value: 60, bills: 28 },
        ],
    },
];

export const stackedBarChartData: PartyPerformance[] = [
    {
        id: "p1",
        name: "พรรค A",
        color: "#ef4444",
        logoUrl: "/partys/party_1.jpg",
        data: [
            { year: "ปีที่ 1", votes: 30, multitask: 15, passedLaws: 5 },
            { year: "ปีที่ 2", votes: 35, multitask: 20, passedLaws: 8 },
            { year: "ปีที่ 3", votes: 40, multitask: 25, passedLaws: 12 },
            { year: "ปีที่ 4", votes: 45, multitask: 30, passedLaws: 15 },
        ],
    },
    {
        id: "p2",
        name: "พรรค B",
        color: "#3b82f6",
        logoUrl: "/partys/party_2.jpg",
        data: [
            { year: "ปีที่ 1", votes: 40, multitask: 10, passedLaws: 8 },
            { year: "ปีที่ 2", votes: 42, multitask: 12, passedLaws: 10 },
            { year: "ปีที่ 3", votes: 45, multitask: 15, passedLaws: 15 },
            { year: "ปีที่ 4", votes: 50, multitask: 18, passedLaws: 20 },
        ],
    },
    {
        id: "p3",
        name: "พรรค C",
        color: "#10b981",
        logoUrl: "/partys/party_6.jpg",
        data: [
            { year: "ปีที่ 1", votes: 20, multitask: 25, passedLaws: 4 },
            { year: "ปีที่ 2", votes: 25, multitask: 30, passedLaws: 6 },
            { year: "ปีที่ 3", votes: 28, multitask: 35, passedLaws: 8 },
            { year: "ปีที่ 4", votes: 35, multitask: 40, passedLaws: 10 },
        ],
    },
    {
        id: "p4",
        name: "พรรค D",
        color: "#f59e0b",
        logoUrl: "/partys/party_7.jpg",
        data: [
            { year: "ปีที่ 1", votes: 35, multitask: 20, passedLaws: 10 },
            { year: "ปีที่ 2", votes: 38, multitask: 22, passedLaws: 12 },
            { year: "ปีที่ 3", votes: 40, multitask: 25, passedLaws: 15 },
            { year: "ปีที่ 4", votes: 42, multitask: 28, passedLaws: 18 },
        ],
    },
];

export const commentsData: Comment[] = [
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
        author: "ชยุต สมสู่อาชา",
        date: "2024-03-12T08:20:00Z",
        text: "การทำงานในสภาถือว่าโดดเด่นมากครับ ติดตามผลงานตลอด",
    },
    {
        id: "c5",
        partyId: "p2",
        author: "ชนัดดา ชมคน",
        date: "2024-03-12T08:20:00Z",
        text: "การทำงานในสภาถือว่าโดดเด่นมากครับ ติดตามผลงานตลอด",
    },
    {
        id: "c6",
        partyId: "p2",
        author: "นันทพร บาปพัวพัน",
        date: "2024-03-12T08:20:00Z",
        text: "รอดูผลงานในสมัยหน้านะคะ",
    },
];

export const availableParties = [
    { id: "p1", name: "พรรค A" },
    { id: "p2", name: "พรรค B" },
    { id: "p3", name: "พรรค C" },
    { id: "p4", name: "พรรค D" },
    { id: "p5", name: "พรรค E" },
];
