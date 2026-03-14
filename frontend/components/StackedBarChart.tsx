"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface YearData {
    year: string;
    votes: number;
    multitask: number;
    passedLaws: number;
}

interface PartyPerformance {
    id: string;
    name: string;
    color: string;
    data: YearData[];
}

const mockData: PartyPerformance[] = [
    {
        id: "p1",
        name: "พรรค A",
        color: "#ef4444",
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
        data: [
            { year: "ปีที่ 1", votes: 35, multitask: 20, passedLaws: 10 },
            { year: "ปีที่ 2", votes: 38, multitask: 22, passedLaws: 12 },
            { year: "ปีที่ 3", votes: 40, multitask: 25, passedLaws: 15 },
            { year: "ปีที่ 4", votes: 42, multitask: 28, passedLaws: 18 },
        ],
    },
];

const metricLabels: Record<string, string> = {
    votes: "จำนวนครั้งการลงมติ",
    multitask: "จำนวนครั้งการ Multi-task",
    passedLaws: "จำนวนกฎหมายที่ร่างสำเร็จ",
};

// Define opacities for visual distinction
const metricOpacities: Record<string, number> = {
    votes: 1,
    multitask: 0.6,
    passedLaws: 0.3,
};

interface TooltipInfo {
    visible: boolean;
    x: number;
    y: number;
    year: string;
    metricKey: string;
    value: number;
    color: string;
}

