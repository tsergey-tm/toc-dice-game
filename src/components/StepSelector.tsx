import React from "react";

class StepInitParam {
    minValue: number;
    maxValue: number;

    constructor(minValue: number, maxValue: number) {
        this.maxValue = maxValue;
        this.minValue = minValue;
    }
}

const StepSelector = (initParam: StepInitParam) => {

    return (
        <p>Мин: {initParam.minValue}<br/>Макс: {initParam.maxValue}</p>
    );
}


export default StepSelector, StepInitParam ;