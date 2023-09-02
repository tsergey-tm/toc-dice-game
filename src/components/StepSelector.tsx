import React, {FC, useState} from "react";

class StepInitParam {
    index: number;
    minValue: number;
    maxValue: number;
    handler: StepInitParamHandler;

    constructor(index: number, minValue: number, maxValue: number, handler: StepInitParamHandler) {
        this.index = index;
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.handler = handler;
    }
}

type StepInitParamHandler = (a: StepInitParam) => void;
const StepSelector: FC<StepInitParam> = (initParam: StepInitParam) => {

    let [minValue, setMinValue] = useState(initParam.minValue);
    const [maxValue, setMaxValue] = useState(initParam.maxValue);

    function handleChangeMin(event: React.ChangeEvent<HTMLInputElement>) {
        setMinValue(Math.max(1, Math.min(maxValue, 100, Number(event.target.value))));

        initParam.handler(new StepInitParam(initParam.index, minValue, maxValue, initParam.handler));
    }

    function handleChangeMax(event: React.ChangeEvent<HTMLInputElement>) {
        setMaxValue(Math.max(minValue, 1, Math.min(100, Number(event.target.value))));

        initParam.handler(new StepInitParam(initParam.index, minValue, maxValue, initParam.handler));
    }

    return (
        <p>Мин: <input
            type="number"
            placeholder="Min"
            value={minValue} min={0} max={100}
            onChange={handleChangeMin}
        /><br/>Макс: <input
            type="number"
            placeholder="Max"
            value={maxValue} min={0} max={100}
            onChange={handleChangeMax}
        /></p>
    );
}


export {
    StepSelector,
    StepInitParam
};

export type {StepInitParamHandler};

