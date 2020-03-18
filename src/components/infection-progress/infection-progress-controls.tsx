import React from 'react'
import {PopulationControl} from '../controls/population'
import {HospitalsControl} from '../controls/hospitals'
import {Divider} from 'antd'

export interface ISimulationData {
    infectedPopulation: number[],
    hospitalBeds: number
}

export interface InfectionControlsProps {
    simulationData: ISimulationData
    setSimulationData: (data: ISimulationData) => void
}

export const InfectionControls: React.FC<InfectionControlsProps> = ({ simulationData, setSimulationData }) => {
    const handlePopulationChange = (group: number, amount: number) => {
        const infectedPopulation = [...simulationData.infectedPopulation]
        infectedPopulation[group] = amount

        setSimulationData({
            ...simulationData,
            infectedPopulation
        })
    }

    const handleHospitalsChange = (hospitalBeds: number) => setSimulationData({
        ...simulationData,
        hospitalBeds
    })

    return (
        <div style={{width: '100%', padding: '0 30px'}}>
            <h2>Controls</h2>
            <HospitalsControl hospitalBeds={simulationData.hospitalBeds} handleHospitalsChange={handleHospitalsChange}/>
            <Divider />
            <PopulationControl population={simulationData.infectedPopulation} handlePopulationChange={handlePopulationChange}/>
        </div>
    )
}
