import {InfectionStage, IPerson, ISimulation, IVirus} from '../types'
import {Covid19} from './virus'
import {getRandomSubArray, happenedToday} from './utils'

export class Simulation implements ISimulation{
    hospitalBeds = 0
    population: IPerson[]
    virus: IVirus
    day = 0
    averageSocialContacts = 1

    constructor(population: IPerson[] = [],
                virus = new Covid19(),
                hospitalBeds = 0,
                socialContacts = 1
    ) {
        this.population = population
        this.virus = virus
        this.hospitalBeds = hospitalBeds
        this.averageSocialContacts = socialContacts
    }

    nextDay = () => {
        this.day++

        this.progressInfection()
        this.progressSpread()
    }

    private progressInfection() {
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

    private progressSpread() {
        this.population
            .filter(p => p.infected)
            .forEach(() => {
                getRandomSubArray(this.population, this.averageSocialContacts)
                    .forEach(p => happenedToday(this.virus.transmissionChance()) && p.infect())
            })
    }
}

