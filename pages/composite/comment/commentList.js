layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'belong_order_type_display', align: 'center', title: '评论订单类型'},
    {field: 'goods_type', align: 'center', title: '房间类型/商品',templet: '#titleTpl', unresize: true},
    {field: 'content', align: 'center', title: '评论内容'}
    , {field: 'comment_level_display', align: 'center', title: '评分'}
    , {field: 'commenter_name', align: 'center', title: '评论人'}
    , {field: 'create_time', align: 'center', title: '评论时间'}
    // , {field: 'room_nums', align: 'center', title: '房间数'}
    // , {field: 'room_style_name', align: 'center', title: '房间类型'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form', 'table', 'laydate', 'laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table = layui.table;
    var laydate = layui.laydate;
    var laypage = layui.laypage;


    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        // location.replace(location.href);
        getCommentList();
    }
    form.on('submit(sreach)', function (data) {
        Config.page=1;
        getCommentList();
        return false;
    });
    function getCommentList() {
        requset.doGet("/admin/comment_replay/", {
            page: Config.page,
            page_size: Config.pageSize,
            belong_order__order_type: $("#belong_order__order_type").val(),
            comment_show: $("#comment_show").val()
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#lists'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();

        });
    }

    table.on('tool(lists)', function (obj) {
        var data = obj.data;
        if (obj.event === 'edit') {
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情", "./commentDetail.html?op=edit&id=" + data.id);
        }
    });
    $(function () {
        getCommentList();
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
                    getCommentList();
                }
            }
        });
    }

})
