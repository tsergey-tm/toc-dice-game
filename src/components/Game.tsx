import React, {useState} from "react";
import "./Game.css"
import StepSelector from "./StepSelector"

const Game = () => {

    class StatData {
        isBuffer: boolean;
        count: number;
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

    init

    const [iterStep, setIterStep] = useState(20);

    const [grid, setGridRow] = useState<StatRow[]>([]);

    function runClick() {
        let row: StatRow = new StatRow();

        row.cells.push(new StatData(true, -1, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, 4, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, 4, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, 4, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, 4, 0));
        row.cells.push(new StatData(false, 0, 0));
        row.cells.push(new StatData(true, 0, 0));

        let rowArr = [row];


        for (let i = 0; i < iterStep; i++) {
            const newRow: StatRow = new StatRow();
            for (let j = row.cells.length - 1; j >= 0; j--) {
                newRow.cells.unshift(new StatData(row.cells[j].isBuffer, row.cells[j].count, row.cells[j].mayCount));
            }
            for (let j = newRow.cells.length - 1; j > 0; j--) {
                if (!(newRow.cells[j].isBuffer)) {
                    newRow.cells[j].mayCount = Math.floor(Math.random() * 5) + 1;
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

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setIterStep(Math.max(1, Math.min(1000, Number(event.target.value))));
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
            value={iterStep}
            onChange={handleChange}
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
                    <th><StepSelector key="ss-1"/></th>
                    <th>Старт: 4</th>
                    <th><StepSelector key="ss-2"/></th>
                    <th>Старт: 4</th>
                    <th><StepSelector key="ss-3"/></th>
                    <th>Старт: 4</th>
                    <th><StepSelector key="ss-4"/></th>
                    <th>Старт: 4</th>
                    <th><StepSelector key="ss-5"/></th>
                    <th>&nbsp;</th>
                </tr>
                </thead>
                <BodyData/>
            </table>
        </div>
    );
};

export default Game;
