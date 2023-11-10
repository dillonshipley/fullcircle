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

import Steps            from './Steps'


export default function InitialForm() {
    const [step, setStep] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);
    const [user_mode, setMode] = useState("");
    
    const changeMode = async (mode) => {
        console.log("works");
        if(mode === "full")
            setTotalSteps(8);
        else if(mode === "custom")
            setTotalSteps(5);

        await setMode(mode);
        await setStep(1);

    }

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
        <>
            <Steps total = {3} complete = {2} />
            {user_mode !== "" && <div>{user_mode}</div>}
            {step === 0 && <Welcome selection = {changeMode} />}
            {/*<ManualSetup />*/}
            {(user_mode === "custom" && step === 1) && <ManualSetup change = {setStep}/>}
            {(user_mode === "full" && step === 1) && <Biography change = {setStep}/>}
            {(user_mode === "full" && step === 2) && <ActivityLevel change = {setStep}/>}
            {(user_mode === "full" && step === 3) && <Goal change = {setStep}/>}
            {(user_mode === "full" && step === 4) && <MacroSettings change = {setStep}/>}
            {(step === 10) && <Restrictions />}
            {(step === 11) && <Schedule />}
            {(step === 12) && <Finalize />}
        </>

    )
}