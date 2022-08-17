var chart_object = {}
var data_format = undefined

var data = [
    {"Date": "2020–09–01", "Close": 1523},
    {"Date": "2020–09–01", "Close": 1010},
    {"Date": "2020–09–01", "Close": 1304},
    {"Date": "2020–09–01", "Close": 1106},
    {"Date": "2020–09–01", "Close": 1312},
    {"Date": "2020–09–01", "Close": 1017},
    {"Date": "2020–09–01", "Close": 1066},
];

var chart_info = {}

function update_chart_period(chart_num,period){
    let chart_id = Object.keys(chart_info)[chart_num]
    let default_density = data_format[period]['optional'][data_format[period]['default']]
    // $('.chart-btn-group-0').removeAttr('checked')
    chart_info[chart_id]['period'] = period
    // $('#btn-duration-'+period+'-'+chart_num).attr('checked')
    chart_info[chart_id]['density'] = default_density
    // $('#btn-density-'+default_density+'-'+chart_num).attr('checked')
    // change density here
    console.log(chart_info[chart_id])
    update_chart(chart_num,page_type,chart_info[chart_id]['name'],chart_info[chart_id]['period'],chart_info[chart_id]['density'])

    if(data_format[period]!=undefined){
        let options = data_format[period]['disabled']
        console.log(options)
        for(let i=0;i<options.length;i++){
            $('#btn-d-density-'+options[i]+'-'+chart_num).removeClass('btn-outline-danger')
            $('#btn-d-density-'+options[i]+'-'+chart_num).addClass('btn-outline-secondary')
            $('#btn-d-density-'+options[i]+'-'+chart_num).addClass('disabled')
        }

        options = data_format[period]['optional']
        for(let i=0;i<options.length;i++){
            $('#btn-d-density-'+options[i]+'-'+chart_num).removeClass('btn-outline-secondary')
            $('#btn-d-density-'+options[i]+'-'+chart_num).removeClass('disabled')
            $('#btn-d-density-'+options[i]+'-'+chart_num).addClass('btn-outline-danger')
        }
    }else{
        console.warn('chart period undefined')
    }
}

function update_chart_density(chart_num,density){
    let chart_id = Object.keys(chart_info)[chart_num]
    chart_info[chart_id]['density'] = density
    update_chart(chart_num,page_type,chart_info[chart_id]['name'],chart_info[chart_id]['period'],chart_info[chart_id]['density'])
}

function update_chart_name(chart_num,name){
    let chart_id = Object.keys(chart_info)[chart_num]
    chart_info[chart_id]['name'] = name
    update_chart(chart_num,page_type,chart_info[chart_id]['name'],chart_info[chart_id]['period'],chart_info[chart_id]['density'])
    $('#chart-title-'+chart_num).html(name)
    $('#chart-name-btn-tittle').html(name)
}

function update_ChartDataFormat(){
    $.ajax({
        type: "GET",
        url: backend_url+"api?type=ChartDataFormat",
        dataType: "json",
        success: function (response) {
            data_format = response;
        },
        error: function (thrownError) {
            console.log(thrownError);
            alert(thrownError);
        }
    });
}

function update_chart(chart_num,type,name,period,density){
    let id = Object.keys(chart_info)[chart_num]
    console.log('update chart',id,type,name,period,density)
    $.ajax({
        type: "GET",
        url: backend_url+"api?type="+type+"&name="+name+"&period="+period+"&density="+density,
        dataType: "json",
        success: function (response) {
            data = response;
            draw(id,data)
            if(density=='1d'){
                set_price_trend(chart_num,data)
            }
        },
        error: function (thrownError) {
            console.log(thrownError);
            alert(thrownError);
        }
    });
}

function roundDecimal(val, precision) {
    return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}

function set_price_trend(chart_num,chart_data){
    let close_data = chart_data.map(x=>x.Close)
    if(close_data.length >= 2){
        let change = (close_data[close_data.length-1]-close_data[close_data.length-2])/close_data[close_data.length-2]*100
        change = roundDecimal(change,2)
        if(change>0){
            $('#chart-trend-img-'+chart_num).attr("src","assets/good.png")
        }else{
            $('#chart-trend-img-'+chart_num).attr("src","assets/bad.png")
        }

        $('#chart-trend-'+chart_num).html('昨日漲幅：'+change+'%')

        if(close_data.length >= 7){
            data_7 = close_data.slice(close_data.length-7)
            let sum = 0;
            for (let number of data_7) {
                sum += number;
            }
            average = sum / data_7.length;
            let change = (data_7[data_7.length-1]-average)/average*100
            change = roundDecimal(change,2)
            $('#chart-trend-'+chart_num).append('，現位於本週：'+change+'%')
        }
    }
    
}

function draw(id,chart_data){
    var ctx = document.getElementById(id).getContext('2d');

    if(chart_object[id] !== undefined){
        chart_object[id].destroy()
    }

    var chart = new Chart(ctx, {
        type: 'line',
        data: {
        labels: chart_data.map(x=>x.Date.slice(0,10)),
        datasets: [{
            label: 'close',
            data: chart_data.map(x=>x.Close),
            // Line
            lineTension: 0,                    // 預設為把線段繪製成貝茲曲線，如果只是要用直線連接設為0即可
            backgroundColor: "#FF5376",        // 線段的背景填色
            borderColor: "#FF5376",            // 線段顏色
            fill: false,                       // 不要將線段以下的區域填色
            borderWidth: 2,                    // 減少線段的寬度(預設為3)// Point
            pointRadius: 3,                    // 點的半徑大小
            pointHoverRadius: 7,               // 滑鼠滑到點上面時點的半徑大小
        }]
        },
        options: {
            title:{
                display: false,                 // 顯示標題
                text: 'Traffic Volume',   
                position: 'bottom',            // 在圖表下方顯示
                fontSize: 24,                  // 字體相關的參數           
                fontStyle: 'normal',
                fontFamily: 'Century Gothic'
            },
            legend:{
                display: false                 // 不顯示圖例
            },
            responsive: true
        }
    });
    chart_object[id] = chart;
}

update_ChartDataFormat()
