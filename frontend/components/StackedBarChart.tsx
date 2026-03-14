"use client";

import { useEffect, useRef } from "react";
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

const metricLabels = {
    votes: "จำนวนครั้งการลงมติ",
    multitask: "จำนวนครั้งการ Multi-task",
    passedLaws: "จำนวนกฎหมายที่ร่างสำเร็จ",
};

const StackedBarGroup = ({ party }: { party: PartyPerformance }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

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

        // Find max total value across all years to scale Y axis appropriately
        const maxVal =
            d3.max(party.data, (d) => d.votes + d.multitask + d.passedLaws) ||
            100;
        const yMax = Math.ceil(maxVal / 10) * 10; // Round up to nearest 10

        const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

        g.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .selectAll("text")
            .style("font-family", "inherit")
            .style("fill", "#64748b")
            .style("font-size", "12px");

        // Create 3 shades of the party color for the 3 segments
        const baseColor = d3.color(party.color) || d3.color("#cbd5e1")!;
        const colorScale = d3
            .scaleOrdinal<string>()
            .domain(subgroups)
            .range([
                baseColor.formatHex(), // Votes (Base)
                baseColor.brighter(0.8).formatHex(), // Multi-task (Lighter)
                baseColor.brighter(1.6).formatHex(), // Passed Laws (Lightest)
            ]);

        // @ts-ignore - d3 types for stack are sometimes tricky with specific interfaces
        const stackedData = d3.stack<YearData>().keys(subgroups)(party.data);

        const rects = g
            .append("g")
            .selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", (d) => colorScale(d.key))
            .selectAll("rect")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.data.year)!)
            .attr("y", y(0))
            .attr("height", 0)
            .attr("width", x.bandwidth())
            .attr("rx", 2);

        rects
            .transition()
            .duration(800)
            .delay((d, i) => i * 150)
            .ease(d3.easeCubicOut)
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]));
    }, [party]);

    return (
        <div className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h4
                className="font-bold text-lg mb-4"
                style={{ color: party.color }}
            >
                {party.name}
            </h4>
            <div className="w-full max-w-[320px]">
                <svg ref={svgRef} className="w-full h-auto"></svg>
            </div>
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

    // Top 3 parties (excluding the currently selected one to show variety, or just statically the top 3 overall)
    // For this example, we'll just take p2, p3, p4 as the "Top 3" defaults.
    const top3Parties = mockData
        .filter((p) => p.id !== selectedParty.id)
        .slice(0, 3);

    // Fallback if we don't have enough data
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
                    </p>
                </div>

                {/* Legend */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm self-start shrink-0">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">
                        สัดส่วนข้อมูล (ไล่สีจากเข้มไปอ่อน)
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-slate-800"></div>
                            <span>{metricLabels.votes}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-slate-500"></div>
                            <span>{metricLabels.multitask}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-slate-300"></div>
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
