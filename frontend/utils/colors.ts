export const extractPartyColors = async <
    T extends { color: string; logoUrl: string },
>(
    parties: T[],
): Promise<T[]> => {
    return Promise.all(
        parties.map((party) => {
            return new Promise<T>((resolve) => {
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

                            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                            if (luminance > 220) continue;

                            const darken = luminance > 150 ? 0.75 : 1;
                            const dR = Math.floor(r * darken);
                            const dG = Math.floor(g * darken);
                            const dB = Math.floor(b * darken);

                            const qR = Math.round(dR / 20) * 20;
                            const qG = Math.round(dG / 20) * 20;
                            const qB = Math.round(dB / 20) * 20;
                            const key = `${qR},${qG},${qB}`;

                            colorCounts[key] = (colorCounts[key] || 0) + 1;
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
};
