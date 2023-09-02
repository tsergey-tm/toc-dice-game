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

    const [minValue, setMinValue] = useState(initParam.minValue);
    const [maxValue, setMaxValue] = useState(initParam.maxValue);

    function handleChangeMin(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Math.max(0, Math.min(maxValue, 100, Number(event.target.value)));
        setMinValue(value);

        initParam.handler(new StepInitParam(initParam.index, value, maxValue, initParam.handler));
    }

    function handleChangeMax(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Math.max(minValue, 0, Math.min(100, Number(event.target.value)));
        setMaxValue(value);

        initParam.handler(new StepInitParam(initParam.index, minValue, value, initParam.handler));
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

