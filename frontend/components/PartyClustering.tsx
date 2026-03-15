"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { PartyData } from "../types";
import { extractPartyColors } from "../utils/colors";

export type { PartyData };
export { extractPartyColors };

import { SimulationNodeDatum } from "d3";

type SimNode = PartyData & SimulationNodeDatum;

export default function PartyClustering({
    initialData = [],
}: {
    initialData?: PartyData[];
}) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
    const [partyData, setPartyData] = useState<PartyData[]>(initialData);

    useEffect(() => {
        setPartyData(initialData);
    }, [initialData]);

    // Tooltip state
    const [tooltipInfo, setTooltipInfo] = useState<{
        visible: boolean;
        x: number;
        y: number;
        data: PartyData | null;
    }>({ visible: false, x: 0, y: 0, data: null });

    useEffect(() => {
        if (!svgRef.current) return;

        const { width, height } = dimensions;
        const margin = { top: 60, right: 100, bottom: 60, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width", "100%")
            .attr("height", "100%");

        // layer สำหรับ chart
        const chartLayer = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // layer สำหรับ legend (ไม่ zoom)
        const legendLayer = svg.append("g")
            .attr("transform", `translate(${width - 120}, ${margin.top})`);

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 8])
            .on("zoom", (event) => {

                chartLayer.attr("transform", event.transform);

                const k = event.transform.k;

                // ยิ่ง zoom in collision ยิ่งใหญ่
                const collide = d3.forceCollide(nodeRadius * k * 0.8);

                simulation.force("collide", collide);

                simulation.alpha(0.3).restart();
            });

        svg.call(zoom);

        const g = chartLayer;

        const xExtent = d3.extent(partyData, d => d.scoreX) as [number, number];
        const yExtent = d3.extent(partyData, d => d.scoreY) as [number, number];

        const xScale = d3.scaleLinear()
            .domain(xExtent)
            .nice()
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain(yExtent)
            .nice()
            .range([innerHeight, 0]);

        const clusters = Array.from(
            d3.group(partyData, d => d.cluster).entries(),
        );

        clusters.forEach(([clusterId, parties]) => {

            const centerX = d3.mean(parties, d => d.scoreX) || 50;
            const centerY = d3.mean(parties, d => d.scoreY) || 50;

            g.append("circle")
                .attr("cx", xScale(centerX))
                .attr("cy", yScale(centerY))
                .attr("r", 0)
                .attr("fill", parties[0].color)
                .attr("opacity", 0.1)
                .attr("stroke", parties[0].color)
                .attr("stroke-dasharray", "4,4")
                .transition()
                .duration(1200)
                .attr("r", 110);

            g.append("text")
                .attr("x", xScale(centerX))
                .attr("y", yScale(centerY) - 120)
                .attr("text-anchor", "middle")
                .attr("fill", "#64748b")
                .attr("font-size", "14px")
                .text(`กลุ่มที่ ${clusterId}`);
        });

        const nodeRadius = 25;
        const logoSize = nodeRadius * 1.4;

        const nodes = g
            .selectAll(".node")
            .data(partyData)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr(
                "transform",
                d => `translate(${xScale(d.scoreX)},${yScale(d.scoreY)})`
            )
            .style("cursor", "pointer")
            .on("mouseover", (event, d) => {
                const [x, y] = d3.pointer(event, containerRef.current);
                setTooltipInfo({
                    visible: true,
                    x,
                    y,
                    data: d,
                });
            })
            .on("mousemove", (event) => {
                const [x, y] = d3.pointer(event, containerRef.current);
                setTooltipInfo((prev) => ({ ...prev, x, y }));
            })
            .on("mouseout", () => {
                setTooltipInfo((prev) => ({ ...prev, visible: false }));
            });

        const simData = partyData as SimNode[];

        const simulation = d3.forceSimulation<SimNode>(simData)
            .force(
                "x",
                d3.forceX<SimNode>((d) => xScale(d.scoreX)).strength(0.9)
            )
            .force(
                "y",
                d3.forceY<SimNode>((d) => yScale(d.scoreY)).strength(0.9)
            )
            .force(
                "charge",
                d3.forceManyBody().strength(-15)
            )
            .force(
                "collide",
                d3.forceCollide(nodeRadius + 4)
            )
            .alphaDecay(0.02)
            .on("tick", () => {
                nodes.attr("transform", (d: SimNode) => `translate(${d.x},${d.y})`);
            });

        for (let i = 0; i < 200; i++) simulation.tick();

        nodes.attr("transform", (d: SimNode) => `translate(${d.x},${d.y})`);

        const defs = g.append("defs");

        nodes.each(function (d) {
            defs.append("clipPath")
                .attr("id", `clip-${d.id}`)
                .append("circle")
                .attr("r", nodeRadius);
        });

        nodes
            .append("circle")
            .attr("r", nodeRadius)
            .attr("fill", "#fff")
            .attr("stroke", d => d.color)
            .attr("stroke-width", 3);

        nodes
            .append("image")
            .attr("href", d => d.logoUrl)
            .attr("x", -logoSize / 2)
            .attr("y", -logoSize / 2)
            .attr("width", logoSize)
            .attr("height", logoSize)
            .attr("clip-path", d => `url(#clip-${d.id})`);

        nodes
            .append("text")
            .attr("text-anchor", "middle")
            .attr("y", nodeRadius + 18)
            .attr("font-size", "12px")
            .attr("fill", "#334155")
            .text(d => d.name);

        // legend (fixed)
        const legend = legendLayer;

        clusters.forEach(([clusterId, parties], i) => {

            const row = legend.append("g")
                .attr("transform", `translate(0, ${i * 25})`);

            row.append("circle")
                .attr("r", 6)
                .attr("fill", parties[0].color);

            row.append("text")
                .attr("x", 12)
                .attr("y", 4)
                .attr("font-size", "12px")
                .attr("fill", "#64748b")
                .text(`กลุ่มที่ ${clusterId}`);
        });

    }, [dimensions, partyData]);

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Party Clustering
                </h2>
                <p className="text-slate-500 text-sm">
                    อธิบายภาพรวมว่าแต่ละพรรคมี Character ยังไงด้วยการทำ
                    Clustering ตาม Score ที่เรากำหนด
                </p>
            </div>
            <div
                ref={containerRef}
                className="flex justify-center items-center overflow-visible relative"
            >
                <svg
                    ref={svgRef}
                    className="max-w-full h-auto"
                    style={{ minHeight: "500px" }}
                ></svg>

                {/* Tooltip overlay */}
                {tooltipInfo.visible && tooltipInfo.data && (
                    <div
                        className="absolute z-[100] bg-white p-4 rounded-xl shadow-2xl border border-slate-200 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4 w-80 transition-opacity duration-200"
                        style={{
                            left: tooltipInfo.x,
                            top: tooltipInfo.y - 15,
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3 border-b border-slate-100 pb-2">
                            <img
                                src={tooltipInfo.data.logoUrl}
                                alt={tooltipInfo.data.name}
                                className="w-8 h-8 rounded-full border-2"
                                style={{ borderColor: tooltipInfo.data.color }}
                            />
                            <h4
                                className="font-bold text-slate-800"
                                style={{ color: tooltipInfo.data.color }}
                            >
                                {tooltipInfo.data.name}
                            </h4>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex justify-between items-start gap-2">
                                <span className="font-medium shrink-0">
                                    ประเภทร่างกฎหมาย:
                                </span>
                                <span className="text-right text-slate-800">
                                    {tooltipInfo.data.metrics.billTypes}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    ความเป็นเอกภาพ:
                                </span>
                                <span className="text-slate-800">
                                    {tooltipInfo.data.metrics.unity}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    อัตราร่างกฎหมายสำเร็จ:
                                </span>
                                <span className="text-slate-800">
                                    {tooltipInfo.data.metrics.successRate}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    อัตราการมาลงมติ:
                                </span>
                                <span className="text-slate-800">
                                    {tooltipInfo.data.metrics.attendanceRate}%
                                </span>
                            </div>
                            {/*<div className="flex justify-between items-start gap-2">
                                <span className="font-medium shrink-0">
                                    พฤติกรรมการ Vote:
                                </span>
                                <span className="text-right text-slate-800">
                                    {tooltipInfo.data.metrics.votingAlignment}
                                </span>
                            </div>*/}
                        </div>

                        {/* Triangle pointer */}
                        <div className="absolute w-3 h-3 bg-white border-b border-r border-slate-200 transform rotate-45 left-1/2 -bottom-1.5 -translate-x-1/2"></div>
                    </div>
                )}
            </div>
        </section>
    );
}
