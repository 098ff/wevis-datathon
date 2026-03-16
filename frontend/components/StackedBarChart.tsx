"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import * as d3 from "d3"
import { YearData, PartyData } from "../types"
import { getPartyPerformance } from "../apis/parties"
import { PartyPerformanceDTO } from "../types/dto"

const metricLabels: Record<string, string> = {
    votes: "จำนวนครั้งการลงมติ",
    multitask: "ภาระหน้าที่ฝ่ายบริหาร",
    passedLaws: "จำนวนกฎหมายที่เสนอและผ่าน",
}

// Fixed colors per metric across all bars
const metricColors: Record<string, string> = {
    votes: "#6366f1", // Indigo
    multitask: "#14b8a6", // Teal
    passedLaws: "#f59e0b", // Amber
}

interface TooltipInfo {
    visible: boolean
    x: number
    y: number
    year: string
    metricKey: string
    value: number
}

const StackedBarGroup = ({ party, isMock }: { party: PartyPerformanceDTO; isMock?: boolean }) => {
    const svgRef = useRef<SVGSVGElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [tooltip, setTooltip] = useState<TooltipInfo>({
        visible: false,
        x: 0,
        y: 0,
        year: "",
        metricKey: "",
        value: 0,
    })

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return

        const margin = { top: 20, right: 20, bottom: 30, left: 40 }
        const width = 320 - margin.left - margin.right
        const height = 240 - margin.top - margin.bottom

        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        const g = svg
            .attr(
                "viewBox",
                `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
            )
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        const subgroups = ["votes", "multitask", "passedLaws"] as const
        const groups = party.data.map((d) => d.year)

        const x = d3.scaleBand().domain(groups).range([0, width]).padding(0.3)

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .style("font-family", "inherit")
            .style("fill", "#64748b")
            .style("font-size", "12px")

        const maxVal =
            d3.max(party.data, (d) => d.votes + d.multitask + d.passedLaws) ||
            100
        const yMax = Math.ceil(maxVal / 10) * 10

        const y = d3.scaleLinear().domain([0, yMax]).range([height, 0])

        g.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .selectAll("text")
            .style("font-family", "inherit")
            .style("fill", "#64748b")
            .style("font-size", "12px")

        const stackedData = d3.stack<YearData>().keys(subgroups)(party.data)

        const rects = g
            .append("g")
            .selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", (d) => metricColors[d.key])
            .selectAll("rect")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.data.year)!)
            .attr("y", y(0))
            .attr("height", 0)
            .attr("width", x.bandwidth())
            .attr("rx", 2)
            .style("cursor", "pointer")

        // Hover interactions
        rects
            .on("mouseover", function (event, d) {
                const parentData = d3
                    .select((this as SVGElement).parentNode as SVGGElement)
                    .datum() as { key: string }
                const key = parentData.key

                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("stroke", "#334155")
                    .attr("stroke-width", 2)

                const [xPos, yPos] = d3.pointer(event, containerRef.current)
                setTooltip({
                    visible: true,
                    x: xPos,
                    y: yPos,
                    year: d.data.year,
                    metricKey: key,
                    value: d.data[key as keyof YearData] as number,
                })
            })
            .on("mousemove", function (event) {
                const [xPos, yPos] = d3.pointer(event, containerRef.current)
                setTooltip((prev) => ({ ...prev, x: xPos, y: yPos }))
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("stroke", "none")
                setTooltip((prev) => ({ ...prev, visible: false }))
            })

        rects
            .transition()
            .duration(800)
            .delay((d, i) => i * 150)
            .ease(d3.easeCubicOut)
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]))
    }, [party])

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative"
        >
            <div className="flex items-center justify-center mb-4 gap-3 w-full">
                {isMock ? (
                    <div
                        className="w-12 h-12 rounded-full border-[3px] shadow-sm shrink-0 flex items-center justify-center font-bold text-xs p-1 text-center"
                        style={{
                            borderColor: party.color,
                            backgroundColor: `${party.color}15`,
                            color: party.color,
                        }}
                    >
                        {party.name.replace("พรรค ","")}
                    </div>
                ) : (
                    <img
                        src={party.logoUrl}
                        alt={party.name}
                        className="w-12 h-12 rounded-full border-[3px] shadow-sm object-cover shrink-0"
                        style={{ borderColor: party.color }}
                    />
                )}
                <h4
                    className="font-bold text-lg truncate"
                    style={{ color: party.color }}
                    title={party.name}
                >
                    {party.name}
                </h4>
            </div>
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
                                    backgroundColor:
                                        metricColors[tooltip.metricKey],
                                    border: "1px solid rgba(255,255,255,0.2)",
                                }}
                            ></span>
                            {tooltip.value}{" "}
                            <span className="text-sm font-normal text-slate-300">
                                ครั้ง
                            </span>
                        </div>
                    </div>
                    {/* Triangle Pointer */}
                    <div className="absolute w-3 h-3 bg-slate-800 transform rotate-45 left-1/2 -bottom-1.5 -translate-x-1/2"></div>
                </div>
            )}
        </div>
    )
}

interface StackedBarChartProps {
    selectedPartyId?: string
    globalPartyData?: PartyData[]
    initialPerformanceData?: PartyPerformanceDTO[]
}

export default function StackedBarChart({
    selectedPartyId = "p1",
    globalPartyData = [],
    initialPerformanceData = [],
}: StackedBarChartProps = {}) {
    const [performanceData, setPerformanceData] = useState<
        PartyPerformanceDTO[]
    >(initialPerformanceData)

    useEffect(() => {
        if (initialPerformanceData.length > 0) {
            setPerformanceData(initialPerformanceData)
            return
        }

        getPartyPerformance()
            .then(setPerformanceData)
            .catch((err) =>
                console.error("Failed to load performance data", err),
            )
    }, [initialPerformanceData])

    // Map the global properties back to our performance data
    const getPartyInfo = (id: string, defaultInfo: { color: string; name: string; logoUrl: string }) => {
        const p = globalPartyData.find((gp) => gp.id === id)
        return {
            color: p ? p.color : defaultInfo.color,
            name: p ? p.name : defaultInfo.name,
            logoUrl: p ? p.logoUrl : defaultInfo.logoUrl,
        }
    }

    const enhancedData = useMemo(() => {
        return performanceData.map((p) => {
            const info = getPartyInfo(p.id, { color: p.color, name: p.name, logoUrl: p.logoUrl })
            return {
                ...p,
                ...info,
            }
        })
    }, [performanceData, globalPartyData])

    const selectedParty =
        enhancedData.find((p) => p.id === selectedPartyId) || enhancedData[0]

    const getPartyScore = (party: PartyPerformanceDTO) => {
        if (!party.data || party.data.length === 0) return 0
        const total = party.data.reduce(
            (sum, year) => sum + year.votes + year.multitask + year.passedLaws,
            0,
        )
        return total / party.data.length
    }

    const top3Parties: PartyPerformanceDTO[] = [...enhancedData]
        .filter((p) => p.id !== selectedParty?.id)
        .sort((a, b) => getPartyScore(b) - getPartyScore(a))
        .slice(0, 3)

    if (enhancedData.length === 0 || !selectedParty) {
        return (
            <div className="mt-8 p-12 bg-slate-50 rounded-3xl border border-slate-200 flex justify-center text-slate-400 animate-pulse">
                กำลังโหลดข้อมูล...
            </div>
        )
    }

    const isMock = initialPerformanceData.length > 0

    return (
        <section className="bg-slate-50 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mt-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-extrabold text-slate-800 mb-3">
                        Performance Breakdown (3 Years)
                    </h2>
                    <p className="text-slate-600 text-base leading-relaxed">
                        เปรียบเทียบผลงานตลอด 1 วาระ (3 ปี) ของพรรคที่คุณสนใจ
                        เทียบกับ 3 พรรคที่ทำผลงานได้ดีที่สุด
                        เพื่อให้เห็นภาพรวมและ Insight ที่ลึกขึ้น
                        (ชี้ที่กราฟเพื่อดูข้อมูล)
                    </p>
                </div>

                {/* Legend - Fixed Metric Colors */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm self-start shrink-0">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">
                        สัดส่วนข้อมูล
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: metricColors.votes }}
                            ></div>
                            <span>{metricLabels.votes}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{
                                    backgroundColor: metricColors.multitask,
                                }}
                            ></div>
                            <span>{metricLabels.multitask}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{
                                    backgroundColor: metricColors.passedLaws,
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
                            <StackedBarGroup
                                party={selectedParty}
                                isMock={isMock}
                            />
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
                            <StackedBarGroup
                                key={party.id}
                                party={party}
                                isMock={isMock}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
