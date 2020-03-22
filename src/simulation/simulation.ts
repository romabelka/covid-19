import {InfectionStage, IPerson, ISimulation, ISimulationHistory, ISocialContacts, IVirus} from '../types'
import {Covid19} from './virus'
import {getRandomSubArray, happenedToday} from './utils'
import {Person} from './person'

const defaultQuarantine: ISocialContacts = {
    avContactsGeneral: 20,
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
    private travellersPerDay: number

    constructor(population: IPerson[] = [],
                virus = new Covid19(),
                hospitalBeds = 0,
                socialContacts: ISocialContacts = defaultQuarantine,
                travellers = 0,
    ) {
        this.population = population
        this.virus = virus
        this.hospitalBeds = hospitalBeds
        this.socialContacts = socialContacts
        this.travellersPerDay = travellers
    }

    nextDay = () => {
        this.day++

        this.incomingTravellers()
        this.progressInfection()
        this.progressSpread()
    }

    incomingTravellers = () => {
        if (this.day <= this.socialContacts.quarantineTime) return;

        const travellers = Array(this.travellersPerDay)
            .fill(35)
            .map(age => new Person({ age, infected: true }))
        this.population.push(...travellers)
    }


    run = (days: number): ISimulationHistory[] => {
        const history = []
        for (let day = 0; day < days; day++) {
            this.nextDay();

            let incubation = 0;
            let mild = 0;
            let severe = 0;
            let death = 0;
            let healed = 0;

            for (let i = 0; i < this.population.length; i++) {
                switch (this.population[i].infectionsStage) {
                    case InfectionStage.incubation:
                        incubation++;
                        break;
                    case InfectionStage.mild:
                        mild++;
                        break;
                    case InfectionStage.severe:
                        severe++;
                        break;
                    case InfectionStage.death:
                        death++;
                        break;
                    case InfectionStage.healed:
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
                        if (occupiedBeds < this.hospitalBeds) {
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
                .forEach(p => {
                    if (!p.infected || !happenedToday(this.virus.transmissionChance())) return;

                    p.infectionSpread++
                    person.infect()
                })
        }
    }
}

