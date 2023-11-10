import React, {useState} from 'react';
import ManualSetup from './Custom/ManualSetup'

import Biography        from './Full/Biography'
import Goal             from './Full/Goal'
import ActivityLevel    from './Full/ActivityLevel'
import MacroSettings    from './Full/MacroSettings'

import Welcome          from './Shared/Welcome'
import Restrictions     from './Shared/Restrictions'
import Schedule         from './Shared/Schedule'
import Finalize         from './Shared/Finalize'


export default function InitialForm() {
    const [step, setStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);
    const [user_mode, setMode] = useState("");
    const [welcomeComplete, setWelcomeComplete] = useState(false);
    
    return (
        //Welcome.js

        //FULL
        //Age, height, weight
        //Activity level
        //Goal
        //Protein intake, carb/fat

        ///CUSTOM
        //Macros slider

        //BOTH
        //Dietary restrictions
        //Meals per day, snacks per day
        //Schedule / cheat meals
        <div>
            {!welcomeComplete && <Welcome complete = {setWelcomeComplete} setMode = {setMode} />}
            <ManualSetup />
            {(user_mode === "custom" && step === 0) && <ManualSetup change = {setStep}/>}
            {(user_mode === "full" && step === 0) && <Biography change = {setStep}/>}
            {(user_mode === "full" && step === 1) && <ActivityLevel change = {setStep}/>}
            {(user_mode === "full" && step === 2) && <Goal change = {setStep}/>}
            {(user_mode === "full" && step === 3) && <MacroSettings change = {setStep}/>}
            {(step === 10) && <Restrictions />}
            {(step === 11) && <Schedule />}
            {(step === 12) && <Finalize />}
        </div>

    )
}