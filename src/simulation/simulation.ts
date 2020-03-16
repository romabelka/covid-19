import {InfectionStage, IPerson, IVirus} from '../types'
import {Covid19} from './virus'
import {happenedToday} from './utils'
import {log} from 'util'

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
                        person.nextStage = this.virus.getNextStage(person)
                    }
                    break;
                }

                case InfectionStage.mild: {
                    const severeChance = this.virus.severeStateChance(person)
                    const recoverChance = this.virus.recoverChance(person)

                    if (happenedToday(severeChance)) {
                        person.setStage(InfectionStage.severe)
                    } else if (happenedToday(recoverChance)) {
                        person.heal()
                    }
                    break;
                }

                default: break;
            }
        })
    }
}
