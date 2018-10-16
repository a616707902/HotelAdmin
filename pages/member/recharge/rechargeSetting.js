layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
// //"id": 1,
// "free_balance": "300.00",
//     "recharge_price": "30.00",
//     "create_time": "2018-10-07T21:28:09.489848",
//     "update_time": "2018-10-07T21:28:09.489889",
//     "is_active": true,
//     "operator_name": 1
var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id', align: 'center', title: 'ID'}
    , {field: 'recharge_price', align: 'center', title: '充值金额'}
    , {field: 'free_balance', align: 'center', title: '奖励金'}
    , {field: 'is_active', align: 'center', title: '状态', templet: '#switchTpl', unresize: true}
    , {field: 'create_time', align: 'center', title: '创建时间'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
layui.use(['layer', 'jquery', 'request', 'form', 'table','laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table = layui.table;
    var laypage = layui.laypage
    form.on('submit(search)', function (data) {
        getAllReschargeSeting();
    });
    //监听性别操作
    form.on('switch(is_active)', function (obj) {
        layer.tips(this.value + ' ' + this.name + '：' + obj.elem.checked, obj.othis);
    });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    table.render({
        elem: '#settingList'
        , page: true //开启分页
        , cols: TableHeader
        , data: []
    });
    window.getAllReschargeSeting = function (search) {
        requset.doGet("/admin/recharge_settings/", {
            page: Config.page,
            page_size: Config.pageSize,
            search: search
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#settingList'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();

        });
    }
    table.on('tool(settingList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情", "./rechargeSettingAdd.html?op=detail&id=" + data.id);
        } else if (obj.event === 'del') {
        } else if (obj.event === 'edit') {
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑", "./rechargeSettingAdd.html?op=edit&id=" + data.id);
        }
    });
    $(function () {
        getAllReschargeSeting();
        $('#add').click(function () {
            WeAdminShow("添加", "./rechargeSettingAdd.html?op=add");
        });
    });
    function Rflaypage() {
        laypage.render({
            elem: 'page'
            , count: Config.count
            , limit: Config.pageSize
            , curr: Config.page
            , layout: ['prev', 'page', 'next', 'limit']
            , jump: function (obj, first) {
                Config.pageSize = obj.limit
                Config.page = obj.curr;
                if (!first) {
                    getAllReschargeSeting();
                }
            }
        });
    }


})