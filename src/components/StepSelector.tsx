import React, {FC, useState} from "react";
import Select from 'react-select';

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

    function setAcceptFromOption(option: { value: number, label: string } | null) {
        const value = option == null ? 0 : option.value;
        setAcceptFrom(value);

        param.handler(new StepInitParam(param.initParam.index, minValue, maxValue, value));
    }

    return (
        <p><Select
            options={options}
            defaultValue={options[acceptFrom]}
            onChange={setAcceptFromOption}
        />
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

