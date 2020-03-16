//todo use sigmoid or similar distribution.
export function probabilityFromAverage(average: number, value: number): number {
    const max = 1.05 * average
    return value < max ? Math.exp(value - max)  : 1;
}

export function happenedToday(probability: number): boolean {
    return Math.random() < probability
}
