import React, {FC} from "react";

// import the core library.
import ReactEChartsCore from 'echarts-for-react/lib/core';
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from 'echarts/core';
// Import charts, all with Chart suffix
import {BarChart, LineChart} from 'echarts/charts';
// import components, all suffixed with Component
import {GridComponent, TitleComponent, TooltipComponent,} from 'echarts/components';
// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import {CanvasRenderer,} from 'echarts/renderers';
import {EChartsOption, LineSeriesOption} from "echarts";

// Register the required components
echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer, LineChart]
);

class BufferData {
    counts: number[];

    constructor(counts: number[]) {
        this.counts = counts;
    }
}

class FlowData {
    count: number;
    stepDelta: number;
    mean: number;

    constructor(count: number, stepDelta: number, mean: number) {
        this.count = count;
        this.stepDelta = stepDelta;
        this.mean = mean;
    }
}

class ChartParam {

    bufferData: BufferData[];
    flowData: FlowData[];

    constructor(bufferData: BufferData[], flowData: FlowData[]) {
        this.bufferData = bufferData;
        this.flowData = flowData;
    }
}

const Chart: FC<ChartParam> = (param: ChartParam) => {

    let serFlowData: number[][] = [];
    let serFlowMeanData: number[][] = [];
    let serFlowMeanDeltaData: number[][] = [];

    param.flowData.forEach((value, index) => {
        serFlowData.push([index, value.count]);
        serFlowMeanData.push([index, value.mean]);
        serFlowMeanDeltaData.push([index, value.count - value.mean]);
    });

    let serFlow: LineSeriesOption = {
        xAxisIndex: 0,
        yAxisIndex: 0,
        name: "Поток",
        type: 'line',
        smooth: true,
        smoothMonotone: 'x',
        itemStyle: {
            opacity: 0,
            color: "rgba(255,64,64,1)",
        },
        lineStyle: {
            color: "rgba(255,64,64,1)",
        },
        areaStyle: {
            color: "rgba(255,64,64,0.75)",
            origin: 'auto',
        },
        data: serFlowData,
    };
    let serFlowMean: LineSeriesOption = {
        xAxisIndex: 0,
        yAxisIndex: 0,
        name: "Ожидание",
        type: 'line',
        smooth: true,
        smoothMonotone: 'x',
        itemStyle: {
            color: "rgb(166,204,147)",
            opacity: 0,
        },
        lineStyle: {
            color: "rgb(166,204,147)",
        },
        areaStyle: {
            opacity: 0,
        },
        data: serFlowMeanData,
    };
    let serFlowMeanDelta: LineSeriesOption = {
        xAxisIndex: 0,
        yAxisIndex: 0,
        name: "Разница между потоком и ожиданием",
        type: 'line',
        smooth: true,
        smoothMonotone: 'x',
        itemStyle: {
            color: "rgb(255,219,140)",
            opacity: 0,
        },
        lineStyle: {
            color: "rgb(255,219,140)",
        },
        areaStyle: {
            color: "rgba(255,219,140,0.75)",
            origin: 'auto',
        },
        data: serFlowMeanDeltaData,
    };

    const buffCount = param.bufferData[0].counts.length;

    let buffersData: number[][][] = [];
    for (let i = 0; i < buffCount; i++) {
        buffersData[i] = [];
        param.bufferData.forEach(
            (value, index) => {
                buffersData[i].push([index, value.counts[i]])
            }
        );
    }


    let serBuffer: LineSeriesOption[] = [];

    for (let i = 0; i < buffCount; i++) {
        serBuffer.push({
                xAxisIndex: 1,
                yAxisIndex: 1,
                name: "Буффер " + (i + 1),
                type: 'line',
                stack: "buffers",
                smooth: true,
                smoothMonotone: 'x',
                itemStyle: {
                    opacity: 0,
                },
                areaStyle: {
                    origin: 'auto',
                },
                data: buffersData[i],
            }
        );
    }


    const options: EChartsOption = {

        animation: true,
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                }
            }
        },
        tooltip: {
            axisPointer: {
                show: true,
            },
        },
        legend: {
            show: true,
            top: 'bottom',
        },
        grid: [
            {
                left: "3%",
                width: "30%",
            },
            {
                left: "36%",
                width: "30%",
            },
            {
                left: "68%",
                width: "30%",
            },
        ],
        xAxis: [
            {
                gridIndex: 0,
                name: "Итерации",
                nameLocation: "middle",
                nameGap: 30,
                axisPointer: {
                    show: true,
                    snap: true,
                    label: {},
                },
                type: 'category',
                axisLabel: {
                    hideOverlap: true,
                },
                min: 'dataMin',
                max: 'dataMax',
            },
            {
                gridIndex: 1,
                name: "Итерации",
                nameLocation: "middle",
                nameGap: 30,
                axisPointer: {
                    show: true,
                    snap: true,
                    label: {},
                },
                type: 'category',
                axisLabel: {
                    hideOverlap: true,
                },
                min: 'dataMin',
                max: 'dataMax',
            },
        ],
        yAxis: [
            {
                gridIndex: 0,
                name: "Поток",
                nameGap: 40,
                nameLocation: 'middle',
                minInterval: 1,
                axisPointer: {
                    show: true,
                    triggerTooltip: false,
                },
                axisLabel: {
                    hideOverlap: true,
                },
            },
            {
                gridIndex: 1,
                name: "Незавершенка",
                nameGap: 40,
                nameLocation: 'middle',
                minInterval: 1,
                axisPointer: {
                    show: true,
                    triggerTooltip: false,
                },
                axisLabel: {
                    hideOverlap: true,
                },
                min: 0
            },
        ],
        series: [serFlow, serFlowMean, serFlowMeanDelta, ...serBuffer],
    };

    return (
        <ReactEChartsCore
            echarts={echarts}
            option={options}
        />
    );
}

export {Chart, ChartParam, FlowData, BufferData};