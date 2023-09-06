import React, {FC} from "react";
import {IndexParam, StepInitParam, useGameContext} from "./GameContext"


const StepSelector: FC<IndexParam> = (val: IndexParam) => {

    const {initParams, setInitParams} = useGameContext();

    function handleChangeMin(event: React.ChangeEvent<HTMLInputElement>) {

        let value = Number(event.target.value);
        value = Math.max(0, Math.min(initParams.stepInitParam[val.index].maxValue, 100, value));

        let newInitParams = structuredClone(initParams);
        newInitParams.stepInitParam[val.index].minValue = value;

        setInitParams(newInitParams);
    }

    function handleChangeMax(event: React.ChangeEvent<HTMLInputElement>) {

        let value = Number(event.target.value);
        value = Math.max(initParams.stepInitParam[val.index].minValue, 0, Math.min(100, value));

        let newInitParams = structuredClone(initParams);
        newInitParams.stepInitParam[val.index].maxValue = value;

        setInitParams(newInitParams);
    }

    let options = [
        {value: 0, label: 'Самостоятельный'}
    ];

    for (let i = 1; i <= 5; i++) {
        if (i !== val.index + 1) {
            options.push({value: i, label: 'Ведомый от этапа ' + i});
        }
    }

    function setAcceptFromOption(newValue: number) {

        let newInitParams = structuredClone(initParams);
        newInitParams.stepInitParam[val.index].acceptFrom = newValue;

        setInitParams(newInitParams);
    }

    return (
        <p><select value={initParams.stepInitParam[val.index].acceptFrom}
                   onChange={e => setAcceptFromOption(Number(e.target.value))}
        >
            {
                options.map(({value, label}) =>
                    <option key={"stepsel-" + val.index + "-val-" + value} value={value}>{label}</option>)
            }
        </select><br/>
            Мин: <input
                type="number"
                placeholder="Min"
                value={initParams.stepInitParam[val.index].minValue} min={0} max={100}
                onChange={handleChangeMin}
                title="Минимальная мощность шага"
            /><br/>Макс: <input
                type="number"
                placeholder="Max"
                value={initParams.stepInitParam[val.index].maxValue} min={0} max={100}
                onChange={handleChangeMax}
                title="Предельная мощность шага"
            /></p>
    );
}


export {
    StepSelector,
    StepInitParam
};

