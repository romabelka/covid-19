import React from 'react'
import {PopulationControl} from '../controls/population'
import {HospitalsControl} from '../controls/hospitals'
import {Divider} from 'antd'
import {DaysControl} from '../controls/days'
import {Update} from '../controls/update'
import {SocialContactsControl} from '../controls/social-contacts'
import {ISocialContacts} from '../../types'
import {TravellersControl} from '../controls/travellers'

export interface ISimulationData {
    infectedPopulation: number[]
    hospitalBeds: number
    days: number
    travellers: number
    socialContacts: ISocialContacts
}

export interface InfectionControlsProps {
    simulationData: ISimulationData
    setSimulationData: (data: ISimulationData) => void
    update: () => void
}

export const InfectionControls: React.FC<InfectionControlsProps> = ({
    simulationData, setSimulationData, update
}) => {
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

    const handleDaysChange = (days: number) => setSimulationData({
        ...simulationData,
        days
    })

    const handleTravellersChange = (travellers: number) => setSimulationData({
        ...simulationData,
        travellers
    })

    const handleContactsChange = (socialContacts: ISocialContacts) => setSimulationData({
        ...simulationData,
        socialContacts
    })

    return (
        <div style={{width: '100%', padding: '0 30px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Controls</h2>
                <Update update={update} />
            </div>
            <HospitalsControl hospitalBeds={simulationData.hospitalBeds} handleHospitalsChange={handleHospitalsChange}/>
            <Divider />
            <TravellersControl handleTravellersChange={handleTravellersChange} travellers={simulationData.travellers}/>
            <Divider />
            <DaysControl handleDaysChange={handleDaysChange} days={simulationData.days}/>
            <Divider />
            <SocialContactsControl handleContactsChange={handleContactsChange} contacts={simulationData.socialContacts}/>
            <Divider />
            <PopulationControl population={simulationData.infectedPopulation} handlePopulationChange={handlePopulationChange}/>
        </div>
    )
}
