import React, {FC, useState} from "react";

class StepInitParam {
    index: number;
    minValue: number;
    maxValue: number;
    acceptFrom: number;

    constructor(index: number, minValue: number, maxValue: number, acceptFrom: number) {
        this.index = index;
        this.maxValue = maxValue;
        this.minValue = minValue;
        this.acceptFrom = acceptFrom;
    }
}

class StepInitComponentParam {
    initParam: StepInitParam;
    handler: StepInitParamHandler;

    constructor(initParam: StepInitParam, handler: StepInitParamHandler) {
        this.initParam = initParam;
        this.handler = handler;
    }
}

const StepSelector: FC<StepInitComponentParam> = (param: StepInitComponentParam) => {

    const [minValue, setMinValue] = useState(param.initParam.minValue);
    const [maxValue, setMaxValue] = useState(param.initParam.maxValue);
    const [acceptFrom, setAcceptFrom] = useState(param.initParam.acceptFrom);

    function handleChangeMin(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Math.max(0, Math.min(maxValue, 100, Number(event.target.value)));
        setMinValue(value);

        param.handler(new StepInitParam(param.initParam.index, value, maxValue, acceptFrom));
    }

    function handleChangeMax(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Math.max(minValue, 0, Math.min(100, Number(event.target.value)));
        setMaxValue(value);

        param.handler(new StepInitParam(param.initParam.index, minValue, value, acceptFrom));
    }

    let options = [
        {value: 0, label: 'Самостоятельный'}
    ];

    for (let i = 1; i <= 5; i++) {
        if (i !== param.initParam.index + 1) {
            options.push({value: i, label: 'Ведомый от этапа ' + i});
        }
    }

    function setAcceptFromOption( newValue: number) {

        setAcceptFrom(newValue);

        param.handler(new StepInitParam(param.initParam.index, minValue, maxValue, newValue));
    }

    return (
        <p><select
            onChange={e => setAcceptFromOption(Number(e.target.value))}
        >
            {
                options.map(({value,label}) =>
                    <option key={"stepsel-"+param.initParam.index+"-val-"+value} value={value}>{label}</option> )
            }
        </select><br/>
            Мин: <input
                type="number"
                placeholder="Min"
                value={minValue} min={0} max={100}
                onChange={handleChangeMin}
                title="Минимальная мощность шага"
            /><br/>Макс: <input
                type="number"
                placeholder="Max"
                value={maxValue} min={0} max={100}
                onChange={handleChangeMax}
                title="Предельная мощность шага"
            /></p>
    );
}
type StepInitParamHandler = (a: StepInitParam) => void;


export {
    StepSelector,
    StepInitParam
};

export type {StepInitParamHandler};

