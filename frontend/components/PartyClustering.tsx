"use client";

import { useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Billboard, Text, Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";
import { PartyData } from "../types";
import { extractPartyColors } from "../utils/colors";

export type { PartyData };
export { extractPartyColors };

interface TooltipInfo {
    visible: boolean;
    x: number;
    y: number;
    data: PartyData | null;
}

function PartyNode({
    data,
    setTooltipInfo,
    selectedCluster,
    onSelect,
}: {
    data: PartyData;
    setTooltipInfo: (info: any) => void;
    selectedCluster: string | null;
    onSelect: (cluster: string) => void;
}) {
    const [hovered, setHovered] = useState(false);

    // Scaling the PC values for better spread in 3D space
    const position: [number, number, number] = useMemo(() => {
        return [data.pc1 * 8, data.pc2 * 8, data.pc3 * 8];
    }, [data.pc1, data.pc2, data.pc3]);

    const isDimmed = selectedCluster !== null && String(data.cluster) !== selectedCluster;
    const opacity = isDimmed ? 0.15 : 1.0;
    const scale = hovered && !isDimmed ? 1.4 : 1.2;
    const imgScale = hovered && !isDimmed ? 2.4 : 2;

    return (
        <Billboard
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(String(data.cluster));
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                if (isDimmed) return;
                setHovered(true);
                // Approximate HTML coordinates from pointer event
                setTooltipInfo({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    data,
                });
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                if (isDimmed) return;
                setHovered(false);
                setTooltipInfo((prev: any) => ({ ...prev, visible: false }));
            }}
            onPointerMove={(e) => {
                if (hovered && !isDimmed) {
                    setTooltipInfo((prev: any) => ({
                        ...prev,
                        x: e.clientX,
                        y: e.clientY,
                    }));
                }
            }}
        >
            <mesh>
                <circleGeometry args={[scale, 32]} />
                <meshBasicMaterial 
                    color={isDimmed ? "#94a3b8" : (data.clusterColor || data.color)} 
                    transparent 
                    opacity={opacity} 
                />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
                <circleGeometry args={[scale - 0.1, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
            </mesh>
            <DreiImage
                url={data.logoUrl}
                transparent
                opacity={opacity}
                radius={scale - 0.2}
                position={[0, 0, 0.02]}
                scale={imgScale}
            />
            {/* Optional name tag below the logo */}
            {hovered && !isDimmed && (
                <Text
                    position={[0, -1.8, 0.02]}
                    fontSize={0.4}
                    color="#334155"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.05}
                    outlineColor="#ffffff"
                >
                    {data.name}
                </Text>
            )}
        </Billboard>
    );
}

