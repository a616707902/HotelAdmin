layui.extend({
    request: '{/}../../static/js/network/request' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var TableHeader = [[ //表头
    // {type:'checkbox',align:'center'},
    {field: 'id', align: 'center', title: 'ID'}
    , {field: 'category_name', align: 'center', title: '商品类型'}
    , {field: 'goods_name', align: 'center', title: '商品名称'}
    , {field: 'is_active', align: 'center', title: '商品状态'}
    , {field: 'goods_price', align: 'center', title: '价格'}
    , {title: '操作', align: 'center', toolbar: '#barDemo'}

]];
layui.use(['layer', 'jquery', 'request', 'form', 'table'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var requset = layui.request;
    var table = layui.table;
    form.on('submit(sreach)', function (data) {
        getAllGoods(data.field.goodsname, data.field.goodsStyle_select);
    });
    window.reflush = function () {
        //  window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    table.render({
        elem: '#roomlist'
        , page: true //开启分页
        , cols: TableHeader
        , data: []
    });
    window.getAllGoods = function (search, name) {
        requset.doGet("/admin/goods/", {
            search: search,
            category: name
        }, function (data) {
            //第一个实例
            $("#total").html(data.count);
            table.render({
                elem: '#goodslist'
                , page: true //开启分页
                , cols: TableHeader
                , data: data.results
            });

        });
    }
    table.on('tool(goodslist)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            // layer.msg('ID：'+ data.id + ' 的查看操作');
            WeAdminShow("详情", "./GoodsAdd.html?op=detail&id=" + data.id);
        } else if (obj.event === 'del') {
            // layer.confirm('真的删除行么', function(index){
            //     obj.del();
            //     layer.close(index);
            // });
        } else if (obj.event === 'edit') {
            // layer.alert('编辑行：<br>'+ JSON.stringify(data))
            WeAdminShow("编辑", "./GoodsAdd.html?op=edit&id=" + data.id);
        }
    });
    $(function () {
        getAllGoods($("#goodsname").val(), $("#goodsStyle_select").val())
        $('#add').click(function () {
            WeAdminShow("添加", "./GoodsAdd.html?");
        });
    });
//删除商品
    window.delAll = function (span) {
        var data = tableCheck.getData();

    }
});