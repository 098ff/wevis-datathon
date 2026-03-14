"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Metric {
    axis: string;
    value: number;
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
            { axis: "เศรษฐกิจ", value: 80 },
            { axis: "การศึกษา", value: 60 },
            { axis: "สิ่งแวดล้อม", value: 40 },
            { axis: "สังคม", value: 70 },
            { axis: "การเมือง", value: 90 },
        ],
    },
    {
        id: "p2",
        name: "พรรค B",
        color: "#3b82f6", // Blue
        metrics: [
            { axis: "เศรษฐกิจ", value: 50 },
            { axis: "การศึกษา", value: 80 },
            { axis: "สิ่งแวดล้อม", value: 90 },
            { axis: "สังคม", value: 60 },
            { axis: "การเมือง", value: 40 },
        ],
    },
    {
        id: "p3",
        name: "พรรค C",
        color: "#10b981", // Green
        metrics: [
            { axis: "เศรษฐกิจ", value: 60 },
            { axis: "การศึกษา", value: 70 },
            { axis: "สิ่งแวดล้อม", value: 80 },
            { axis: "สังคม", value: 80 },
            { axis: "การเมือง", value: 60 },
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
    const svgRef = useRef<SVGSVGElement>(null);
    const [localPartyId, setLocalPartyId] = useState<string>(mockParties[0].id);

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

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 450;
        const height = 450;
        const margin = 50;
        const radius = Math.min(width, height) / 2 - margin;
        const features = selectedParty.metrics.map((m) => m.axis);
        const data = selectedParty.metrics.map((m) => m.value);

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        const g = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const rScale = d3.scaleLinear().range([0, radius]).domain([0, 100]);
        const ticks = [20, 40, 60, 80, 100];
        const angleSlice = (Math.PI * 2) / features.length;

        // Draw grid circles
        g.selectAll(".grid-circle")
            .data(ticks)
            .enter()
            .append("circle")
            .attr("class", "grid-circle")
            .attr("r", (d) => rScale(d))
            .style("fill", "none")
            .style("stroke", "#e2e8f0")
            .style("stroke-dasharray", "3,3");

        // Draw axis lines
        const axis = g
            .selectAll(".axis")
            .data(features)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr(
                "x2",
                (d, i) => rScale(100) * Math.cos(angleSlice * i - Math.PI / 2),
            )
            .attr(
                "y2",
                (d, i) => rScale(100) * Math.sin(angleSlice * i - Math.PI / 2),
            )
            .attr("class", "line")
            .style("stroke", "#cbd5e1")
            .style("stroke-width", "1px");

        // Draw axis labels
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "14px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr(
                "x",
                (d, i) => rScale(115) * Math.cos(angleSlice * i - Math.PI / 2),
            )
            .attr(
                "y",
                (d, i) => rScale(115) * Math.sin(angleSlice * i - Math.PI / 2),
            )
            .text((d) => d)
            .style("fill", "#475569")
            .style("font-weight", "500");

        // Generate radar line path
        const radarLine = d3
            .lineRadial<number>()
            .angle((d, i) => i * angleSlice)
            .radius((d) => rScale(d))
            .curve(d3.curveLinearClosed);

        // Draw the polygon
        g.append("path")
            .datum(data)
            .attr("d", radarLine)
            .style("fill", selectedParty.color)
            .style("fill-opacity", 0.3)
            .style("stroke", selectedParty.color)
            .style("stroke-width", 2);

        // Draw points on the polygon
        g.selectAll(".radar-point")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "radar-point")
            .attr("r", 5)
            .attr(
                "cx",
                (d, i) => rScale(d) * Math.cos(angleSlice * i - Math.PI / 2),
            )
            .attr(
                "cy",
                (d, i) => rScale(d) * Math.sin(angleSlice * i - Math.PI / 2),
            )
            .style("fill", selectedParty.color)
            .style("stroke", "#fff")
            .style("stroke-width", 2);
    }, [selectedParty]);

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Party Characteristics
                    </h2>
                    <p className="text-slate-500 text-sm mb-4">
                        Spider Chart แสดงสัดส่วนจุดเด่นนโยบายของแต่ละพรรค
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
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-colors"
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
                    <ul className="space-y-3">
                        {selectedParty.metrics.map((metric, idx) => (
                            <li
                                key={idx}
                                className="flex justify-between items-center bg-slate-50 px-4 py-2 rounded-lg border border-slate-100"
                            >
                                <span className="text-slate-600 font-medium">
                                    {metric.axis}
                                </span>
                                <span
                                    className="font-bold text-lg"
                                    style={{ color: selectedParty.color }}
                                >
                                    {metric.value}%
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex-1 flex justify-center items-center">
                <svg
                    ref={svgRef}
                    className="max-w-full h-auto drop-shadow-sm"
                ></svg>
            </div>
        </section>
    );
}
