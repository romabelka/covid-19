// @ts-ignore
//import {probabilityFromAverage, happenedToday} from './utils'

import {Simulation} from './simulation'
import {Covid19} from './virus'
import {InfectionStage, IVirus, IVirusCharacteristics} from '../types'
import {Person} from './person'

const testVirusCharacteristics: IVirusCharacteristics = {
    transmissionChance: .01,

    averageIncubationDays: 10,
    averageMildToHealDays: 14,
    averageMildToSevereDays: 7,
    averageSevereToHealDays: 21,
    averageSevereToDeathDays: 5,

    ageSevereChance: [.01, .01, .01, 1, .03, .08, .15, .3, .4],


    ageDeathChance: {
        hospitalized: [.1, .1, .1, .2, .2, .3, .4, .5, .6],
        home: [.3, .3, .3, .6, .6, .8, .9, .95, .95]
    }
}


describe('Infected Population', () => {
    describe('Incubation Period', () => {
        it('should converge to correct incubation average 90%', () => {
            const people = Array(100)
                .fill({ infected: true, age: 30, infectionsStage: InfectionStage.incubation })
                .map(data => new Person(data))

            const virus = new Covid19(testVirusCharacteristics)
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

    describe('Mild period', () => {
        it('should converge to correct severe average timing 90%', () => {
            const total = 500

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageSevereChance: Array(10).fill(1),
            })
            const simulation = new Simulation(getPeople(total, virus, InfectionStage.mild), virus)
            const { characteristics } = virus

            while (
                simulation.population.some(person => person.infectionsStage === InfectionStage.mild)
                && simulation.day < Math.max( characteristics.averageMildToSevereDays, characteristics.averageMildToHealDays) * 5
                ) {
                simulation.nextDay()
            }

            const { population } = simulation

            expect(population.some(person => person.infectionsStage === InfectionStage.mild)).toBe(false)

            const severe = simulation.population
                .filter(person => person.infectionsStage === InfectionStage.severe || person.history.get(InfectionStage.severe))
                .filter(person => !person.history.get(InfectionStage.healed))

            const averageMildToSevere = severe
                .map(person => person.history.get(InfectionStage.mild) || 0)
                .reduce((acc, mildDays) => acc + mildDays/severe.length, 0)

            expect(averageMildToSevere).toBeGreaterThan(virus.characteristics.averageMildToSevereDays * 0.9)
            expect(averageMildToSevere).toBeLessThan(virus.characteristics.averageMildToSevereDays * 1.1)
        });

        it('should converge to correct severe rate 90%', () => {
            const rate = 0.3
            const total = 500

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageSevereChance: Array(10).fill(rate),
            })


            const simulation = new Simulation(getPeople(total, virus, InfectionStage.mild), virus)
            const { characteristics } = virus

            while (
                simulation.population.some(person => person.infectionsStage === InfectionStage.mild)
                && simulation.day < Math.max( characteristics.averageMildToSevereDays, characteristics.averageMildToHealDays) * 5
                ) {
                simulation.nextDay()
            }

            const { population } = simulation

            expect(population.some(person => person.infectionsStage === InfectionStage.mild)).toBe(false)

            const severeCases = simulation.population
                .filter(person =>
                    person.infectionsStage === InfectionStage.severe
                    || person.history.get(InfectionStage.severe)
                )

            expect(severeCases.length).toBeGreaterThan(total * rate * 0.9)
            expect(severeCases.length).toBeLessThan(total * rate * 1.1)
        });

        it('should converge to correct heal from mild average timing 90%', () => {
            const total = 500

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageSevereChance: Array(10).fill(0),
            })
            const simulation = new Simulation(getPeople(total, virus, InfectionStage.mild), virus)
            const { characteristics } = virus

            while (
                simulation.population.some(person => person.infectionsStage === InfectionStage.mild)
                && simulation.day < Math.max( characteristics.averageMildToSevereDays, characteristics.averageMildToHealDays) * 5
                ) {
                simulation.nextDay()
            }

            const { population } = simulation

            expect(population.some(person => person.infectionsStage === InfectionStage.mild)).toBe(false)

            const healed = simulation.population
                .filter(person => !person.history.get(InfectionStage.severe))
                .map(person => person.history.get(InfectionStage.mild) || 0)

            const averageMildToHeal = healed
                .reduce((acc, mildDays) => acc + mildDays/healed.length, 0)

            expect(averageMildToHeal).toBeGreaterThan(virus.characteristics.averageMildToHealDays * 0.9)
            expect(averageMildToHeal).toBeLessThan(virus.characteristics.averageMildToHealDays * 1.1)
        });

        it('should converge to correct heal from mild rate 90%', () => {
            const healRate = 0.25
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageSevereChance: Array(10).fill(1 - healRate),
            })

            const simulation = new Simulation(getPeople(total, virus, InfectionStage.mild), virus)
            const { characteristics } = virus


            while (
                simulation.population.some(person => person.infectionsStage === InfectionStage.mild)
                && simulation.day < Math.max( characteristics.averageMildToSevereDays, characteristics.averageMildToHealDays) * 5
                ) {
                simulation.nextDay()
            }

            const { population } = simulation

            expect(population.some(person => person.infectionsStage === InfectionStage.mild)).toBe(false)

            const healedCases = simulation.population
                .filter(person =>
                    person.infectionsStage === InfectionStage.healed
                    && !person.history.get(InfectionStage.severe)
                )

            expect(healedCases.length).toBeGreaterThan(total * healRate * 0.9)
            expect(healedCases.length).toBeLessThan(total * healRate * 1.1)
        });
    });

    describe('Severe Period Hospitalized', () => {
        it('should converge to correct severe to death average timing 90%', () => {
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(0.3),
                    home: Array(10).fill(0)
                },
            })
            const simulation = new Simulation(getPeople(total, virus, InfectionStage.severe), virus)
            const { characteristics } = virus

            while (
                simulation.population.some(person => person.infectionsStage === InfectionStage.severe)
                && simulation.day < Math.max( characteristics.averageSevereToDeathDays, characteristics.averageSevereToHealDays) * 5
                ) {
                simulation.nextDay()
            }

            const { population } = simulation

            expect(population.some(person => person.infectionsStage === InfectionStage.severe)).toBe(false)

            const deathCases = simulation.population
                .filter(person => person.infectionsStage === InfectionStage.death)

            const averageSevereToDeath = deathCases
                .map(person => person.history.get(InfectionStage.severe) || 0)
                .reduce((acc, severeDays) => acc + severeDays/deathCases.length, 0)

            expect(averageSevereToDeath).toBeGreaterThan(virus.characteristics.averageSevereToDeathDays * 0.9)
            expect(averageSevereToDeath).toBeLessThan(virus.characteristics.averageSevereToDeathDays * 1.1)
        });

        it('should converge to correct severe to death rate 90%', () => {
            const rate = 0.3
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(rate),
                    home: Array(10).fill(0)
                },
            })


            const simulation = new Simulation(getPeople(total, virus, InfectionStage.severe), virus)
            const { characteristics } = virus

            while (
                simulation.population.some(person => person.infectionsStage === InfectionStage.severe)
                && simulation.day < Math.max( characteristics.averageSevereToDeathDays, characteristics.averageSevereToHealDays) * 5
                ) {
                simulation.nextDay()
            }

            const { population } = simulation

            expect(population.some(person => person.infectionsStage === InfectionStage.severe)).toBe(false)

            const deathCases = simulation.population
                .filter(person =>
                    person.infectionsStage === InfectionStage.death
                )

            expect(deathCases.length).toBeGreaterThan(total * rate * 0.9)
            expect(deathCases.length).toBeLessThan(total * rate * 1.1)
        });

        it('should converge to correct severe to heal average timing 90%', () => {
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(0.3),
                    home: Array(10).fill(0)
                },
            })
            const simulation = new Simulation(getPeople(total, virus, InfectionStage.severe), virus)
            const { characteristics } = virus

            while (
                simulation.population.some(person => person.infectionsStage === InfectionStage.severe)
                && simulation.day < Math.max( characteristics.averageSevereToDeathDays, characteristics.averageSevereToHealDays) * 5
                ) {
                simulation.nextDay()
            }

            const { population } = simulation

            expect(population.some(person => person.infectionsStage === InfectionStage.severe)).toBe(false)

            const healedCases = simulation.population
                .filter(person => person.infectionsStage === InfectionStage.healed)

            const averageSevereToHealed = healedCases
                .map(person => person.history.get(InfectionStage.severe) || 0)
                .reduce((acc, severeDays) => acc + severeDays/healedCases.length, 0)

            expect(averageSevereToHealed).toBeGreaterThan(virus.characteristics.averageSevereToHealDays * 0.9)
            expect(averageSevereToHealed).toBeLessThan(virus.characteristics.averageSevereToHealDays * 1.1)
        });

        it('should converge to correct severe to heal rate 90%', () => {
            const healedRate = 0.3
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(1 - healedRate),
                    home: Array(10).fill(0)
                },
            })

            const simulation = new Simulation(getPeople(total, virus, InfectionStage.severe), virus)
            const { characteristics } = virus

            while (
                simulation.population.some(person => person.infectionsStage === InfectionStage.severe)
                && simulation.day < Math.max( characteristics.averageSevereToDeathDays, characteristics.averageSevereToHealDays) * 5
                ) {
                simulation.nextDay()
            }

            const { population } = simulation

            expect(population.some(person => person.infectionsStage === InfectionStage.severe)).toBe(false)

            const healedCases = simulation.population
                .filter(person =>
                    person.infectionsStage === InfectionStage.healed
                )

            expect(healedCases.length).toBeGreaterThan(total * healedRate * 0.9)
            expect(healedCases.length).toBeLessThan(total * healedRate * 1.1)
        });

    });


    function getPeople(total: number, virus: IVirus, infectionsStage: InfectionStage) {
        return Array(total)
            .fill({
                infected: true, age: 30,
                infectionsStage
            })
            .map(data => new Person(data))
            .map(person => {
                person.nextStage = virus.getNextStage(person)
                return person
            })

    }
});