const StackedBarGroup = ({ party }: { party: PartyPerformance }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<TooltipInfo>({
        visible: false,
        x: 0,
        y: 0,
        year: "",
        metricKey: "",
        value: 0,
        color: "",
    });

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 320 - margin.left - margin.right;
        const height = 240 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg
            .attr(
                "viewBox",
                `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
            )
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const subgroups = ["votes", "multitask", "passedLaws"] as const;
        const groups = party.data.map((d) => d.year);

        const x = d3.scaleBand().domain(groups).range([0, width]).padding(0.3);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .style("font-family", "inherit")
            .style("fill", "#64748b")
            .style("font-size", "12px");

        const maxVal =
            d3.max(party.data, (d) => d.votes + d.multitask + d.passedLaws) ||
            100;
        const yMax = Math.ceil(maxVal / 10) * 10;

        const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

        g.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .selectAll("text")
            .style("font-family", "inherit")
            .style("fill", "#64748b")
            .style("font-size", "12px");

        const stackedData = d3.stack<YearData>().keys(subgroups)(party.data);

        const rects = g
            .append("g")
            .selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", party.color)
            .attr("fill-opacity", (d) => metricOpacities[d.key])
            .selectAll("rect")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.data.year)!)
            .attr("y", y(0))
            .attr("height", 0)
            .attr("width", x.bandwidth())
            .attr("rx", 2)
            .style("cursor", "pointer");

        // Hover interactions
        rects
            .on("mouseover", function (event, d) {
                const parentData = d3
                    .select((this as SVGElement).parentNode as SVGGElement)
                    .datum() as { key: string };
                const key = parentData.key;

                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("stroke", "#334155")
                    .attr("stroke-width", 2);

                const [xPos, yPos] = d3.pointer(event, containerRef.current);
                setTooltip({
                    visible: true,
                    x: xPos,
                    y: yPos,
                    year: d.data.year,
                    metricKey: key,
                    value: d.data[key as keyof YearData] as number,
                    color: party.color,
                });
            })
            .on("mousemove", function (event) {
                const [xPos, yPos] = d3.pointer(event, containerRef.current);
                setTooltip((prev) => ({ ...prev, x: xPos, y: yPos }));
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("stroke", "none");
                setTooltip((prev) => ({ ...prev, visible: false }));
            });

        rects
            .transition()
            .duration(800)
            .delay((d, i) => i * 150)
            .ease(d3.easeCubicOut)
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]));
    }, [party]);

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative"
        >
            <h4
                className="font-bold text-lg mb-4"
                style={{ color: party.color }}
            >
                {party.name}
            </h4>
            <div className="w-full max-w-[320px]">
                <svg ref={svgRef} className="w-full h-auto"></svg>
            </div>

            {/* Tooltip Overlay */}
            {tooltip.visible && (
                <div
                    className="absolute z-20 bg-slate-800 text-white p-3 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full w-48 transition-opacity duration-150"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y - 10,
                    }}
                >
                    <div className="text-center">
                        <div className="text-xs text-slate-300 mb-1 font-medium tracking-wider">
                            {tooltip.year}
                        </div>
                        <div className="text-sm font-light mb-1">
                            {metricLabels[tooltip.metricKey]}
                        </div>
                        <div className="text-xl font-bold flex items-center justify-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full inline-block"
                                style={{
                                    backgroundColor: tooltip.color,
                                    opacity: metricOpacities[tooltip.metricKey],
                                    border: "1px solid rgba(255,255,255,0.2)",
                                }}
                            ></span>
                            {tooltip.value}{" "}
                            <span className="text-sm font-normal text-slate-300">
                                ครั้ง/ฉบับ
                            </span>
                        </div>
                    </div>
                    {/* Triangle Pointer */}
                    <div className="absolute w-3 h-3 bg-slate-800 transform rotate-45 left-1/2 -bottom-1.5 -translate-x-1/2"></div>
                </div>
            )}
        </div>
    );
};

interface StackedBarChartProps {
    selectedPartyId?: string;
}

export default function StackedBarChart({
    selectedPartyId = "p1",
}: StackedBarChartProps = {}) {
    const selectedParty =
        mockData.find((p) => p.id === selectedPartyId) || mockData[0];

    const top3Parties = mockData
        .filter((p) => p.id !== selectedParty.id)
        .slice(0, 3);

    while (top3Parties.length < 3 && mockData.length >= 3) {
        const remaining = mockData.find(
            (p) => !top3Parties.includes(p) && p.id !== selectedParty.id,
        );
        if (remaining) top3Parties.push(remaining);
        else break;
    }

    return (
        <section className="bg-slate-50 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mt-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-3">
                        Performance Breakdown (4 Years)
                    </h2>
                    <p className="text-slate-600 text-base leading-relaxed">
                        เปรียบเทียบผลงานตลอด 1 วาระ (4 ปี) ของพรรคที่คุณสนใจ
                        เทียบกับ 3 พรรคที่ทำผลงานได้ดีที่สุด
                        เพื่อให้เห็นภาพรวมและ Insight ที่ลึกขึ้น
                        (ชี้ที่กราฟเพื่อดูข้อมูล)
                    </p>
                </div>

                {/* Legend - Dynamically matches selected party color for clearer context */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm self-start shrink-0">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">
                        สัดส่วนข้อมูล (อ้างอิงสีตามพรรค)
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{
                                    backgroundColor: selectedParty.color,
                                    opacity: metricOpacities.votes,
                                }}
                            ></div>
                            <span>{metricLabels.votes}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{
                                    backgroundColor: selectedParty.color,
                                    opacity: metricOpacities.multitask,
                                }}
                            ></div>
                            <span>{metricLabels.multitask}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{
                                    backgroundColor: selectedParty.color,
                                    opacity: metricOpacities.passedLaws,
                                }}
                            ></div>
                            <span>{metricLabels.passedLaws}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-10">
                {/* Row 1: Selected Party */}
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                        พรรคที่คุณกำลังสนใจ
                    </h3>
                    <div className="flex justify-center">
                        <div className="w-full max-w-lg transform hover:scale-[1.02] transition-transform duration-300">
                            <StackedBarGroup party={selectedParty} />
                        </div>
                    </div>
                </div>

                {/* Row 2: Top 3 Parties */}
                <div>
                    <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                        เปรียบเทียบ Top 3 พรรคผลงานเด่น
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {top3Parties.map((party) => (
                            <StackedBarGroup key={party.id} party={party} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
