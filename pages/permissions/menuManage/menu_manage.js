layui.extend({
    request: '{/}../../../static/js/network/request',
    treeGird: '{/}../../../lib/layui/lay/treeGird' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var tree_node = {
    id: "",
    name: "",
    children: ""
}

//自定义的render渲染输出多列表格
var layout = [{
    name: '菜单名称',
    treeNodes: true,
    headerClass: 'value_col',
    colClass: 'value_col',
    style: 'width: 60%'
},
    {
        name: '状态',
        filed: 'status',
        headerClass: 'td-status',
        colClass: 'td-status',
        style: 'width: 10%',
        render: function (row) {
            if (0 == row.status) {
                return '<span class="layui-btn layui-btn-normal layui-btn-xs layui-btn-disabled">已停用</span>';
            } else {
                return '<span class="layui-btn layui-btn-normal layui-btn-xs">已启用</span>';
            }
        }
    },
    {
        name: '操作',
        headerClass: 'td-manage',
        colClass: 'td-manage',
        style: 'width: 20%',
        render: function (row) {
            return '<a onclick="menu_stop(this,'+row.id+')" href="javascript:;" title="启用"><i class="layui-icon">&#xe601;</i></a>' +
                '<a title="添加" onclick="WeAdminShow(\'添加\',\'./MenuAdd.html\')" href="javascript:;"><i class="layui-icon">&#xe654;</i></a>' +
                '<a title="编辑" onclick="WeAdminShow(\'编辑\',\'./MenuEdit.html\')" href="javascript:;"><i class="layui-icon">&#xe642;</i></a>' +
                '<a title="删除" onclick="del(' + row.id + ')" href="javascript:;">\<i class="layui-icon">&#xe640;</i></a>';
            //return '<a class="layui-btn layui-btn-danger layui-btn-mini" onclick="del(' + row.id + ')"><i class="layui-icon">&#xe640;</i> 删除</a>'; //列渲染
        }
    },
];

layui.use(['treeGird', 'jquery', 'request', 'layer'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;


    var treeGird = layui.treeGird;
    var request = layui.request;
    $(function () {
        request.doGet("MenuOperation/getAllMenuList", {username: layui.data("user").user.username}, function (data) {
            var nodes = new Array();

            for (var i = 0; i < data.length; i++) {

                if (data[i].pareMenuId == 0 && data[i].levelnum == 1) {
                    var list2 = new Array();
                    var menuOne = new Object();
                    menuOne.id = data[i].menuId;
                    menuOne.name = data[i].menuName;
                    menuOne.status = data[i].status;
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].pareMenuId == data[i].menuId && data[j].levelnum == 2) {
                            var list3 = new Array();
                            var menuTwo = new Object();
                            menuTwo.id = data[j].menuId;
                            menuTwo.name = data[j].menuName;
                            menuTwo.status = data[j].status;
                            for (var k = 0; k < data.length; k++) {
                                if (data[k].pareMenuId == data[j].menuId && data[k].levelnum == 3) {
                                    var menuThree = new Object();
                                    menuThree.id = data[k].menuId;
                                    menuThree.name = data[k].menuName;
                                    menuThree.status = data[k].status;
                                    list3.push(menuThree);
                                }
                            }
                            menuTwo.children = list3;
                            list2.push(menuTwo);
                        }

                    }
                    menuOne.children = list2;
                    nodes.push(menuOne);
                }

            }
            var tree1 = layui.treeGird({
                elem: '#menuTable', //传入元素选择器
                spreadable: true, //设置是否全展开，默认不展开
                nodes: nodes,
                layout: layout
            });
            $('#collapse').on('click', function () {
                layui.collapse(tree1);
            });

            $('#expand').on('click', function () {
                layui.expand(tree1);
            });
        });


    });

});

/*分类-停用*/
function menu_stop(obj, id) {
    var $ = layui.jquery;
    var confirmTip;
    if ($(obj).attr('title') == '启用') {
        confirmTip = '确认要停用吗？';
    } else {
        confirmTip = '确认要启用吗？';
    }
    layer.confirm(confirmTip, function (index) {
        if ($(obj).attr('title') == '启用') {
            //发异步把用户状态进行更改
            $(obj).attr('title', '停用')
            $(obj).find('i').html('&#xe62f;');
            $(obj).parents("tr").find(".td-status").find('span').addClass('layui-btn-disabled').html('已停用');
            layer.msg('已停用!', {
                icon: 5,
                time: 1000
            });
        } else {
            $(obj).attr('title', '启用')
            $(obj).find('i').html('&#xe601;');

            $(obj).parents("tr").find(".td-status").find('span').removeClass('layui-btn-disabled').html('已启用');
            layer.msg('已启用!', {
                icon: 6,
                time: 1000
            });
        }
    });
}

function del(nodeId) {
  var $= layui.jquery;
  alert(nodeId);
}