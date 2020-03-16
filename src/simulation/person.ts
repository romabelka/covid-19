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
}

export class Person implements IPerson {
    id: string
    age: number
    immune: boolean = false
    infected: boolean = false
    hospitalized: boolean = false
    infectionDay: number = 0
    currentStageDay: number = 0
    infectionsStage: InfectionStage = InfectionStage.healthy
    history = new Map<InfectionStage, number>()

    constructor(data: IPersonData) {
        this.id = uuid.v4()
        this.age = data.age
        Object.assign(this, data)
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
}
