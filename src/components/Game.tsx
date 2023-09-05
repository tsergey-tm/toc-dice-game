import React, {useState} from "react";
import "./Game.css"
import {StepInitParam, StepInitParamHandler, StepSelector} from "./StepSelector"
import {BufferInitParam, BufferInitParamHandler, BufferSelector} from "./BufferSelector";
import {BufferData, Chart, ChartParam, ControlData, FlowData} from "./Chart";

const Game = () => {

    class StatData {
        // Индекс элемента в init параметрах
        index: number;
        // Является ли ячейка буфером
        isBuffer: boolean;
        // Является ли шаг первым
        isFirst: boolean;
        // Является ли шаг последним
        isLast: boolean;
        // Для буфера - число элементов, для этапа - число реально перемещённых элементов
        count: number;
        // Для этапа число элементов, которые он может перенести на этом шаге
        mayCount: number;
        // Для буфера - лимит буфера. Если равно 0, то лимита нет
        limit: number;
        // Для этапа - ссылка на ведущий этап, если 0, то этот этап самостоятельный
        acceptFrom: number;

        constructor(index: number, isBuffer: boolean, isFirst: boolean, isLast: boolean, count: number,
                    mayCount: number, limit: number, acceptFrom: number) {
            this.index = index;
            this.isBuffer = isBuffer;
            this.isFirst = isFirst;
            this.isLast = isLast;
            this.count = count;
            this.mayCount = mayCount;
            this.limit = limit;
            this.acceptFrom = acceptFrom;
        }
    }

    class Task {
        firstTime: number;
        lastTime: number;

        constructor(firstTime: number, lastTime: number) {
            this.firstTime = firstTime;
            this.lastTime = lastTime;
        }
    }

    class Buffer {
        tasks: Task[] = [];
    }

    class StatRow {
        cells: StatData[] = [];
    }

    const [chartParam, setChartParam] = useState<null | ChartParam>(null);

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
            new StepInitParam(0, 1, 6, 0),
            new StepInitParam(1, 1, 6, 0),
            new StepInitParam(2, 1, 6, 0),
            new StepInitParam(3, 1, 6, 0),
            new StepInitParam(4, 1, 6, 0)
        ];
    }

    const [stepInitParam, setStepInitParam] = useState<StepInitParam[]>(makeStepInitParams());

    function makeBufferInitParams() {
        return [
            new BufferInitParam(0, 4, false),
            new BufferInitParam(1, 4, false),
            new BufferInitParam(2, 4, false),
            new BufferInitParam(3, 4, false)
        ];
    }

    const [bufferInitParam, setBufferInitParam] = useState<BufferInitParam[]>(makeBufferInitParams());

    function makeCharts(rowArr: StatRow[], buffers: Buffer[]) {

        let means: number[] = [];
        stepInitParam.forEach(v => means.push((v.minValue + v.maxValue) / 2));
        const mean = Math.min(...means);

        rowArr.reverse();

        let flowData: FlowData[] = [];
        let flowLast = 0;
        const exitIndex = 10;
        let bufferData: BufferData[] = [];
        rowArr.forEach((value, index) => {
            flowData.push(new FlowData(
                value.cells[exitIndex].count,
                value.cells[exitIndex].count - flowLast,
                mean * index
            ));
            flowLast = value.cells[exitIndex].count;

            let buffData = new BufferData([])
            for (let i = 1; i < exitIndex; i++) {
                if (value.cells[i].isBuffer) {
                    buffData.counts.push(value.cells[i].count);
                }
            }

            bufferData.push(buffData);
        });

        let controlData: ControlData = new ControlData([]);
        buffers[buffers.length - 1].tasks.forEach(t => {
            if ((t.firstTime >= 0) && (t.lastTime >= 0)) {
                controlData.times.push(t.lastTime - t.firstTime);
            }
        })

        setChartParam(new ChartParam(bufferData, flowData, controlData));
    }

    function runClick() {
        let row: StatRow = new StatRow();

        const acceptFromIndexes = [0, 1, 3, 5, 7, 9];

        const buffers: Buffer[] = [new Buffer(), new Buffer(), new Buffer(), new Buffer(), new Buffer()];

        row.cells.push(new StatData(-1, true, true, false, -1, 0, 0, 0));
        row.cells.push(new StatData(0, false, true, false, 0, 0, stepInitParam[0].maxValue, acceptFromIndexes[stepInitParam[0].acceptFrom]));
        row.cells.push(new StatData(0, true, false, false, bufferInitParam[0].value, 0, bufferInitParam[0].limit ? bufferInitParam[0].value : 0, 0));
        row.cells.push(new StatData(1, false, false, false, 0, 0, stepInitParam[1].maxValue, acceptFromIndexes[stepInitParam[1].acceptFrom]));
        row.cells.push(new StatData(1, true, false, false, bufferInitParam[1].value, 0, bufferInitParam[1].limit ? bufferInitParam[1].value : 0, 0));
        row.cells.push(new StatData(2, false, false, false, 0, 0, stepInitParam[2].maxValue, acceptFromIndexes[stepInitParam[2].acceptFrom]));
        row.cells.push(new StatData(2, true, false, false, bufferInitParam[2].value, 0, bufferInitParam[2].limit ? bufferInitParam[2].value : 0, 0));
        row.cells.push(new StatData(3, false, false, false, 0, 0, stepInitParam[3].maxValue, acceptFromIndexes[stepInitParam[3].acceptFrom]));
        row.cells.push(new StatData(3, true, false, false, bufferInitParam[3].value, 0, bufferInitParam[3].limit ? bufferInitParam[3].value : 0, 0));
        row.cells.push(new StatData(4, false, false, true, 0, 0, stepInitParam[4].maxValue, acceptFromIndexes[stepInitParam[4].acceptFrom]));
        row.cells.push(new StatData(4, true, false, true, 0, 0, 0, 0));

        for (let cell of row.cells) {
            if (cell.isBuffer && !cell.isFirst) {
                for (let i = 0; i < cell.count; i++) {
                    buffers[cell.index].tasks.push(new Task(-1, -1));
                }
            }
        }

        let rowArr = [row];


        for (let iteration = 1; iteration <= iterStep; iteration++) {
            const newRow: StatRow = new StatRow();
            let steps: number[] = [];
            for (let j = row.cells.length - 1; j >= 0; j--) {
                let mc = 0;
                if (!(row.cells[j].isBuffer)) {
                    mc = Math.floor(
                        Math.random() * (stepInitParam[row.cells[j].index].maxValue -
                            stepInitParam[row.cells[j].index].minValue)
                    ) + stepInitParam[row.cells[j].index].minValue;
                    steps.push(j);
                }
                newRow.cells.unshift(new StatData(
                    row.cells[j].index,
                    row.cells[j].isBuffer,
                    row.cells[j].isFirst,
                    row.cells[j].isLast,
                    row.cells[j].count,
                    mc,
                    row.cells[j].limit,
                    row.cells[j].acceptFrom));
            }

            while (steps.length > 0) {
                let index = 0;
                if (newRow.cells[steps[index]].acceptFrom > 0) {
                    let index1 = steps.indexOf(newRow.cells[steps[index]].acceptFrom);
                    while (index1 > 0) {
                        index = index1;
                        index1 = steps.indexOf(newRow.cells[steps[index]].acceptFrom);
                    }
                    newRow.cells[steps[index]].mayCount = Math.min(newRow.cells[steps[index]].limit, newRow.cells[newRow.cells[steps[index]].acceptFrom].mayCount);

                    steps.splice(index, 1);
                } else {
                    steps.splice(index, 1);
                }
            }

            for (let j = newRow.cells.length - 1; j > 0; j--) {
                if (!(newRow.cells[j].isBuffer)) {
                    let cnt = (newRow.cells[j - 1].count < 0) ?
                        newRow.cells[j].mayCount :
                        Math.min(newRow.cells[j].mayCount, newRow.cells[j - 1].count);

                    if (newRow.cells[j + 1].limit > 0) {

                        cnt = Math.min(newRow.cells[j + 1].limit - newRow.cells[j + 1].count, cnt)
                    }

                    newRow.cells[j].count = cnt;
                    newRow.cells[j - 1].count -= cnt;
                    newRow.cells[j + 1].count += cnt;

                    if (newRow.cells[j].isFirst) {
                        const ni = newRow.cells[j + 1].index;
                        for (let k = 0; k < cnt; k++) {
                            buffers[ni].tasks.push(new Task(iteration, -1));
                        }
                    } else if (newRow.cells[j].isLast) {
                        const oi = newRow.cells[j - 1].index;
                        const ni = newRow.cells[j + 1].index;
                        for (let k = 0; k < cnt; k++) {
                            const task = buffers[oi].tasks.shift();
                            // @ts-ignore
                            task.lastTime = iteration;
                            // @ts-ignore
                            buffers[ni].tasks.push(task);
                        }
                    } else {
                        const oi = newRow.cells[j - 1].index;
                        const ni = newRow.cells[j + 1].index;
                        for (let k = 0; k < cnt; k++) {
                            // @ts-ignore
                            buffers[ni].tasks.push(buffers[oi].tasks.shift());
                        }
                    }
                }
            }
            rowArr.unshift(newRow);
            row = newRow;
        }
        setGridRow(rowArr);
        makeCharts([...rowArr], buffers);
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
            {chartParam ? (<Chart bufferData={chartParam.bufferData} flowData={chartParam.flowData}
                                  controlData={chartParam.controlData}/>) : null}
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
                    <th><StepSelector initParam={stepInitParam[0]} handler={stepInitParamHandler} key="ss-1"/></th>
                    <th><BufferSelector initParam={bufferInitParam[0]} handler={bufferInitParamHandler} key="bs-1"/>
                    </th>
                    <th><StepSelector initParam={stepInitParam[1]} handler={stepInitParamHandler} key="ss-2"/></th>
                    <th><BufferSelector initParam={bufferInitParam[1]} handler={bufferInitParamHandler}
                                        key="bs-1"/></th>
                    <th><StepSelector initParam={stepInitParam[2]} handler={stepInitParamHandler} key="ss-3"/></th>
                    <th><BufferSelector initParam={bufferInitParam[2]} handler={bufferInitParamHandler}
                                        key="bs-1"/></th>
                    <th><StepSelector initParam={stepInitParam[3]} handler={stepInitParamHandler} key="ss-4"/></th>
                    <th><BufferSelector initParam={bufferInitParam[3]} handler={bufferInitParamHandler}
                                        key="bs-1"/></th>
                    <th><StepSelector initParam={stepInitParam[4]} handler={stepInitParamHandler} key="ss-5"/></th>
                    <th>&nbsp;</th>
                </tr>
                </thead>
                <BodyData/>
            </table>
        </div>
    );
};

export default Game;
