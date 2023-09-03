import React, {FC, useState} from "react";

class BufferInitParam {
    index: number;
    value: number;
    limit: boolean;

    constructor(index: number, value: number, limit: boolean) {
        this.index = index;
        this.value = value;
        this.limit = limit;
    }
}

class BufferInitComponentParam {
    initParam: BufferInitParam;
    handler: BufferInitParamHandler;

    constructor(initParam: BufferInitParam, handler: BufferInitParamHandler) {
        this.initParam = initParam;
        this.handler = handler;
    }
}

type BufferInitParamHandler = (a: BufferInitParam) => void;

const BufferSelector: FC<BufferInitComponentParam> = (param: BufferInitComponentParam) => {

    const [value, setValue] = useState(param.initParam.value);
    const [limit, setLimit] = useState(param.initParam.limit);

    function handleChangeValue(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Math.max(0, Math.min(1000, Number(event.target.value)));
        setValue(value);

        param.handler(new BufferInitParam(param.initParam.index, value, limit));
    }

    function handleChangeLimit(event: React.ChangeEvent<HTMLInputElement>) {
        const limit: boolean = Boolean(event.target.checked);
        setLimit(limit);

        param.handler(new BufferInitParam(param.initParam.index, value, limit));
    }

    return (
        <p>Старт: <input
            type="number"
            placeholder="Start"
            value={value} min={0} max={1000}
            onChange={handleChangeValue}
        /><br/>
            <input type="checkbox" id={"limit-" + param.initParam.index}
                   name="лимит" checked={param.initParam.limit} onChange={handleChangeLimit}/>
            <label htmlFor={"limit-" + param.initParam.index}>лимит</label>
        </p>
    );
}


export {
    BufferSelector,
    BufferInitParam
};

export type {BufferInitParamHandler};

