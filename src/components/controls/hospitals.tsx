import React from 'react'
import {Slider} from 'antd'

interface HospitalsControlProps {
    handleHospitalsChange: (amount: number) => void
    hospitalBeds: number
}

export const HospitalsControl: React.FC<HospitalsControlProps> = ({ hospitalBeds, handleHospitalsChange }) => {
    return (
        <div style={{width: '50%'}}>
            <h3>Hospitals</h3>
            <Slider
                defaultValue={hospitalBeds}
                min={0}
                max={1e3}
                onAfterChange={(amount) => handleHospitalsChange(amount as number)}
            />
        </div>
    )
}
