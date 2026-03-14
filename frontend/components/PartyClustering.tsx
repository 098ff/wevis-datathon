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
    logoUrl: string;
    metrics: {
        billTypes: string;
        unity: number;
        successRate: number;
        attendanceRate: number;
        votingAlignment: string;
    };
}

const mockData: PartyData[] = [
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

export default function PartyClustering() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
    const [partyData, setPartyData] = useState<PartyData[]>(mockData);

    useEffect(() => {
        let isMounted = true;

        const extractColors = async () => {
            const updated = await Promise.all(
                mockData.map((party) => {
                    return new Promise<PartyData>((resolve) => {
                        const img = new window.Image();
                        img.crossOrigin = "Anonymous";
                        img.src = party.logoUrl;
                        img.onload = () => {
                            const canvas = document.createElement("canvas");
                            const ctx = canvas.getContext("2d", {
                                willReadFrequently: true,
                            });
                            if (!ctx) return resolve(party);

                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);

                            try {
                                const imageData = ctx.getImageData(
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height,
                                );
                                const data = imageData.data;
                                const colorCounts: Record<string, number> = {};
                                let maxCount = 0;
                                let dominant = party.color;

                                for (let i = 0; i < data.length; i += 4) {
                                    const r = data[i];
                                    const g = data[i + 1];
                                    const b = data[i + 2];
                                    const a = data[i + 3];

                                    if (a < 128) continue;

                                    // Calculate luminance to aggressively avoid white/light backgrounds
                                    const luminance =
                                        0.299 * r + 0.587 * g + 0.114 * b;
                                    if (luminance > 220) continue;

                                    // Prefer darker shades: artificially lower RGB values for mid-to-light colors
                                    const darken = luminance > 150 ? 0.75 : 1;
                                    const dR = Math.floor(r * darken);
                                    const dG = Math.floor(g * darken);
                                    const dB = Math.floor(b * darken);

                                    const qR = Math.round(dR / 20) * 20;
                                    const qG = Math.round(dG / 20) * 20;
                                    const qB = Math.round(dB / 20) * 20;
                                    const key = `${qR},${qG},${qB}`;

                                    colorCounts[key] =
                                        (colorCounts[key] || 0) + 1;
                                    if (colorCounts[key] > maxCount) {
                                        maxCount = colorCounts[key];
                                        dominant = `rgb(${dR},${dG},${dB})`;
                                    }
                                }

                                if (dominant.startsWith("rgb")) {
                                    const rgbParts = dominant.match(/\d+/g);
                                    if (rgbParts && rgbParts.length === 3) {
                                        const hex =
                                            "#" +
                                            rgbParts
                                                .map((x) =>
                                                    parseInt(x)
                                                        .toString(16)
                                                        .padStart(2, "0"),
                                                )
                                                .join("");
                                        resolve({ ...party, color: hex });
                                        return;
                                    }
                                }
                                resolve({ ...party, color: dominant });
                            } catch (e) {
                                resolve(party);
                            }
                        };
                        img.onerror = () => resolve(party);
                    });
                }),
            );

            if (isMounted) {
                setPartyData(updated);
            }
        };

        extractColors();

        return () => {
            isMounted = false;
        };
    }, []);

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

        const g = svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("width", "100%")
            .attr("height", "100%")
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
            d3.group(partyData, (d) => d.cluster).entries(),
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
                .attr("r", 110);

            g.append("text")
                .attr("x", xScale(centerX))
                .attr("y", yScale(centerY) - 120)
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

        const nodeRadius = 25; // Fixed size for all parties

        // Draw parties
        const nodes = g
            .selectAll(".node")
            .data(partyData)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr(
                "transform",
                (d) => `translate(${xScale(d.scoreX)},${yScale(d.scoreY)})`,
            )
            .style("cursor", "pointer")
            .on("mouseover", (event, d) => {
                const [x, y] = d3.pointer(event, containerRef.current);
                setTooltipInfo({
                    visible: true,
                    x: x,
                    y: y,
                    data: d,
                });
                d3.select(event.currentTarget)
                    .select("circle")
                    .transition()
                    .duration(200)
                    .attr("stroke-width", 5)
                    .attr("r", nodeRadius + 5);
            })
            .on("mousemove", (event) => {
                const [x, y] = d3.pointer(event, containerRef.current);
                setTooltipInfo((prev) => ({ ...prev, x, y }));
            })
            .on("mouseout", (event) => {
                setTooltipInfo((prev) => ({ ...prev, visible: false }));
                d3.select(event.currentTarget)
                    .select("circle")
                    .transition()
                    .duration(200)
                    .attr("stroke-width", 3)
                    .attr("r", nodeRadius);
            });

        // Add defs for clip path
        const defs = g.append("defs");
        nodes.each(function (d, i) {
            defs.append("clipPath")
                .attr("id", `clip-${d.id}`)
                .append("circle")
                .attr("r", nodeRadius);
        });

        nodes
            .append("circle")
            .attr("r", 0)
            .attr("fill", "#fff")
            .attr("stroke", (d) => d.color)
            .attr("stroke-width", 3)
            .style("filter", "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))")
            .transition()
            .delay((d, i) => 800 + i * 150)
            .duration(1200)
            .ease(d3.easeElasticOut)
            .attr("r", nodeRadius);

        nodes
            .append("image")
            .attr("href", (d) => d.logoUrl)
            .attr("x", -nodeRadius)
            .attr("y", -nodeRadius)
            .attr("width", nodeRadius * 2)
            .attr("height", nodeRadius * 2)
            .attr("clip-path", (d) => `url(#clip-${d.id})`)
            .attr("opacity", 0)
            .transition()
            .delay((d, i) => 1200 + i * 150)
            .duration(600)
            .attr("opacity", 1);

        nodes
            .append("text")
            .attr("text-anchor", "middle")
            .attr("y", nodeRadius + 18)
            .attr("fill", "#334155")
            .attr("font-size", "12px")
            .attr("font-weight", "600")
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
            .attr("transform", `translate(${innerWidth + 20}, 0)`);

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
                            <div className="flex justify-between items-start gap-2">
                                <span className="font-medium shrink-0">
                                    พฤติกรรมการ Vote:
                                </span>
                                <span className="text-right text-slate-800">
                                    {tooltipInfo.data.metrics.votingAlignment}
                                </span>
                            </div>
                        </div>

                        {/* Triangle pointer */}
                        <div className="absolute w-3 h-3 bg-white border-b border-r border-slate-200 transform rotate-45 left-1/2 -bottom-1.5 -translate-x-1/2"></div>
                    </div>
                )}
            </div>
        </section>
    );
}
