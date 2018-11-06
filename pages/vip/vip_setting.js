layui.extend({
    request: '{/}../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});

var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id', align: 'center', title: 'ID'},
    {field: 'vip_name', align: 'center', title: '会员名'},
    {field: 'vip_weight', align: 'center', title: '权重'}
    , {field: 'hotel_discount', align: 'center', title: '会员折扣'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
layui.use(['layer', 'jquery', 'request', 'form','table','laydate', 'laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table=layui.table;
    var laydate = layui.laydate;
    var laypage = layui.laypage

    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    form.on('submit(sreach)', function (data) {
        Config.page=1;
        getVipSettingList();
        return false;
    });
     function getVipSettingList() {
        requset.doGet("/admin/vip_settings/", {
            page: Config.page,
            page_size: Config.pageSize,
            search:$("#search").val()
        }, function (data) {
            //第一个实例
            Config.count=data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#list'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();


        });
    }

    table.on('tool(list)', function(obj){
        var data = obj.data;
        if(obj.event === 'edit'){
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情","./vip_settingAdd.html?op=edit&id="+data.id);
        }
    });
    $(function () {
        getVipSettingList();
        $('#add').click(function () {
            WeAdminShow("添加","./vip_settingAdd.html?");
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
                    getVipSettingList();
                }
            }
        });
    }
})
