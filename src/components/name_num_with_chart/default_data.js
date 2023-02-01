const defaultData = {
    "position": {
        "left": "1%",
        "top": "2%",
        "width": "90%",
        "height": "15%"
    },
    "moduleName": "name_num_with_chart",
    "delayTime": 0,
    "style": {
        "titleText": "全部企业",
        "unit": ["个"],
        "icon": [],
        "iconSize": "2vh",
        "columnNum": 3,
        "columnGap": 0,
        "fontColor": "#00ffff",
        "fontSize": "2vh",
        "legend": {
            styleType: 1,
            show: false,
            left: 'auto',
            top: '0',
            right: '0',
            bottom: 'auto',
            width: '20%',
            height: '100%',
            flexDirection: 'row',
            align: 'row',
            verticalAlign: 'center',
            padding: 0,
            columnNum: 1,
            itemWidth: '25',
            itemHeight: '14',
            distance: '8',
            textStyle: {
                color: '#333',
                fontSize: '12'
            }
        },
        "series": [{
            type: 'pie',
            clockwise: true,
            startAngle: 0,
            minShowLabelAngle: 0,
            roseType: false,
            avoidLabelOverlap: true,
            centerX: '50%',
            centerY: '50%',
            radiusIn: '50%',
            radiusOut: '80%',
            color: ['#8e5ff5', '#00b2f9', '#3fe497', '#fdd974', '#eb8c54', '#fd2770'],
            labelLine: {
                show: false,
                length: '20',
                length2: '20',
                smooth: 0,
                lineStyle: {
                    color: '#0ff',
                    width: '2',
                    type: 'solid'
                }
            },
            label: {
                show: false,
                color: '#fff',
                position: 'outside',
                distance: '5',
                rotate: 0,
                fontSize: '12',
                align: 'center',
                verticalAlign: 'middle'
            },
            itemStyle: {
                borderWidth: 0,
            }
        }]
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '{"ids":null,"legends":null,"series":[4,3,2,2,3,4],"title":"","xAxis":["蒲州所","永兴所","永中所","海滨所","状元所","瑶溪所"]}'
    },
};
export default defaultData;