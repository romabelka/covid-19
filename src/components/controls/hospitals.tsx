import React from 'react'
import {Slider} from 'antd'

interface HospitalsControlProps {
    handleHospitalsChange: (amount: number) => void
    hospitalBeds: number
}

export const HospitalsControl: React.FC<HospitalsControlProps> = ({ hospitalBeds, handleHospitalsChange }) => {
    return (
        <div>
            <h3>Hospital beds:</h3>
            <Slider
                defaultValue={hospitalBeds}
                min={0}
                max={1e3}
                marks={{0: 0, 1000: 1000}}
                onAfterChange={(amount) => handleHospitalsChange(amount as number)}
            />
        </div>
    )
}
