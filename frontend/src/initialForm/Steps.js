export default function Steps({complete, total}){
    const completeStep = (complete) => {
        for(var i = 0; i < complete; i++){
            <div className = "completeStep">a</div>
        }
    }

    const totalStep = (total) => {
        for(var i = 0; i < total; i++){
            <div className = "incompleteStep"></div>
        }
    }
 
    return (
        <div>
            {completeStep(complete)}
            {totalStep(total - complete)}
        </div>
    )
}