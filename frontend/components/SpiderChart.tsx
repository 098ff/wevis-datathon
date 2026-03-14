"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
    motion,
    useSpring,
    useTransform,
    AnimatePresence,
} from "framer-motion";

function AnimatedNumber({ value }: { value: number }) {
    const spring = useSpring(0, { bounce: 0, duration: 1000 });
    const display = useTransform(
        spring,
        (current) => Math.round(current) + "%",
    );

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
}

interface Metric {
    axis: string;
    value: number;
    bills: number;
}

interface PartyDetail {
    id: string;
    name: string;
    color: string;
    metrics: Metric[];
}

const mockParties: PartyDetail[] = [
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

interface SpiderChartProps {
    selectedPartyId?: string;
    onPartyChange?: (id: string) => void;
}

export default function SpiderChart({
    selectedPartyId: propPartyId,
    onPartyChange,
}: SpiderChartProps = {}) {
    const svgContainerRef = useRef<HTMLDivElement>(null);
    const [localPartyId, setLocalPartyId] = useState<string>(mockParties[0].id);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    const activePartyId =
        propPartyId !== undefined ? propPartyId : localPartyId;
    const selectedParty =
        mockParties.find((p) => p.id === activePartyId) || mockParties[0];

    const handlePartyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setLocalPartyId(newId);
        if (onPartyChange) {
            onPartyChange(newId);
        }
    };

    // Chart Constants
    const size = 450;
    const center = size / 2;
    const margin = 60;
    const radius = center - margin;
    const features = selectedParty.metrics.map((m) => m.axis);
    const angleSlice = (Math.PI * 2) / features.length;

    // Calculate Coordinates for the Polygon and Points
    const points = useMemo(() => {
        return selectedParty.metrics.map((m, i) => {
            const r = (m.value / 100) * radius;
            const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
            const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
            return { x, y, value: m.value, axis: m.axis, bills: m.bills };
        });
    }, [selectedParty, radius, center, angleSlice]);

    // Construct the SVG path string
    const pathData = useMemo(() => {
        return `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;
    }, [points]);

    // Handle Mouse Move over the SVG to find the closest point
    const handleMouseMove = useCallback(
        (e: React.MouseEvent<SVGSVGElement>) => {
            if (!svgContainerRef.current) return;
            const rect = svgContainerRef.current.getBoundingClientRect();

            // Map screen coordinates to viewBox coordinates
            const scaleX = size / rect.width;
            const scaleY = size / rect.height;
            const mx = (e.clientX - rect.left) * scaleX;
            const my = (e.clientY - rect.top) * scaleY;

            let minDist = Infinity;
            let closestIdx: number | null = null;

            points.forEach((p, i) => {
                const dist = Math.hypot(mx - p.x, my - p.y);
                // Hover threshold in viewBox units (approx 80px)
                if (dist < 80 && dist < minDist) {
                    minDist = dist;
                    closestIdx = i;
                }
            });

            setActiveIdx(closestIdx);
        },
        [points],
    );

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start relative">
            <div className="flex-1 w-full z-10">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Party Characteristics
                    </h2>
                    <p className="text-slate-500 text-sm mb-4">
                        Spider Chart แสดงสัดส่วนจุดเด่นนโยบายของแต่ละพรรค
                        (ชี้ที่จุดแต่ละมุมเพื่อดูจำนวนร่างกฎหมาย)
                    </p>

                    <div className="flex flex-col gap-2 max-w-xs">
                        <label
                            htmlFor="party-select"
                            className="text-sm font-medium text-slate-700"
                        >
                            เลือกพรรคการเมือง
                        </label>
                        <select
                            id="party-select"
                            value={activePartyId}
                            onChange={handlePartyChange}
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-colors cursor-pointer"
                        >
                            {mockParties.map((party) => (
                                <option key={party.id} value={party.id}>
                                    {party.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
                        คะแนนแต่ละด้าน
                    </h3>
                    <ul className="space-y-3 relative z-20">
                        {selectedParty.metrics.map((metric, idx) => {
                            const isActive = activeIdx === idx;
                            return (
                                <li
                                    key={idx}
                                    onClick={() =>
                                        setActiveIdx(isActive ? null : idx)
                                    }
                                    onMouseEnter={() => setActiveIdx(idx)}
                                    onMouseLeave={() => setActiveIdx(null)}
                                    className={`flex justify-between items-center px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                                        isActive
                                            ? "border-blue-300 bg-blue-50 shadow-sm"
                                            : "border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                                    }`}
                                >
                                    <span
                                        className={`font-medium transition-colors ${
                                            isActive
                                                ? "text-blue-700"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        {metric.axis}
                                    </span>
                                    <span
                                        className="font-bold text-lg"
                                        style={{ color: selectedParty.color }}
                                    >
                                        <AnimatedNumber value={metric.value} />
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="flex-1 w-full flex justify-center items-center relative min-h-[450px]">
                <div
                    className="w-full max-w-[450px] relative"
                    ref={svgContainerRef}
                >
                    <svg
                        viewBox={`0 0 ${size} ${size}`}
                        className="w-full h-auto drop-shadow-sm"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setActiveIdx(null)}
                    >
                        {/* Background Grid Circles */}
                        {[20, 40, 60, 80, 100].map((t) => (
                            <circle
                                key={t}
                                cx={center}
                                cy={center}
                                r={(t / 100) * radius}
                                fill="none"
                                stroke="#e2e8f0"
                                strokeDasharray="3,3"
                            />
                        ))}

                        {/* Axis Lines */}
                        {features.map((f, i) => {
                            const x =
                                center +
                                radius * Math.cos(angleSlice * i - Math.PI / 2);
                            const y =
                                center +
                                radius * Math.sin(angleSlice * i - Math.PI / 2);
                            return (
                                <line
                                    key={`line-${i}`}
                                    x1={center}
                                    y1={center}
                                    x2={x}
                                    y2={y}
                                    stroke="#cbd5e1"
                                    strokeWidth="1"
                                />
                            );
                        })}

                        {/* Axis Labels */}
                        {features.map((f, i) => {
                            const labelRadius = radius + 25;
                            const x =
                                center +
                                labelRadius *
                                    Math.cos(angleSlice * i - Math.PI / 2);
                            const y =
                                center +
                                labelRadius *
                                    Math.sin(angleSlice * i - Math.PI / 2);
                            return (
                                <text
                                    key={`label-${i}`}
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dy="0.35em"
                                    fill="#475569"
                                    fontSize="14px"
                                    fontWeight="600"
                                >
                                    {f}
                                </text>
                            );
                        })}

                        {/* Animated Polygon Path */}
                        <motion.path
                            initial={{ d: pathData }}
                            animate={{
                                d: pathData,
                                fill: selectedParty.color,
                                stroke: selectedParty.color,
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut",
                            }}
                            style={{
                                fillOpacity: 0.3,
                                strokeWidth: 2,
                            }}
                        />

                        {/* Animated Radar Points */}
                        {points.map((p, i) => {
                            const isActive = activeIdx === i;
                            return (
                                <motion.circle
                                    key={`point-${i}`}
                                    initial={{ cx: p.x, cy: p.y }}
                                    animate={{
                                        cx: p.x,
                                        cy: p.y,
                                        fill: selectedParty.color,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: "easeOut",
                                    }}
                                    r={isActive ? 8 : 6}
                                    stroke="#fff"
                                    strokeWidth={isActive ? 3 : 2}
                                />
                            );
                        })}
                    </svg>

                    {/* Dynamic Tooltip Overlay */}
                    <AnimatePresence>
                        {activeIdx !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-20 bg-slate-800 text-white p-3 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 w-48"
                                style={{
                                    left: `${(points[activeIdx].x / size) * 100}%`,
                                    top: `calc(${(points[activeIdx].y / size) * 100}% - 5px)`,
                                }}
                            >
                                <div className="text-center">
                                    <div className="text-xs text-slate-300 mb-1 font-medium uppercase tracking-wider">
                                        {points[activeIdx].axis}
                                    </div>
                                    <div className="text-sm font-light">
                                        จำนวนร่างกฎหมายที่เสนอ:
                                    </div>
                                    <div
                                        className="text-2xl font-bold mt-1 transition-colors duration-800"
                                        style={{ color: selectedParty.color }}
                                    >
                                        {points[activeIdx].bills}{" "}
                                        <span className="text-sm font-normal text-slate-300">
                                            ฉบับ
                                        </span>
                                    </div>
                                </div>
                                {/* Triangle Pointer */}
                                <div className="absolute w-3 h-3 bg-slate-800 transform rotate-45 left-1/2 -bottom-1.5 -translate-x-1/2"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
