import {InfectionStage, IPerson, IVirus, IVirusCharacteristics} from '../types'
import {probabilityFromAverage} from './utils'

export class Covid19 implements IVirus {
    characteristics: IVirusCharacteristics

    constructor(characteristics: IVirusCharacteristics = virusCharacteristics) {
        this.characteristics = characteristics
    }
    transmissionChance = () => this.characteristics.transmissionChance

    severeStateChance = (person: IPerson) => {
        if (!person.infected || person.infectionsStage !== InfectionStage.mild) return 0

        const totalChance = this.characteristics.ageSevereChance[Math.floor(person.age / 10)]
        const averageDays = this.characteristics.averageMildToSevereDays

        return totalChance * probabilityFromAverage(averageDays, person.currentStageDay)
    }

    deathChance = (person: IPerson) => 0

    recoverChance = () => 0

    symptomsStartChance = (person: IPerson) => {
        if (!person.infected || person.infectionsStage !== InfectionStage.incubation) return 0

        return probabilityFromAverage(this.characteristics.averageIncubationDays, person.infectionDay)
    }
}

const virusCharacteristics: IVirusCharacteristics = {
    transmissionChance: .01,

    averageIncubationDays: 10,
    averageMildToHealDays: 7,
    averageMildToSevereDays: 7,
    averageSevereToHealDays: 21,
    averageSevereToDeathDays: 5,

    ageSevereChance: [.01, .01, .01, .02, .03, .08, .15, .3, .4],


    ageDeathChance: {
        hospitalized: [.1, .1, .1, .2, .2, .3, .4, .5, .6],
        home: [.3, .3, .3, .6, .6, .8, .9, .95, .95]
    }
}
