"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface PerformanceData {
    category: string;
    value1: number;
    value2: number;
}

interface PartyPerformance {
    id: string;
    name: string;
    color: string;
    data: PerformanceData[];
}

const mockData: PartyPerformance[] = [
    {
        id: "p1",
        name: "พรรค A (Selected)",
        color: "#ef4444",
        data: [
            { category: "ลงมติ", value1: 80, value2: 20 },
            { category: "Multi-task", value1: 45, value2: 55 },
            { category: "กม.ผ่าน", value1: 30, value2: 70 },
            { category: "กระทู้", value1: 60, value2: 40 },
        ],
    },
    {
        id: "p2",
        name: "พรรค B (Top 1)",
        color: "#3b82f6",
        data: [
            { category: "ลงมติ", value1: 90, value2: 10 },
            { category: "Multi-task", value1: 30, value2: 70 },
            { category: "กม.ผ่าน", value1: 50, value2: 50 },
            { category: "กระทู้", value1: 75, value2: 25 },
        ],
    },
    {
        id: "p3",
        name: "พรรค C (Top 2)",
        color: "#10b981",
        data: [
            { category: "ลงมติ", value1: 70, value2: 30 },
            { category: "Multi-task", value1: 60, value2: 40 },
            { category: "กม.ผ่าน", value1: 20, value2: 80 },
            { category: "กระทู้", value1: 50, value2: 50 },
        ],
    },
    {
        id: "p4",
        name: "พรรค D (Top 3)",
        color: "#f59e0b",
        data: [
            { category: "ลงมติ", value1: 85, value2: 15 },
            { category: "Multi-task", value1: 40, value2: 60 },
            { category: "กม.ผ่าน", value1: 40, value2: 60 },
            { category: "กระทู้", value1: 65, value2: 35 },
        ],
    },
];

const StackedBarGroup = ({ party }: { party: PartyPerformance }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 300 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const subgroups = ["value1", "value2"];
        const groups = party.data.map((d) => d.category);

        const x = d3.scaleBand().domain(groups).range([0, width]).padding(0.2);

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .style("font-family", "inherit")
            .style("fill", "#64748b");

        const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

        g.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .selectAll("text")
            .style("font-family", "inherit")
            .style("fill", "#64748b");

        const color = d3
            .scaleOrdinal<string>()
            .domain(subgroups)
            .range([party.color, "#e2e8f0"]);

        const stackedData = d3.stack<PerformanceData>().keys(subgroups)(
            party.data,
        );

        g.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", (d) => color(d.key))
            .selectAll("rect")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.data.category)!)
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("rx", 2);
    }, [party]);

    return (
        <div className="flex flex-col items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4
                className="font-semibold text-slate-700 mb-2"
                style={{ color: party.color }}
            >
                {party.name}
            </h4>
            <svg ref={svgRef}></svg>
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

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Party Performance
                </h2>
                <p className="text-slate-500 text-sm">
                    เปรียบเทียบข้อมูล Performance ของพรรคที่เลือกกับ Top 3 พรรค
                </p>
            </div>

            <div className="flex flex-col gap-8">
                {/* Row 1: Selected Party */}
                <div>
                    <h3 className="text-lg font-medium text-slate-600 mb-4 border-b pb-2">
                        พรรคที่เลือก
                    </h3>
                    <div className="flex justify-center">
                        <StackedBarGroup party={selectedParty} />
                    </div>
                </div>

                {/* Row 2: Top 3 Parties */}
                <div>
                    <h3 className="text-lg font-medium text-slate-600 mb-4 border-b pb-2">
                        Top 3 พรรคผลงานเด่น
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StackedBarGroup party={mockData[1]} />
                        <StackedBarGroup party={mockData[2]} />
                        <StackedBarGroup party={mockData[3]} />
                    </div>
                </div>
            </div>
        </section>
    );
}
