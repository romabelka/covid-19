import {InfectionStage, IPerson, ISimulation, IVirus} from '../types'
import {Covid19} from './virus'
import {happenedToday} from './utils'

export class Simulation implements ISimulation{
    private hospitalBeds = 0

    population: IPerson[]
    virus: IVirus
    day = 0

    constructor(population: IPerson[] = [], virus = new Covid19(), hospitalBeds = 0) {
        this.population = population
        this.virus = virus
        this.hospitalBeds = hospitalBeds
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
                        const occupiedBeds = this.population.filter(person => person.hospitalized).length
                        person.hospitalized = occupiedBeds < this.hospitalBeds
                        person.nextStage = this.virus.getNextStage(person)
                    } else if (happenedToday(recoverChance)) {
                        person.heal()
                    }
                    break;
                }

                case InfectionStage.severe: {
                    const deathChance = this.virus.deathChance(person)
                    const recoverChance = this.virus.recoverChance(person)

                    if (happenedToday(deathChance)) {
                        person.setStage(InfectionStage.death)
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
