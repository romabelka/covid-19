import {InfectionStage, Person, Virus, VirusCharacteristics} from '../types'
import {probabilityFromAverage} from './utils'

export class Covid19 implements Virus {
    private characteristics: VirusCharacteristics
    constructor(characteristics: VirusCharacteristics = virusCharacteristics) {
        this.characteristics = characteristics
    }
    transmissionChance = () => this.characteristics.transmissionChance

    severeStateChance = (person: Person) => {
        if (!person.infected || person.infectionsStage !== InfectionStage.mild) return 0

        const totalChance = this.characteristics.ageSevereChance[Math.floor(person.age / 10)]
        const averageDays = this.characteristics.averageMildToSevereDays

        return totalChance * probabilityFromAverage(averageDays, person.currentStageDay)
    }

    deathChance = (person: Person) => 0

    recoverChance = () => 0
}

const virusCharacteristics: VirusCharacteristics = {
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
