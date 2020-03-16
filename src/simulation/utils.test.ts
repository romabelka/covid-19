// @ts-ignore
import {probabilityFromAverage, happenedToday} from './utils'

describe('utils', () => {
    it('happenedToday should converge to number of events with 90%', () => {
        const p = Math.random()
        const total = 10000
        let events = 0

        for (let i = 0; i < total; i++) {
            if (happenedToday(p)) events++
        }

        expect(events).toBeGreaterThan(total * (p * 0.90))
        expect(events).toBeLessThan(total * (p * 1.1))
    });

    it('should converge to correct average with probabilityFromAverage', () => {
        const average = Math.floor(Math.random() * 10) + 5
        const total = 10000
        let activeCases = total
        const eventDates = [0]
        let day = 0;

        while (activeCases && day < average * 10) {
            const pToday = probabilityFromAverage(average, day)
            eventDates[day] = 0

            for (let i= 0; i < activeCases; i++) {
                if (happenedToday(pToday)) {
                    activeCases--
                    eventDates[day]++
                }
            }

            day++
        }

        const averageResult = eventDates.reduce((acc, events, day) => acc + (day * events / total), 0)

        expect(activeCases).toBe(0)
        expect(averageResult).toBeGreaterThan(average * 0.95)
        expect(averageResult).toBeLessThan(average * 1.05)
    });

});
