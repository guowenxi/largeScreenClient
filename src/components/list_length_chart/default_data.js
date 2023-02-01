const defaultData = {
    position: {
        left: "1%",
        top: "7%",
        width: "35%",
        height: "25%",
    },
    moduleName: "list_length_chart",
    delayTime: 0,
    style: {
        leftLabel: {
            fontColor: '#fff',
            selectedFontColor: '#fff',
        },
        rightLabel: {
            fontColor: '#FFF',
            selectedFontColor: '#fff',
            fontWeight: 400,
        },
        bgColorType: 1,
        backgroundColor1: 'rgb(4, 152, 220)',
        backgroundColor2: [{color: 'rgb(12, 66, 97)', stop: 0}, {color: 'rgb(3, 161, 231)', stop: 100}],
        gradientType: 1,
        gradientDeg: 0,
    },
    dataSources: {
        interact: [],
        dataType: 1,
        dataUrl: "",
        dataParams: "",
        defaultData: JSON.stringify([{
            name: '2020', num: '100',
        }, {
            name: '2020', num: '200',
        }, {
            name: '2020', num: '300',
        }, {
            name: '2020', num: '400',
        }])
    },
};
export default defaultData;