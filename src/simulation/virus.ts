import {InfectionStage, IPerson, IVirus, IVirusCharacteristics} from '../types'
import {happenedToday, probabilityFromAverage} from './utils'

export class Covid19 implements IVirus {
    characteristics: IVirusCharacteristics

    constructor(characteristics: IVirusCharacteristics = virusCharacteristics) {
        this.characteristics = characteristics
    }
    transmissionChance = () => this.characteristics.transmissionChance

    severeStateChance = (person: IPerson) => {
        if (!person.infected || person.infectionsStage !== InfectionStage.mild) return 0

        return person.nextStage === InfectionStage.severe
            ? probabilityFromAverage(this.characteristics.averageMildToSevereDays, person.currentStageDay)
            : 0
    }

    deathChance = (person: IPerson) => {
        if (!person.infected || person.infectionsStage !== InfectionStage.severe) return 0

        return person.nextStage === InfectionStage.death
            ? probabilityFromAverage(this.characteristics.averageSevereToDeathDays, person.currentStageDay)
            : 0
    }

    recoverChance = (person: IPerson) => {
        if (!person.infected) return 1
        if (person.infectionsStage === InfectionStage.incubation) return 0

        if (person.infectionsStage === InfectionStage.mild) {
            return person.nextStage === InfectionStage.healed
                ? probabilityFromAverage(this.characteristics.averageMildToHealDays, person.currentStageDay)
                : 0
        }

        if (person.infectionsStage === InfectionStage.severe) {
            return person.nextStage === InfectionStage.healed
                ? probabilityFromAverage(this.characteristics.averageSevereToHealDays, person.currentStageDay)
                : 0
        }

        return 1
    }

    symptomsStartChance = (person: IPerson) => {
        if (!person.infected || person.infectionsStage !== InfectionStage.incubation) return 0

        return probabilityFromAverage(this.characteristics.averageIncubationDays, person.infectionDay)
    }

    getNextStage = (person: IPerson) => {
        if (person.infectionsStage === InfectionStage.incubation) return InfectionStage.mild
        if (person.infectionsStage === InfectionStage.mild) {
            return happenedToday(this.characteristics.ageSevereChance[Math.floor(person.age / 10)])
                ? InfectionStage.severe
                : InfectionStage.healed
        }
        if (person.infectionsStage === InfectionStage.severe) {
            const deathRates = person.hospitalized
                ? this.characteristics.ageDeathChance.hospitalized
                : this.characteristics.ageDeathChance.home

            return happenedToday(deathRates[Math.floor(person.age / 10)])
                ? InfectionStage.death
                : InfectionStage.healed

        }

        //todo: Really? Maybe fix me
        return InfectionStage.death
    }
}

const virusCharacteristics: IVirusCharacteristics = {
    transmissionChance: .01,

    averageIncubationDays: 10,
    averageMildToHealDays: 14,
    averageMildToSevereDays: 7,
    averageSevereToHealDays: 21,
    averageSevereToDeathDays: 5,

    ageSevereChance: [.01, .04, .04, .04, .08, .18, .4, .6, .72, .8],

    ageDeathChance: {
        hospitalized: [.1, .2, .2, .2, .25, .3, .38, .53, .75, .8],
        home: [.1, .25, .25, .25, .35, .4, .5, .65, .9, .95],
//        home: [.3, .3, .3, .6, .6, .8, .9, .95, .95, 1]
    }
}
