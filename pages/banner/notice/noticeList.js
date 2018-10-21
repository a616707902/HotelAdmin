layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    // {field: 'id', align: 'center', title: 'ID'}
     {field: 'content', align: 'center', title: '公告内容'}
    , {field: 'is_active', align: 'center', title: '状态', templet: '#switchTpl', unresize: true}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
var Config = {
    page: 1,
    pageSize: 10,
    count: 0
}
layui.use(['layer', 'jquery', 'request', 'form', 'table', 'laypage'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var table = layui.table;
    var laypage = layui.laypage
    // form.on('submit(sreach)', function (data) {
    //     getAllNotice(data.field.search);
    //     return false;
    // });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
     function getAllNotice(search) {
        request.doGet("/admin/notice/", {
            page: Config.page,
            page_size: Config.pageSize,
            search: search
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
        if (obj.event === 'del') {
            var id = data.id
        var index=    layer.confirm('确定删除当前公告？', {
                btn: ['删除','取消'] //按钮
            }, function(){
                request.doDelete("/admin/notice/" + id + "/", {}, function (response) {
                    getAllNotice();
                    layer.close(index);
                });
            }, function(){
                layer.close(index);
            });


        } else if (obj.event === 'edit') {
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑", "./noticeDetail.html?op=edit&id=" + data.id, 600, 400);
        }
    });
    $(function () {
        getAllNotice()
        $('#add').click(function () {
            WeAdminShow("添加", "./noticeDetail.html?", 600, 400);
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
                    getAllNotice();
                }
            }
        });
    }

});