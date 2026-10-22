/*
--NOTE: Geometry utilities for PCB traces:
    * Takes a route made of points,
    * Shifts that route sideways without breaking its corners,
    * and converts it into an SVG path.
*/

export type Point = [number, number];

export const round = (n: number) => Math.round(n * 100) / 100;

// Get the unit normal pointing to the right of a -> b
const normal = (a: Point, b: Point): Point => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    return [-dy / len, dx / len];
};

// Shift a polyline sideways
// Positive offsets go to the right of travel
export function offsetPolyline(points: Point[], offset: number): Point[] {
    return points.map((p, i): Point => {
        const prev = i > 0 ? normal(points[i - 1], p) : undefined;
        const next =
            i < points.length - 1 ? normal(p, points[i + 1]) : undefined;

        let mx: number;
        let my: number;

        if (prev && next) {
            // Find where the two shifted segments meet at the corner
            const k = 1 + prev[0] * next[0] + prev[1] * next[1];
            mx = (prev[0] + next[0]) / k;
            my = (prev[1] + next[1]) / k;
        } else {
            [mx, my] = (prev ?? next)!;
        }

        return [round(p[0] + offset * mx), round(p[1] + offset * my)];
    });
}

// Convert points into an SVG path string
// "M x y L x y L x y ..." for one polyline
export const toPath = (points: Point[]) =>
    points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join("");
