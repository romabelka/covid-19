import React from 'react'
import {Slider} from 'antd'

interface SocialContactsControlProps {
    handleContactsChange: (amount: number) => void
    contacts: number
}

export const SocialContactsControl: React.FC<SocialContactsControlProps> = ({ contacts, handleContactsChange }) => {
    return (
        <div>
            <h3>Average daily contacts:</h3>
            <Slider
                defaultValue={contacts}
                min={0}
                max={20}
                marks={{0: 0, 20: 20}}
                onAfterChange={(amount) => handleContactsChange(amount as number)}
            />
        </div>
    )
}
