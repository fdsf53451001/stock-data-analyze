var page_type = 'TWStockPrice'

let tw_stock_list = []

function update_TWStockList(){
    $.ajax({
        type: "GET",
        url: "http://localhost:5000/api?type=TWStockList",
        dataType: "json",
        success: function (response) {
            tw_stock_list = response;
            update_stock_menu()
        },
        error: function (thrownError) {
            console.log(thrownError);
            alert(thrownError);
        }
    });
}

function update_stock_menu(){
    for (let i = 0; i < tw_stock_list.length; i++) {
        let show_name = tw_stock_list[i]['code'] + ' ' + tw_stock_list[i]['name']
        $('#stock-menu').append('<li><a class="dropdown-item" href="#" onclick="update_chart_name(0,\''+tw_stock_list[i]['id']+'\')">'+show_name+'</a></li>')
    }
}

update_TWStockList()

chart_info['Chart-0'] = {'name':'2330.TW','period':'1w','density':'1d'}
update_chart_name(0,'2330.TW')
// update_chart('Chart-0',page_type,chart_info['Chart-0']['name'],'1w','1d')