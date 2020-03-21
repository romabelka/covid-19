import {InfectionStage, IPerson, ISimulation, ISimulationHistory, ISocialContacts, IVirus} from '../types'
import {Covid19} from './virus'
import {getRandomSubArray, happenedToday} from './utils'

const defaultQuarantine: ISocialContacts = {
    avContactsGeneral: 10,
    avContactsQuarantine: 1,
    quarantineTime: 60,
    quarantineAge: 0
}

export class Simulation implements ISimulation{
    hospitalBeds = 0
    population: IPerson[]
    virus: IVirus
    day = 0
    socialContacts: ISocialContacts = defaultQuarantine

    constructor(population: IPerson[] = [],
                virus = new Covid19(),
                hospitalBeds = 0,
                socialContacts: ISocialContacts = defaultQuarantine
    ) {
        this.population = population
        this.virus = virus
        this.hospitalBeds = hospitalBeds
        this.socialContacts = socialContacts
    }

    nextDay = () => {
        this.day++

        this.progressInfection()
        this.progressSpread()
    }

    run = (days: number): ISimulationHistory[] => {
        const history = []
        for (let day = 0; day < days; day++) {
            this.nextDay();

            let incubation  = 0;
            let mild        = 0;
            let severe      = 0;
            let death       = 0;
            let healed      = 0;

            let FAincubation = InfectionStage.incubation;
            let FAmild       = InfectionStage.mild;
            let FAsevere     = InfectionStage.severe;
            let FAdeath      = InfectionStage.death;
            let FAhealed     = InfectionStage.healed;

            for (let i = 0, list = this.population, len = list.length; i < len; i++) {
                switch (list[i].infectionsStage) {
                    case FAincubation:
                        incubation++;
                        break;
                    case FAmild:
                        mild++;
                        break;
                    case FAsevere:
                        severe++;
                        break;
                    case FAdeath:
                        death++;
                        break;
                    case FAhealed:
                        healed++;
                        break;
                }
            }
            history.push({
                total: this.population.length,
                incubation,
                mild,
                severe,
                death,
                healed,
                hospitalBeds: this.hospitalBeds
            })
        }

        return history
    }

    private progressInfection() {

        let occupiedBeds = this.population.filter(p => p.hospitalized).length;

        for (let i = 0; i < this.population.length; i++) {
            let person = this.population[i];
            if (!person.infected) continue;
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
                        if (occupiedBeds <= this.hospitalBeds) {
                          person.hospitalized = true
                          occupiedBeds++;
                        } else {
                            person.severeNotHospitalized = true
                        }
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
                        person.hospitalized = false
                    } else if (happenedToday(recoverChance)) {
                        person.heal()
                    }

                    break;
                }

                default: break;
            }
        }
    }

    private progressSpread() {
        const {quarantineAge, avContactsGeneral, avContactsQuarantine, quarantineTime} = this.socialContacts
        const live = this.population.filter(p => p.infectionsStage !== InfectionStage.death)

        for (let i = 0; i < this.population.length; i++) {
            let person = this.population[i];
            const contacts = this.day < quarantineTime && person.age >= quarantineAge
                ? avContactsQuarantine
                : avContactsGeneral

            getRandomSubArray(live, contacts)
                .forEach(p =>
                    p.infected
                    && happenedToday(this.virus.transmissionChance())
                    && person.infect()
                )
        }
    }
}