export default function PartyClustering({
    initialData = [],
}: {
    initialData?: PartyData[];
}) {
    const [partyData, setPartyData] = useState<PartyData[]>(initialData);
    const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo>({
        visible: false,
        x: 0,
        y: 0,
        data: null,
    });
    const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

    const handleSelectCluster = (clusterId: string) => {
        setSelectedCluster((prev) => (prev === clusterId ? null : clusterId));
    };

    useEffect(() => {
        setPartyData(initialData);
    }, [initialData]);

    const clusterCentroids = useMemo(() => {
        const sums: Record<
            string,
            { count: number; x: number; y: number; z: number; color: string }
        > = {};
        
        // Pass 1: Sum coordinates
        partyData.forEach((p) => {
            const c = String(p.cluster);
            if (!sums[c]) {
                sums[c] = { count: 0, x: 0, y: 0, z: 0, color: p.clusterColor || p.color };
            }
            sums[c].count++;
            sums[c].x += p.pc1 * 8;
            sums[c].y += p.pc2 * 8;
            sums[c].z += p.pc3 * 8;
        });

        // Calculate actual centroids
        const centroids: Record<string, { x: number; y: number; z: number; color: string; maxDist: number }> = {};
        Object.entries(sums).forEach(([id, data]) => {
            centroids[id] = {
                x: data.x / data.count,
                y: data.y / data.count,
                z: data.z / data.count,
                color: data.color,
                maxDist: 0
            };
        });

        // Pass 2: Find max distance from centroid for each cluster
        partyData.forEach((p) => {
            const c = String(p.cluster);
            const centroid = centroids[c];
            if (centroid) {
                const px = p.pc1 * 8;
                const py = p.pc2 * 8;
                const pz = p.pc3 * 8;
                const dist = Math.sqrt(
                    Math.pow(px - centroid.x, 2) + 
                    Math.pow(py - centroid.y, 2) + 
                    Math.pow(pz - centroid.z, 2)
                );
                if (dist > centroid.maxDist) {
                    centroid.maxDist = dist;
                }
            }
        });

        return Object.entries(centroids).map(([id, data]) => ({
            id,
            x: data.x,
            y: data.y,
            z: data.z,
            color: data.color,
            radius: Math.max(8, data.maxDist),
        }));
    }, [partyData]);

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Party Clustering (3D)
                    </h2>
                    <p className="text-slate-500 text-sm">
                        อธิบายภาพรวมว่าแต่ละพรรคมี Character ยังไงด้วยการทำ
                        Clustering (PC1, PC2, PC3) โดยสามารถหมุนและซูมดูได้
                    </p>
                </div>
            </div>

            <div
                className="w-full relative touch-none bg-slate-50 rounded-xl overflow-hidden border border-slate-100"
                style={{ height: "600px" }}
            >
                <Canvas 
                    camera={{ position: [0, 0, 25], fov: 50 }} 
                    onPointerMissed={() => setSelectedCluster(null)}
                >
                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <axesHelper args={[40]} />
                    <gridHelper args={[60, 60, '#cbd5e1', '#f1f5f9']} position={[0, -20, 0]} />
                    
                    {/* Render Cluster Fog Spheres */}
                    {clusterCentroids.map((c) => (
                        <mesh key={`fog-${c.id}`} position={[c.x, c.y, c.z]}>
                            <sphereGeometry args={[c.radius, 32, 32]} />
                            <shaderMaterial
                                transparent
                                depthWrite={false}
                                side={THREE.DoubleSide}
                                uniforms={{
                                    color: { value: new THREE.Color(c.color) },
                                    uOpacityMult: { value: selectedCluster !== null && selectedCluster !== String(c.id) ? 0.0 : 1.0 }
                                }}
                                vertexShader={`
                                    varying vec3 vNormal;
                                    void main() {
                                        vNormal = normalize(normalMatrix * normal);
                                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                    }
                                `}
                                fragmentShader={`
                                    uniform vec3 color;
                                    uniform float uOpacityMult;
                                    varying vec3 vNormal;
                                    void main() {
                                        // Creates a volumetric soft fade-out from center to edges
                                        float intensity = pow(abs(vNormal.z), 1.8) * 0.2 * uOpacityMult;
                                        gl_FragColor = vec4(color, intensity);
                                    }
                                `}
                            />
                        </mesh>
                    ))}

                    {partyData.map((party) => (
                        <PartyNode
                            key={party.id}
                            data={party}
                            setTooltipInfo={setTooltipInfo}
                            selectedCluster={selectedCluster}
                            onSelect={handleSelectCluster}
                        />
                    ))}

                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        rotateSpeed={0.8}
                        zoomSpeed={1.2}
                        minDistance={5}
                        maxDistance={50}
                    />
                </Canvas>

                {/* Legend Overlay */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm pointer-events-none">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">กลุ่ม (Clusters)</h4>
                    {Array.from(new Set(partyData.map((p) => p.cluster))).map(
                        (clusterId) => {
                            const sampleParty = partyData.find((p) => p.cluster === clusterId);
                            if (!sampleParty) return null;
                            const isDimmed = selectedCluster !== null && selectedCluster !== String(clusterId);
                            return (
                                <div 
                                    key={clusterId} 
                                    className={`flex items-center gap-2 mb-1.5 last:mb-0 cursor-pointer transition-opacity hover:opacity-100 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                                    onClick={() => handleSelectCluster(String(clusterId))}
                                >
                                    <div 
                                        className="w-3 h-3 rounded-full shadow-sm" 
                                        style={{ backgroundColor: sampleParty.clusterColor || sampleParty.color }}
                                    />
                                    <span className="text-sm font-medium text-slate-700">กลุ่มที่ {clusterId}</span>
                                </div>
                            );
                        }
                    )}
                </div>

                {/* Tooltip Overlay */}
                {tooltipInfo.visible && tooltipInfo.data && (
                    <div
                        className="fixed z-[100] bg-white p-4 rounded-xl shadow-2xl border border-slate-200 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4 w-80 transition-opacity duration-200"
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
                                style={{ borderColor: tooltipInfo.data.clusterColor || tooltipInfo.data.color }}
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
                                    กลุ่ม Cluster:
                                </span>
                                <span className="text-right text-slate-800 font-bold">
                                    {tooltipInfo.data.cluster}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    ประเภทร่างกฏหมาย:
                                </span>
                                <span className="text-slate-800">
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
                            <div className="border-t border-slate-100 pt-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">ความสำเร็จ:</span>
                                    <span className="text-slate-800">{tooltipInfo.data.metrics.successRate}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">การเข้าประชุม:</span>
                                    <span className="text-slate-800">{tooltipInfo.data.metrics.attendanceRate}%</span>
                                </div>
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
