// @ts-ignore
//import {probabilityFromAverage, happenedToday} from './utils'

import {Simulation} from './simulation'
import {Covid19} from './virus'
import {InfectionStage} from '../types'
import {Person} from './person'



describe('Infected Population', () => {
    it('should converge to correct incubation average 90%', () => {
        const people = Array(100)
            .fill({ infected: true, infectionsStage: InfectionStage.incubation })
            .map(data => new Person(data))

        const virus = new Covid19()
        const simulation = new Simulation(people, virus)

        while (
            simulation.population.some(person => person.infectionsStage === InfectionStage.incubation)
            && simulation.day < virus.characteristics.averageIncubationDays * 3
        ) {
            simulation.nextDay()
        }

        const { population } = simulation

        expect(population.some(person => person.infectionsStage === InfectionStage.incubation)).toBe(false)

        const averageIncubation = simulation.population
            .map(person => person.history.get(InfectionStage.incubation) || 0)
            .reduce((acc, incubationDays) => acc + incubationDays/population.length, 0)

        expect(averageIncubation).toBeGreaterThan(virus.characteristics.averageIncubationDays * 0.9)
        expect(averageIncubation).toBeLessThan(virus.characteristics.averageIncubationDays * 1.1)
    });
});
