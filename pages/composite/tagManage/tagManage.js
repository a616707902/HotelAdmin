layui.extend({
    request: '{/}../../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id', align: 'center', title: 'ID'}
    , {field: 'name', align: 'center', title: '标签名字'}
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
    var request = layui.request;
    var table = layui.table;
    var laypage = layui.laypage
    form.on('submit(sreach)', function (data) {
        Config.page=1;
        getAllTag(data.field.search);
        return false;
    });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        // location.replace(location.href);
        getAllTag($("#tagsname").val())
    }
    table.render({
        elem: '#roomlist'
        , page: true //开启分页
        , cols: TableHeader
        , data: []
    });
    window.getAllTag = function (search) {
        request.doGet("/admin/tags/", {
            page: Config.page,
            page_size: Config.pageSize,
            search: search
        }, function (data) {
            //第一个实例
            Config.count = data.count;
            $("#total").html(data.count);
            table.render({
                elem: '#goodslist'
                , limit: Config.pageSize//显示的数量
                , page: false //开启分页
                , cols: TableHeader
                , data: data.results
            });
            Rflaypage();

        });
    }
    table.on('tool(goodslist)', function (obj) {
        var data = obj.data;
         if (obj.event === 'del') {
            // layer.confirm('真的删除行么', function(index){
            //     obj.del();
            //     layer.close(index);
            // });
        } else if (obj.event === 'edit') {
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑", "./tagAdd.html?op=edit&id=" + data.id,400,200);
        }
    });
    $(function () {
        getAllTag($("#tagsname").val())
        $('#add').click(function () {
            WeAdminShow("添加", "./tagAdd.html?",400,200);
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
                    getOrderList();
                }
            }
        });
    }

});