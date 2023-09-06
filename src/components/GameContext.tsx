import React, {PropsWithChildren, useContext, useState} from "react";

export type IndexParam = {
    index: number
}

export class StepInitParam {
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

export class BufferInitParam {
    index: number;
    value: number;
    limit: boolean;

    constructor(index: number, value: number, limit: boolean) {
        this.index = index;
        this.value = value;
        this.limit = limit;
    }
}

export class InitParams {
    stepInitParam: StepInitParam[];
    bufferInitParam: BufferInitParam[];

    constructor(stepInitParam: StepInitParam[], bufferInitParam: BufferInitParam[]) {
        this.stepInitParam = stepInitParam;
        this.bufferInitParam = bufferInitParam;
    }
}

function makeDefaultContext(): InitParams {
    return new InitParams([
        new StepInitParam(0, 1, 6, 0),
        new StepInitParam(1, 1, 6, 0),
        new StepInitParam(2, 1, 6, 0),
        new StepInitParam(3, 1, 6, 0),
        new StepInitParam(4, 1, 6, 0)
    ], [
        new BufferInitParam(0, 4, false),
        new BufferInitParam(1, 4, false),
        new BufferInitParam(2, 4, false),
        new BufferInitParam(3, 4, false)
    ]);
}

export type GameContextType = {
    initParams: InitParams;
    setInitParams: (initParams: InitParams) => void;
}
export const GameContext = React.createContext<GameContextType | undefined>(undefined);
export const GameContextProvider = ({children}: PropsWithChildren<{}>) => {
    const [initParams, setInitParams] = useState<InitParams>(makeDefaultContext());

    return (
        <GameContext.Provider value={{initParams, setInitParams}}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);

    if (!context) {
        throw new Error('useGameContext must be used inside the GameContextProvider');
    }

    return context;
};