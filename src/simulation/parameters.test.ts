// @ts-ignore

import {Simulation} from './simulation'
import {Covid19} from './virus'
import {InfectionStage, IPerson, ISocialContacts, IVirus} from '../types'
import {IPersonData, Person} from './person'


const quarantine: ISocialContacts = {
    avContactsQuarantine: 10,
    avContactsGeneral: 20,
    quarantineAge: 0,
    quarantineTime: 0
};


//in percents
const statistics = {
    mortality: [0, 0.2, 0.2, 0.2, 0.4, 1.3, 3.6, 8.0, 14.8],
    R0: 2.5
}

const simulationDays = 150

describe('Covid Virus Parameters', () => {
    describe('Totals', () => {
        const getAgeGroupTest = (group: number) =>
            it(`Should converge to ${statistics.mortality[group]}% mortality for closed cases after ${simulationDays} days`, () => {
                const total = 2000
                const beds = 2000
                const times = 8

                const averageMortality = Array(times).fill(0)
                    .map(() => {
                        const virus = new Covid19()
                        const people = getPeople(total, virus, {age: group * 10 + 5})

                        const simulation = new Simulation(people, virus, beds, { ...quarantine, avContactsGeneral: 0}, 0)

                        while (getClosedCases(simulation.population).length < total && simulation.day <= simulationDays) {
                            simulation.nextDay()
                        }

                        const { population } = simulation
                        const closed = getClosedCases(population)
                        const dead = closed.filter(p => p.infectionsStage === InfectionStage.death)

                        return dead.length / closed.length
                    })
                    .reduce((acc, rate) => acc + rate/times, 0)

                expect(100 * averageMortality).toBeCloseTo(statistics.mortality[group], 0.4)

            });

        Array(statistics.mortality.length).fill(0)
            .map((_, group) => getAgeGroupTest(group))

        it(`should converge to R0 = ${statistics.R0}`, () => {
            const total = 1000
            const beds = 1000
            const virus = new Covid19()
            const people = [
                ...getPeople(5  * total/100, virus, {}),
                ...getPeople(95 * total/100, virus, { infected: false } )
            ]

            const simulation = new Simulation(people, virus, beds, quarantine, 0)

            while (simulation.day < simulationDays) {
                simulation.nextDay()
            }

            const { population } = simulation

            const R0 = population.reduce((acc, p) => acc + p.infectionSpread, 0) / population.length


            expect(R0).toBeCloseTo(statistics.R0, 0.2)

        });
    });

    function getClosedCases(population: IPerson[]) {
        return population
            .filter(p => p.infectionsStage === InfectionStage.death || p.infectionsStage === InfectionStage.healed)
    }

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

