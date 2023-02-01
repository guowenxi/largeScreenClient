const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "45%",
        "height": "30%",
    },
    "moduleName": "echarts_wave_chart",
    "delayTime": 1000,
    "style": {
        "waveAnimation": true,
        "borderDistance": 8,
        "borderWidth": 8,
        "backgroundColor": "#E3F7FF",
        "showLabel": true,
        "labelFontSize": 50,
        "labelColor": "#294D99",
        "labelPosition": [],
        "radius": "50%",
        "monochromeColors": ["#87ceeb"],
        "gradientColors": [[{
            offset: 0, color: 'red' // 0% 处的颜色
        }, {
            offset: 1, color: 'blue' // 100% 处的颜色
        }]],
        "colorType": "monochrome",
        "gradientDirection": "transverse",
    },
    "dataSources": {
        "interact": [],
        "dataType": 2,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": JSON.stringify([0.3, 0.4, 0.5, 0.6])
    },
};
export default defaultData;