// @ts-ignore

import {Simulation} from './simulation'
import {Covid19} from './virus'
import {InfectionStage, ISocialContacts, IVirus, IVirusCharacteristics} from '../types'
import {IPersonData, Person} from './person'

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

const quarantine: ISocialContacts = {
    avContactsQuarantine: 0,
    avContactsGeneral: 1,
    quarantineAge: 0,
    quarantineTime: 0
};


const testD = 0.15


describe('Infected Population', () => {
    describe('Incubation Period', () => {
        it(`should converge to correct incubation average ${testD}`, () => {
            const total = 1000
            const virus = new Covid19(testVirusCharacteristics)
            const people = getPeople(total, virus, { infectionsStage: InfectionStage.incubation })
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

            expect(averageIncubation).toBeGreaterThan(virus.characteristics.averageIncubationDays * (1-testD))
            expect(averageIncubation).toBeLessThan(virus.characteristics.averageIncubationDays * (1+testD))
        });
    });

    describe('Mild period', () => {
        it(`should converge to correct severe average timing ${testD}`, () => {
            const total = 500

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageSevereChance: Array(10).fill(1),
            })
            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.mild }), virus)
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

            expect(averageMildToSevere).toBeGreaterThan(virus.characteristics.averageMildToSevereDays * (1-testD))
            expect(averageMildToSevere).toBeLessThan(virus.characteristics.averageMildToSevereDays * (1+testD))
        });

        it(`should converge to correct severe rate ${testD}`, () => {
            const rate = 0.3
            const total = 500

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageSevereChance: Array(10).fill(rate),
            })


            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.mild }), virus)
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

            expect(severeCases.length).toBeGreaterThan(total * rate * (1 - testD))
            expect(severeCases.length).toBeLessThan(total * rate * (1 + testD))
        });

        it(`should converge to correct heal from mild average timing ${testD}`, () => {
            const total = 500

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageSevereChance: Array(10).fill(0),
            })
            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.mild }), virus)
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

            expect(averageMildToHeal).toBeGreaterThan(virus.characteristics.averageMildToHealDays * (1 - testD))
            expect(averageMildToHeal).toBeLessThan(virus.characteristics.averageMildToHealDays * (1 + testD))
        });

        it(`should converge to correct heal from mild rate ${testD}`, () => {
            const healRate = 0.25
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageSevereChance: Array(10).fill(1 - healRate),
            })

            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.mild }), virus)
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

            expect(healedCases.length).toBeGreaterThan(total * healRate * (1 - testD))
            expect(healedCases.length).toBeLessThan(total * healRate * (1 + testD))
        });
    });

    describe('Severe Period Hospitalized', () => {
        it(`should converge to correct severe to death average timing ${testD}`, () => {
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(0.3),
                    home: Array(10).fill(0)
                },
            })
            const simulation = new Simulation(getPeople(total, virus, {
                infectionsStage: InfectionStage.severe,
                hospitalized: true
            }), virus)
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

            expect(averageSevereToDeath).toBeGreaterThan(virus.characteristics.averageSevereToDeathDays * (1 - testD))
            expect(averageSevereToDeath).toBeLessThan(virus.characteristics.averageSevereToDeathDays * (1 + testD))
        });

        it(`should converge to correct severe to death rate ${testD}`, () => {
            const rate = 0.3
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(rate),
                    home: Array(10).fill(0)
                },
            })


            const simulation = new Simulation(getPeople(total, virus, {
                infectionsStage: InfectionStage.severe,
                hospitalized: true
            }), virus)
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

            expect(deathCases.length).toBeGreaterThan(total * rate * (1 - testD))
            expect(deathCases.length).toBeLessThan(total * rate * (1 + testD))
        });

        it(`should converge to correct severe to heal average timing ${testD}`, () => {
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(0.3),
                    home: Array(10).fill(0)
                },
            })
            const simulation = new Simulation(getPeople(total, virus, {
                infectionsStage: InfectionStage.severe,
                hospitalized: true
            }), virus)
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

            expect(averageSevereToHealed).toBeGreaterThan(virus.characteristics.averageSevereToHealDays * (1 - testD))
            expect(averageSevereToHealed).toBeLessThan(virus.characteristics.averageSevereToHealDays * (1 + testD))
        });

        it(`should converge to correct severe to heal rate ${testD}`, () => {
            const healedRate = 0.3
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(1 - healedRate),
                    home: Array(10).fill(0)
                },
            })

            const simulation = new Simulation(getPeople(total, virus, {
                infectionsStage: InfectionStage.severe,
                hospitalized: true
            }), virus)
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

            expect(healedCases.length).toBeGreaterThan(total * healedRate * (1 - testD))
            expect(healedCases.length).toBeLessThan(total * healedRate * (1 + testD))
        });

    });

    describe('Severe Period Not Hospitalized', () => {
        it(`should converge to correct severe to death average timing ${testD}`, () => {
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(0),
                    home: Array(10).fill(.3)
                },
            })
            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.severe }), virus)
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

            expect(averageSevereToDeath).toBeGreaterThan(virus.characteristics.averageSevereToDeathDays * (1 - testD))
            expect(averageSevereToDeath).toBeLessThan(virus.characteristics.averageSevereToDeathDays * (1 + testD))
        });

        it(`should converge to correct severe to death rate ${testD}`, () => {
            const rate = 0.3
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(0),
                    home: Array(10).fill(rate)
                },
            })


            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.severe }), virus)
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

            expect(deathCases.length).toBeGreaterThan(total * rate * (1 - testD))
            expect(deathCases.length).toBeLessThan(total * rate * (1 + testD))
        });

        it(`should converge to correct severe to heal average timing ${testD}`, () => {
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(1),
                    home: Array(10).fill(0.3)
                },
            })
            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.severe }), virus)
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

            expect(averageSevereToHealed).toBeGreaterThan(virus.characteristics.averageSevereToHealDays * (1 - testD))
            expect(averageSevereToHealed).toBeLessThan(virus.characteristics.averageSevereToHealDays * (1 + testD))
        });

        it(`should converge to correct severe to heal rate ${testD}`, () => {
            const healedRate = 0.3
            const total = 1000

            const virus = new Covid19({
                ...testVirusCharacteristics,
                ageDeathChance: {
                    hospitalized: Array(10).fill(1),
                    home: Array(10).fill(1 - healedRate)
                },
            })

            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.severe }), virus)
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

            expect(healedCases.length).toBeGreaterThan(total * healedRate * (1 - testD))
            expect(healedCases.length).toBeLessThan(total * healedRate * (1 + testD))
        });
    });

    describe('Hospitalization', () => {
        it('should hospitalize everyone if enough beds', () => {
            const total = 100

            const virus = new Covid19({
                ...testVirusCharacteristics,
                averageMildToSevereDays: 0,
                ageSevereChance: Array(10).fill(1)
            })

            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.mild }), virus, total + 1)

            simulation.nextDay()

            const { population } = simulation

            expect(population.every(person => person.infectionsStage === InfectionStage.severe)).toBe(true)

            const hospitalized = population.filter(person => person.hospitalized).length

            expect(hospitalized).toBe(total)

        });

        it('should hospitalize people for amount of beds', () => {
            const total = 1000
            const beds = 100

            const virus = new Covid19({
                ...testVirusCharacteristics,
                averageMildToSevereDays: 0,
                ageSevereChance: Array(10).fill(1)
            })

            const simulation = new Simulation(getPeople(total, virus, { infectionsStage: InfectionStage.mild }), virus, beds)

            simulation.nextDay()

            const { population } = simulation

            expect(population.every(person => person.infectionsStage === InfectionStage.severe)).toBe(true)

            const hospitalized = population.filter(person => person.hospitalized).length

            expect(hospitalized).toBe(beds)

        });
    });

    describe('Spread', () => {
/*
        it('should spread exponentially in the beginning', () => {
            const infectedStart = 2
            const total = 10000
            const days = 8

            const virus = new Covid19({
                ...testVirusCharacteristics,
                averageIncubationDays: 10000,
                transmissionChance: 1
            })

            const population = [
                ...getPeople(infectedStart, virus, { infectionsStage: InfectionStage.incubation }),
                ...getPeople(total - infectedStart, virus, { infected: false })
            ]

            const simulation = new Simulation(population, virus, 0, {...quarantine})
            const cases = []

            for (let i =0; i < days; i++) {
                cases[i] = simulation.population.filter(p => p.infected).length
                simulation.nextDay()
            }

            expect(cases[days - 1]).toBeGreaterThan(cases[0])

            const increase = cases.map(casesToday => casesToday / infectedStart)
            const midDay = Math.floor(days / 2) - 1

            expect(increase[midDay]).toBeCloseTo(increase[2 * midDay] / increase[midDay], 0)
        });
*/

/*
        it('should exponentially reflect social contacts', () => {
            const infectedStart = 1
            const total = 100000
            const days = 8

            const quarantine = { avContactsQuarantine: 0, avContactsGeneral: 1, quarantineAge: 0, quarantineTime: 0};

            const virus = new Covid19({
                ...testVirusCharacteristics,
                averageIncubationDays: 5000,
                transmissionChance: 1
            })

            const population1 = [
                ...getPeople(infectedStart, virus, { infectionsStage: InfectionStage.incubation }),
                ...getPeople(total - infectedStart, virus, { infected: false })
            ]

            const population2 = [
                ...getPeople(infectedStart, virus, { infectionsStage: InfectionStage.incubation }),
                ...getPeople(total - infectedStart, virus, { infected: false })
            ]

            const simulation1 = new Simulation(population1, virus, 0, {...quarantine, avContactsGeneral: 1})
            const simulation2 = new Simulation(population2, virus, 0, {...quarantine, avContactsGeneral: 2})

            const cases1 = []
            const cases2 = []

            for (let i = 0; i < days; i++) {
                cases1[i] = simulation1.population.filter(p => p.infected).length
                cases2[i] = simulation2.population.filter(p => p.infected).length
                simulation1.nextDay()
                simulation2.nextDay()
            }

            expect(cases2[0]).toEqual(cases1[0])
            expect(cases2[days - 1]).toBeGreaterThan(cases1[days - 1])

            const midDay = Math.floor(days / 2) - 1

            expect(Math.pow(cases2[midDay]/cases1[midDay], 2)).toBeCloseTo( cases2[2 * midDay] / cases1[2 * midDay], 0)
        });
*/

        it('should exponentially reflect transmission rate', () => {
            const infectedStart = 1
            const total = 100000
            const days = 12

            const virus1 = new Covid19({
                ...testVirusCharacteristics,
                averageIncubationDays: 5000,
                transmissionChance: 0.1
            })

            const virus2 = new Covid19({
                ...testVirusCharacteristics,
                averageIncubationDays: 5000,
                transmissionChance: 0.2
            })

            const population1 = [
                ...getPeople(infectedStart, virus1, { infectionsStage: InfectionStage.incubation }),
                ...getPeople(total - infectedStart, virus1, { infected: false })
            ]

            const population2 = [
                ...getPeople(infectedStart, virus2, { infectionsStage: InfectionStage.incubation }),
                ...getPeople(total - infectedStart, virus2, { infected: false })
            ]

            const simulation1 = new Simulation(population1, virus1, 0, {...quarantine, avContactsGeneral: 5})
            const simulation2 = new Simulation(population2, virus2, 0, {...quarantine, avContactsGeneral: 5})

            const cases1 = []
            const cases2 = []

            for (let i = 0; i < days; i++) {
                cases1[i] = simulation1.population.filter(p => p.infected).length
                cases2[i] = simulation2.population.filter(p => p.infected).length
                simulation1.nextDay()
                simulation2.nextDay()
            }

            expect(cases2[0]).toEqual(cases1[0])
            expect(cases2[days - 1]).toBeGreaterThan(cases1[days - 1])

            const midDay = Math.floor(days / 2) - 1


            expect(Math.pow(cases2[2 * midDay] / cases1[2 * midDay], 2)).toBeGreaterThan( 2 * cases2[midDay] / cases1[midDay])
        });
    })

    function getPeople(total: number, virus: IVirus, data: Partial<IPersonData>) {
        return Array(total)
            .fill({
                infected: true, age: 35,
                ...data
            })
            .map(data => new Person(data))
            .map(person => {
                person.nextStage = virus.getNextStage(person)
                return person
            })
    }
});

