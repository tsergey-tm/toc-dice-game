import React, {FC, useState} from "react";

class BufferInitParam {
    index: number;
    value: number;
    handler: BufferInitParamHandler;

    constructor(index: number, value: number, handler: BufferInitParamHandler) {
        this.index = index;
        this.value = value;
        this.handler = handler;
    }
}

type BufferInitParamHandler = (a: BufferInitParam) => void;
const BufferSelector: FC<BufferInitParam> = (initParam: BufferInitParam) => {

    const [value, setValue] = useState(initParam.value);

    function handleChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Math.max(0, Math.min(1000, Number(event.target.value)));
        setValue(value);

        initParam.handler(new BufferInitParam(initParam.index, value, initParam.handler));
    }

    return (
        <p>Старт: <input
            type="number"
            placeholder="Start"
            value={value} min={0} max={1000}
            onChange={handleChangeValue}
        /></p>
    );
}


export {
    BufferSelector,
    BufferInitParam
};

export type {BufferInitParamHandler};

