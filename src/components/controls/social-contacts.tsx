import React from 'react'
import {Slider} from 'antd'
import {ISocialContacts} from '../../types'
import {multiplier} from '../../simulation/constants'

interface SocialContactsControlProps {
    handleContactsChange: (amount: ISocialContacts) => void
    contacts: ISocialContacts
}

export const SocialContactsControl: React.FC<SocialContactsControlProps> = ({ contacts, handleContactsChange }) => {
    const handleChange = (data: Partial<ISocialContacts>) => {
        handleContactsChange({
            ...contacts,
            ...data
        })
    }

    const fraction = multiplier / 10
    return (
        <div>
            <h2>Quarantine:</h2>
            <h4>Quarantine Days:</h4>
            <Slider
                defaultValue={contacts.quarantineTime}
                min={0}
                max={1000}
                marks={{0: 0, 1000: 1000}}
                onAfterChange={(days) => handleChange({ quarantineTime: days as number })}
                tooltipVisible
            />
            <h4>Quarantine age:</h4>
            <Slider
                defaultValue={contacts.quarantineAge}
                min={0}
                max={100}
                marks={{0: 0, 100: 100}}
                onAfterChange={(age) => handleChange({ quarantineAge: age as number })}
                tooltipVisible
            />
            <h4>Average Contacts:</h4>
            <Slider
                defaultValue={contacts.avContactsGeneral * fraction}
                min={0}
                max={40 * fraction}
                marks={{0: 0, [40 * fraction]: 40 * fraction}}
                step={fraction}
                onAfterChange={(contacts) => handleChange({ avContactsGeneral: Math.round(contacts as number / fraction)})}
                tooltipVisible
            />
            <h4>Contacts Quarantined:</h4>
            <Slider
                defaultValue={contacts.avContactsQuarantine * fraction}
                min={0}
                max={40 * fraction}
                marks={{0: 0, [40 * fraction]: 40 * fraction}}
                step={fraction}
                onAfterChange={(contacts) => handleChange({ avContactsQuarantine: Math.round(contacts as number / fraction) })}
                tooltipVisible
            />
        </div>
    )
}
