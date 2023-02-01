// var data_ = [{ name: '企退人员', sum: 369 }, { name: '党员', sum: 509 }]
const defaultData = {
    "position": {
        "left": "5%",
        "top": "10%",
        "width": "45%",
        "height": "30%",
    },
    "moduleName": "high_charts_ring_pie",
    "delayTime": 1000,
    "style": {
        colors: [
            {
                angle: 0,
                colorList: [
                    { color: 'yellow', percent: 100 },
                ],
            },
            {
                angle: 0,
                colorList: [
                    { color: 'black', percent: 100 },
                ],
            },
            {
                angle: 0,
                colorList: [
                    { color: 'blue', percent: 100 },
                ],
            }
        ],
        series_data: [{ name: '企退人员', sum: 1369 }, { name: '党员111', sum: 100 }, { name: '党员', sum: 509 }],
        // backgroundColor: 'rgba(0, 0, 0, 0.1)',
        // shadowColor: 'rgba(0, 0, 0, 0.2)',
        // shadowLeft: '0.5vh',
        // shadowTop: '0.5vh',
        fontSize: '30px',
        fontColor: '#d6d9dc',
        fontSize2: '20px',
        fontColor2: '#576575',
        color_0: ["#43a2f6", "#2afadf"],
        color_1: ["#009af4", "#009cf4"],
        color_2: ["#009af4", "#009cf4"],

        credits: {
            enabled: false,
        },
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            },
            events: {
                // load: function () {
                //     var each = Highcharts.each,
                //         points = this.series[0].points;
                //     each(points, function (p, i) {
                //         p.graphic.attr({
                //             translateY: -p.shapeArgs.ran
                //         });
                //         p.graphic.side1.attr({
                //             translateY: -p.shapeArgs.ran
                //         });
                //         p.graphic.side2.attr({
                //             translateY: -p.shapeArgs.ran
                //         });
                //     });
                // }
            },
        },
        title: {
            text: '',
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
            pie: {
                innerSize: 150,
                depth: 50,
                dataLabels: {
                    color: 'red'
                }
            },
        },
        tooltip: {
            enabled: false,
            style: { color: 'black' },
            // headerFormat: '<span style="font-size: 20px">22</span><br/>'
        },
        series: [{
            type: 'pie',
            name: '人',
            // slicedOffset:10,
            data: [
                {
                    name: 'data_[0].name',
                    y: 1,
                    // h: 50,
                    // h: data_[0].sum === data_[1].sum ? 50 : data_[0].sum > data_[1].sum ? 50 : 40,
                    sliced: true,
                    selected: false,
                    // color: "#2afadf",
                    dataLabels: {
                        // color: 'blue',
                        style: { fontSize: '30px' },
                        formatter: function () {
                            return (
                                '<p style="color:#d6d9dc;font-size:30px">' +
                                1 +
                                '<span style="color:#d6d9dc;font-size:20px">人</span>' +
                                '</p><br><p style="color:#576575;font-size:20px">' +
                                'data_[0].name' +
                                '</p>'
                            );
                        }
                    },
                },
                {
                    name: 'data_[1].name',
                    y: 2,
                    // h: 50,
                    // h: data_[0].sum === data_[1].sum ? 50 : data_[0].sum > data_[1].sum ? 40 : 50,
                    sliced: true,
                    selected: false,
                    // color: "#0098f4",
                    dataLabels: {
                        // color: 'blue',
                        style: { fontSize: '30px' },
                        formatter: function () {
                            return (
                                '<p style="color:#d6d9dc;font-size:30px">' +
                                2 +
                                '<span style="color:#d6d9dc;font-size:20px">人</span>' +
                                '</p><br><p style="color:#576575;font-size:20px">' +
                                'data_[1].name' +
                                '</p>'
                            )
                        }
                    },
                },
            ]
        },]
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '{"ids":["330102009000"],"legends":null,"series":[509,300,200],"title":"","xAxis":["清波街道","党员","企退人员"]}',
    },
};
export default defaultData;