//todo use sigmoid or similar distribution.
export function probabilityFromAverage(average: number, value: number): number {
    const max = 1.05 * average
    return value < max ? Math.exp(value - max)  : 1;
}

export function happenedToday(probability: number): boolean {
    return Math.random() < probability
}

export function getRandomSubArray<T>(arr: T[], subLength: number): T[] {
    const set = new Set<number>()
    while (set.size < subLength) {
        set.add(Math.floor(Math.random() * arr.length))
    }

    return [...set].map(i => arr[i])
}
