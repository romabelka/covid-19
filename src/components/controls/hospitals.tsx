import React from 'react'
import {Slider} from 'antd'
import {multiplier} from '../../simulation/constants'

interface HospitalsControlProps {
    handleHospitalsChange: (amount: number) => void
    hospitalBeds: number
}

export const HospitalsControl: React.FC<HospitalsControlProps> = ({ hospitalBeds, handleHospitalsChange }) => {
    return (
        <div>
            <h3>Hospital beds:</h3>
            <Slider
                defaultValue={hospitalBeds * multiplier}
                min={0}
                max={1000 * multiplier}
                step={multiplier}
                marks={{0: 0, [1000 * multiplier]: 1000 * multiplier}}
                onAfterChange={(amount) => handleHospitalsChange(Math.round(amount as number / multiplier))}
                tooltipVisible
            />
        </div>
    )
}
