import React, {FC} from "react";
import {BufferInitParam, IndexParam, useGameContext} from "./GameContext"


const BufferSelector: FC<IndexParam> = (val: IndexParam) => {

    const {initParams, setInitParams} = useGameContext();

    function handleChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
        let value = Number(event.target.value);
        value = Math.max(0, Math.min(1000, value));

        let newInitParams = structuredClone(initParams);
        newInitParams.bufferInitParam[val.index].value = value;

        setInitParams(newInitParams);
    }

    function handleChangeLimit(event: React.ChangeEvent<HTMLInputElement>) {

        let newInitParams = structuredClone(initParams);
        newInitParams.bufferInitParam[val.index].limit = Boolean(event.target.checked);

        setInitParams(newInitParams);
    }

    return (
        <div className="initParams">Старт: <input
            type="number"
            placeholder="Start"
            value={initParams.bufferInitParam[val.index].value} min={0} max={1000}
            onChange={handleChangeValue}
            title="Начальное количество элементов в буфере,&#13;а так же значение лимита, если выбрано, что буфер лимитированый"
        /><br/>
            <input type="checkbox" id={"limit-" + initParams.bufferInitParam[val.index].index}
                   name="лимит" checked={initParams.bufferInitParam[val.index].limit} onChange={handleChangeLimit}
                   title="Лимитированый буфер или нет.&#13;Значение лимита равно начальному количеству элементов в буфере"
            />
            <label htmlFor={"limit-" + val.index}
                   title="Лимитированый буфер или нет.&#13;Значение лимита равно начальному количеству элементов в буфере"
            >лимит</label>
        </div>
    );
}


export {
    BufferSelector,
    BufferInitParam
};

