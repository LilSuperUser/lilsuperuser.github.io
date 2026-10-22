/*
--NOTE: Geometry utility for SMD passives:
    * Defines the geometry for two-terminal components,
    * Builds their bodies, metal termination and copper pads,
    * and combines them into SVG path strings.
*/

import { round } from "./router";

export type Passive = { x: number; y: number; vertical: boolean };

// Build an SVG path for a rectangle using its top-left corner, width and height
const rectPath = (x: number, y: number, w: number, h: number) =>
    `M${round(x)} ${round(y)}h${round(w)}v${round(h)}h${round(-w)}z`;

// Combine any number of two-terminal SMD parts into three path strings:
// copper pads, component bodies and metal terminations
// x, y is the centre of each part; (length and width in mm)
export function buildPassives(parts: Passive[], length: number, width: number) {
    let pads = "";
    let bodies = "";
    let ends = "";

    // Each metal termination takes 1/4 of the component's length
    const term = length / 4;

    for (const { x, y, vertical } of parts) {
        // Swap the dimensions when the component is rotated vertically
        const w = vertical ? width : length;
        const h = vertical ? length : width;
        const x0 = x - w / 2;
        const y0 = y - h / 2;

        // Draw the component body around its centre point
        bodies += rectPath(x0, y0, w, h);

        // Place one metal termination at each end of the component
        const terminations = vertical
            ? [
                  [x0, y0, w, term],
                  [x0, y0 + h - term, w, term],
              ]
            : [
                  [x0, y0, term, h],
                  [x0 + w - term, y0, term, h],
              ];

        for (const [ex, ey, ew, eh] of terminations) {
            ends += rectPath(ex, ey, ew, eh);
            // Draw the metal termination and extend it slightly to form the copper pad
            pads += rectPath(ex - 0.15, ey - 0.15, ew + 0.3, eh + 0.3);
        }
    }

    // One combined path string for each layer
    return { pads, bodies, ends };
}
