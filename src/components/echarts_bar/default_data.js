const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "30%",
        "height": "30%",
    },
    "moduleName": "echarts_bar",
    "delayTime": 1000,
    "style": {
        "seriesBackground": [{
            "barWidth": "20%",
            "stack": "shadow",
            "silent": true,
            "show": true,
            "tooltip": {
                "show": false
            },
            "itemStyle": {
                "borderType": "solid",
                "borderColor": "rgba(0,0,0,0)",
                "color": "rgba(255,255,255,0)",
                "borderWidth": 0,
                "barBorderRadius": "0"
            },
            "z": 1,
            "label": {},
            "type": "bar"
        }],
        "stack": false,
        "yAxis": [{
            "axisLabel": {
                "rotate": 0,
                "verticalAlign": "middle",
                "margin": 8,
                "color": "rgba(255,255,255,1)",
                "show": true,
                "interval": 0,
                "fontSize": "1.2vh",
                "inside": false,
                "align": "right"
            },
            "inverse": false,
            "dataZoomStyle": {
                "areaStyle": {
                    "color": ["#0ff"],
                    "linearColor": [{
                        "start": "red",
                        "end": "blue"
                    }],
                    "colorType": 1
                },
                "lineStyle": {
                    "color": ["#0ff"],
                    "linearColor": [{
                        "start": "red",
                        "end": "blue"
                    }],
                    "colorType": 1
                },
                "handleStyle": {
                    "color": ["#fff"],
                    "linearColor": [{
                        "start": "red",
                        "end": "blue"
                    }],
                    "colorType": 1
                }
            },
            "gridIndex": 0,
            "axisLine": {
                "lineStyle": {
                    "color": "rgba(255,255,255,0.5)",
                    "width": 1,
                    "type": "solid"
                },
                "show": true
            },
            "show": true,
            "axisTick": {
                "lineStyle": {
                    "color": "#333",
                    "width": 1,
                    "type": "solid"
                },
                "show": false,
                "length": 5,
                "interval": 0,
                "inside": false,
                "alignWithLabel": false
            },
            "splitLine": {
                "lineStyle": {
                    "color": "rgba(255,255,255,0.3)",
                    "width": 1,
                    "type": "dashed"
                },
                "show": true,
                "interval": 0
            },
            "scale": false,
            "position": "left",
            "boundaryGap": true
        }],
        "xAxis": [{
            "axisLabel": {
                "formatter": "{}",
                "rotate": 0,
                "verticalAlign": "top",
                "margin": 10,
                "color": "rgba(255,255,255,1)",
                "show": true,
                "rich": "{}",
                "interval": 0,
                "fontSize": "1.2vh",
                "inside": false,
                "align": "center"
            },
            "inverse": false,
            "dataZoomStyle": {
                "areaStyle": {
                    "color": ["#0ff"],
                    "linearColor": [{
                        "start": "red",
                        "end": "blue"
                    }],
                    "colorType": 1
                },
                "lineStyle": {
                    "color": ["#0ff"],
                    "linearColor": [{
                        "start": "red",
                        "end": "blue"
                    }],
                    "colorType": 1
                },
                "handleStyle": {
                    "color": ["#fff"],
                    "linearColor": [{
                        "start": "red",
                        "end": "blue"
                    }],
                    "colorType": 1
                }
            },
            "gridIndex": 0,
            "axisLine": {
                "lineStyle": {
                    "color": "rgba(255,255,255,0.6)",
                    "width": 1,
                    "type": "solid"
                },
                "show": true
            },
            "show": true,
            "axisTick": {
                "lineStyle": {
                    "color": "#333",
                    "width": 1,
                    "type": "solid"
                },
                "show": false,
                "length": 5,
                "interval": 0,
                "inside": false,
                "alignWithLabel": false
            },
            "splitLine": {
                "lineStyle": {
                    "color": "rgba(255,255,255,1)",
                    "width": 1,
                    "type": "solid"
                },
                "show": false,
                "interval": 0
            },
            "scale": false,
            "position": "bottom",
            "boundaryGap": true
        }],
        "grid": [{
            "top": "10",
            "left": "0",
            "bottom": "10",
            "width": "auto",
            "right": "0",
            "containLabel": true,
            "height": "auto"
        }],
        "legend": {
            "padding": 0,
            "itemGap": "10",
            "orient": "horizontal",
            "bottom": "auto",
            "itemHeight": "1.2vh",
            "show": true,
            "icon": "rect",
            "right": "0",
            "align": "auto",
            "top": "auto",
            "left": "auto",
            "width": "auto",
            "itemWidth": "1.2vh",
            "textStyle": {
                "color": "rgba(255,255,255,1)",
                "fontSize": "1.2vh",
                "lineHeight": "1.2vh"
            },
            "height": "auto"
        },
        "series": [{
            "barWidth": "20%",
            "barMaxWidth": "100%",
            "color": ["#0ff"],
            "barMinWidth": "1%",
            "barGap": "0%",
            "xAxisIndex": 0,
            "itemStyle": {
                "borderType": "solid",
                "borderColor": "rgba(0,0,0,0)",
                "borderWidth": 0,
                "barBorderRadius": "0"
            },
            "label": {
                "rotate": 0,
                "verticalAlign": "middle",
                "color": "#fff",
                "positionType": "inside",
                "distance": "5",
                "show": false,
                "fontSize": "12",
                "position": "",
                "align": "center"
            },
            "type": "bar",
            "linearColor": [{
                "start": "rgba(250,253,105,1)",
                "end": "rgba(255,161,23,1)"
            }, {
                "start": "rgba(0,254,209,1)",
                "end": "rgba(0,255,2,1)"
            }],
            "yAxisIndex": 0,
            "colorType": 2
        }],
        "orientations": 1,
        "multiple": 1.2,
        "bartType": 1
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '{"ids":["330102001000","330102003000","330102004000","330102008000","330102009000","330102010000"],"legends":["成本","总收入"],"series":[[4,1,0,1,2,0],[2,4,0,1,1,0]],"title":"","xAxis":["xx街道","xx街道","xx街道","xx街道","xx街道","xx街道"]}'
    },
};
export default defaultData;