import {InfectionStage, IPerson, IVirus} from '../types'
import {Covid19} from './virus'
import {happenedToday} from './utils'

export class Simulation {
    population: IPerson[]
    virus: IVirus
    day = 0

    constructor(population: IPerson[] = [], virus = new Covid19()) {
        this.population = population
        this.virus = virus
    }

    nextDay = () => {
        this.day++

        this.population.forEach(person => {
            if (!person.infected) return;
            person.nextDay()

            switch (person.infectionsStage) {
                case InfectionStage.incubation: {
                    const symptomsChance = this.virus.symptomsStartChance(person)
                    if (happenedToday(symptomsChance)) {
                        person.setStage(InfectionStage.mild)
                    }
                    break;
                }

                default: break;
            }
        })
    }
}
