import * as uuid from 'uuid'
import {InfectionStage, IPerson} from '../types'

export interface IPersonData {
    age: number
    immune?: boolean
    infected?: boolean
    hospitalized?: boolean
    infectionDay?: number
    currentStageDay?: number
    infectionsStage?: InfectionStage
    nextStage?: InfectionStage
}

export class Person implements IPerson {
    id: string
    age: number
    immune: boolean = false
    infected: boolean = false
    hospitalized: boolean = false
    severeNotHospitalized: boolean = false
    infectionDay: number = 0
    infectionSpread: number = 0
    currentStageDay: number = 0
    infectionsStage: InfectionStage = InfectionStage.healthy
    nextStage: InfectionStage = InfectionStage.incubation
    history = new Map<InfectionStage, number>()

    constructor(data: IPersonData) {
        this.id = uuid.v4()
        this.age = data.age
        Object.assign(this, data)
        if (this.infectionsStage === InfectionStage.incubation) {
            this.nextStage = InfectionStage.mild
        }
    }

    nextDay = () => {
        if (this.infected) {
            this.infectionDay++
            this.currentStageDay++
        }
    }

    setStage = (stage: InfectionStage) => {
        this.history.set(this.infectionsStage, this.currentStageDay)
        this.currentStageDay = 0
        this.infectionsStage = stage
    }

    heal = () => {
        this.setStage(InfectionStage.healed)
        this.immune = true
        this.infected = false
        this.hospitalized = false
    }

    infect = () => {
        if (this.immune || this.infected) return;

        this.infected = true
        this.infectionsStage = InfectionStage.incubation
        this.nextStage = InfectionStage.mild
        this.infectionDay = 0
        this.currentStageDay = 0
    }
}
