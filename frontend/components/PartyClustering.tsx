"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface PartyData {
    id: string;
    name: string;
    cluster: number;
    color: string;
    scoreX: number;
    scoreY: number;
    size: number;
}

const mockData: PartyData[] = [
    {
        id: "p1",
        name: "พรรค A",
        cluster: 1,
        color: "#ef4444",
        scoreX: 20,
        scoreY: 80,
        size: 40,
    },
    {
        id: "p2",
        name: "พรรค B",
        cluster: 1,
        color: "#f87171",
        scoreX: 30,
        scoreY: 70,
        size: 25,
    },
    {
        id: "p3",
        name: "พรรค C",
        cluster: 2,
        color: "#3b82f6",
        scoreX: 80,
        scoreY: 20,
        size: 35,
    },
    {
        id: "p4",
        name: "พรรค D",
        cluster: 2,
        color: "#60a5fa",
        scoreX: 70,
        scoreY: 30,
        size: 20,
    },
    {
        id: "p5",
        name: "พรรค E",
        cluster: 3,
        color: "#10b981",
        scoreX: 50,
        scoreY: 50,
        size: 30,
    },
];

export default function PartyClustering() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

    useEffect(() => {
        if (!svgRef.current) return;

        const { width, height } = dimensions;
        const margin = { top: 60, right: 60, bottom: 60, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous render

        const g = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
        const yScale = d3
            .scaleLinear()
            .domain([0, 100])
            .range([innerHeight, 0]);

        // Draw clusters (background bubbles)
        const clusters = Array.from(
            d3.group(mockData, (d) => d.cluster).entries(),
        );

        clusters.forEach(([clusterId, parties]) => {
            // Calculate cluster center
            const centerX = d3.mean(parties, (d) => d.scoreX) || 50;
            const centerY = d3.mean(parties, (d) => d.scoreY) || 50;

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
                .ease(d3.easeBounceOut)
                .attr("r", 90);

            g.append("text")
                .attr("x", xScale(centerX))
                .attr("y", yScale(centerY) - 100)
                .attr("text-anchor", "middle")
                .attr("fill", "#64748b")
                .attr("font-size", "14px")
                .text(`กลุ่มที่ ${clusterId}`)
                .attr("opacity", 0)
                .transition()
                .delay(800)
                .duration(800)
                .attr("opacity", 1);
        });

        // Draw parties
        const nodes = g
            .selectAll(".node")
            .data(mockData)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr(
                "transform",
                (d) => `translate(${xScale(d.scoreX)},${yScale(d.scoreY)})`,
            );

        nodes
            .append("circle")
            .attr("r", 0)
            .attr("fill", (d) => d.color)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .style("filter", "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))")
            .transition()
            .delay((d, i) => 800 + i * 150)
            .duration(1200)
            .ease(d3.easeElasticOut)
            .attr("r", (d) => d.size);

        nodes
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .attr("fill", "#fff")
            .attr("font-size", "12px")
            .attr("font-weight", "500")
            .text((d) => d.name)
            .attr("opacity", 0)
            .transition()
            .delay((d, i) => 1200 + i * 150)
            .duration(600)
            .attr("opacity", 1);

        // Draw Legend
        const legend = g
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${innerWidth - 80}, 0)`);

        clusters.forEach(([clusterId, parties], i) => {
            const legendRow = legend
                .append("g")
                .attr("transform", `translate(0, ${i * 25})`)
                .attr("opacity", 0);

            legendRow
                .append("circle")
                .attr("cx", 0)
                .attr("cy", -4)
                .attr("r", 6)
                .attr("fill", parties[0].color)
                .attr("opacity", 0.8);

            legendRow
                .append("text")
                .attr("x", 12)
                .attr("y", 0)
                .attr("font-size", "12px")
                .attr("fill", "#64748b")
                .attr("alignment-baseline", "middle")
                .text(`กลุ่มที่ ${clusterId}`);

            legendRow
                .transition()
                .delay(1800 + i * 200)
                .duration(600)
                .attr("opacity", 1);
        });
    }, [dimensions]);

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Party Clustering
                </h2>
                <p className="text-slate-500 text-sm">
                    อธิบายภาพรวมว่าแต่ละพรรคมี Character ยังไงด้วยการทำ
                    Clustering ตาม Score ที่เรากำหนด
                </p>
            </div>
            <div className="flex justify-center items-center overflow-x-auto">
                <svg ref={svgRef} className="max-w-full h-auto"></svg>
            </div>
        </section>
    );
}
