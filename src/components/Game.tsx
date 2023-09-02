import React, {useState} from "react";
import "./Game.css"
import {StepInitParam, StepInitParamHandler, StepSelector} from "./StepSelector"
import {BufferInitParam, BufferInitParamHandler, BufferSelector} from "./BufferSelector";

const Game = () => {

    class StatData {
        // Является ли ячейка буфером
        isBuffer: boolean;
        // Для буфера - число элементов, для этапа - число реально перемещённых элементов
        count: number;
        // Для этапа число элементов, которые он может перенести на этом шаге
        mayCount: number;


        constructor(isBuffer: boolean, count: number, mayCount: number) {
            this.isBuffer = isBuffer;
            this.count = count;
            this.mayCount = mayCount;
        }
    }

    class StatRow {
        cells: StatData[] = [];
    }

    const [iterStep, setIterStep] = useState(20);

    const [grid, setGridRow] = useState<StatRow[]>([]);

    const stepInitParamHandler: StepInitParamHandler = function (newStepInitParam: StepInitParam) {
        stepInitParam[newStepInitParam.index] = newStepInitParam;
        setStepInitParam([...stepInitParam]);
    }

    const bufferInitParamHandler: BufferInitParamHandler = function (newBufferInitParam: BufferInitParam) {
        bufferInitParam[newBufferInitParam.index] = newBufferInitParam;
        setBufferInitParam([...bufferInitParam]);
    }

    function makeStepInitParams() {
        return [
            new StepInitParam(0, 1, 6, stepInitParamHandler),
            new StepInitParam(1, 1, 6, stepInitParamHandler),
            new StepInitParam(2, 1, 6, stepInitParamHandler),
            new StepInitParam(3, 1, 6, stepInitParamHandler),
            new StepInitParam(4, 1, 6, stepInitParamHandler)
        ];
    }

    const [stepInitParam, setStepInitParam] = useState<StepInitParam[]>(makeStepInitParams());

    function makeBufferInitParams() {
        return [
            new BufferInitParam(0, 4, bufferInitParamHandler),
            new BufferInitParam(1, 4, bufferInitParamHandler),
            new BufferInitParam(2, 4, bufferInitParamHandler),
            new BufferInitParam(3, 4, bufferInitParamHandler)
        ];
    }

    const [bufferInitParam, setBufferInitParam] = useState<BufferInitParam[]>(makeBufferInitParams());

    function runClick() {
        let row: StatRow = new StatRow();

        row.cells.push(new StatData(true, -1, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, bufferInitParam[0].value, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, bufferInitParam[1].value, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, bufferInitParam[2].value, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, bufferInitParam[3].value, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, 0, 0));

        let rowArr = [row];


        for (let i = 0; i < iterStep; i++) {
            const newRow: StatRow = new StatRow();
            let k = stepInitParam.length;
            for (let j = row.cells.length - 1; j >= 0; j--) {
                let mc = 0;
                if (!(row.cells[j].isBuffer)) {
                    k--;
                    mc = Math.floor(Math.random() * (stepInitParam[k].maxValue - stepInitParam[k].minValue)) + stepInitParam[k].minValue;
                }
                newRow.cells.unshift(new StatData(row.cells[j].isBuffer, row.cells[j].count, mc));
            }
            for (let j = newRow.cells.length - 1; j > 0; j--) {
                if (!(newRow.cells[j].isBuffer)) {
                    newRow.cells[j].count = (newRow.cells[j - 1].count < 0) ? newRow.cells[j].mayCount : Math.min(newRow.cells[j].mayCount, newRow.cells[j - 1].count);
                    newRow.cells[j - 1].count -= newRow.cells[j].count;
                    newRow.cells[j + 1].count += newRow.cells[j].count;
                }
            }
            rowArr.unshift(newRow);
            row = newRow;
        }
        setGridRow(rowArr);
    }

    function handleChangeIterStep(event: React.ChangeEvent<HTMLInputElement>) {
        setIterStep(Math.max(10, Math.min(1000, Number(event.target.value))));
    }

    const BodyData = () => {

        return <tbody>
        {grid.map((item, index) => {
            const gl = grid.length;
            return (
                <tr key={"grid-" + index}>
                    <td key={"grid-" + index + "-0"}>{(gl - index - 1).toLocaleString()}</td>
                    {item.cells.map((st, stIndex) => {
                        if (st.isBuffer) {
                            return <td key={"grid-" + index + "-" + stIndex}>
                                {(st.count < 0) ? (st.count + 1).toLocaleString() : st.count.toLocaleString()}
                            </td>;
                        } else {
                            return <td key={"grid-" + index + "-" + stIndex}><span
                                className="gridCount">{st.count.toLocaleString()}</span><br/><span
                                className="gridMay">{st.mayCount.toLocaleString()}</span></td>;
                        }
                    })}
                </tr>
            );
        })}
        </tbody>
    };


    return (
        <div>
            Число итераций <input
            type="number"
            placeholder="Число итерациий"
            min={10} max={1000}
            value={iterStep}
            onChange={handleChangeIterStep}
        />&nbsp;
            <button onClick={runClick}>Запустить</button>
            <br/>
            <table className="gridTable">
                <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>Склад</th>
                    <th>Этап 1</th>
                    <th>Буфер 1</th>
                    <th>Этап 2</th>
                    <th>Буфер 2</th>
                    <th>Этап 3</th>
                    <th>Буфер 3</th>
                    <th>Этап 4</th>
                    <th>Буфер 4</th>
                    <th>Этап 5</th>
                    <th>Выход</th>
                </tr>
                <tr>
                    <th>#</th>
                    <th>&#x221e;</th>
                    <th><StepSelector index={stepInitParam[0].index} minValue={stepInitParam[0].minValue}
                                      maxValue={stepInitParam[0].maxValue} handler={stepInitParam[0].handler}
                                      key="ss-1"/></th>
                    <th><BufferSelector index={bufferInitParam[0].index} value={bufferInitParam[0].value}
                                        handler={bufferInitParam[0].handler} key="bs-1"/></th>
                    <th><StepSelector index={stepInitParam[1].index} minValue={stepInitParam[1].minValue}
                                      maxValue={stepInitParam[1].maxValue} handler={stepInitParam[1].handler}
                                      key="ss-2"/></th>
                    <th><BufferSelector index={bufferInitParam[1].index} value={bufferInitParam[1].value}
                                        handler={bufferInitParam[1].handler} key="bs-1"/></th>
                    <th><StepSelector index={stepInitParam[2].index} minValue={stepInitParam[2].minValue}
                                      maxValue={stepInitParam[2].maxValue} handler={stepInitParam[2].handler}
                                      key="ss-3"/></th>
                    <th><BufferSelector index={bufferInitParam[2].index} value={bufferInitParam[2].value}
                                        handler={bufferInitParam[2].handler} key="bs-1"/></th>
                    <th><StepSelector index={stepInitParam[3].index} minValue={stepInitParam[3].minValue}
                                      maxValue={stepInitParam[3].maxValue} handler={stepInitParam[3].handler}
                                      key="ss-4"/></th>
                    <th><BufferSelector index={bufferInitParam[3].index} value={bufferInitParam[3].value}
                                        handler={bufferInitParam[3].handler} key="bs-1"/></th>
                    <th><StepSelector index={stepInitParam[4].index} minValue={stepInitParam[4].minValue}
                                      maxValue={stepInitParam[4].maxValue} handler={stepInitParam[4].handler}
                                      key="ss-5"/></th>
                    <th>&nbsp;</th>
                </tr>
                </thead>
                <BodyData/>
            </table>
        </div>
    );
};

export default Game;
