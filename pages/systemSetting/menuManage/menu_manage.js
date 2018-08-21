layui.extend({
    request: '{/}../../../static/js/network/request',
    treeGird: '{/}../../../lib/layui/lay/treeGird' // {/}的意思即代表采用自有路径，即不跟随 base 路径
});
var tree_node = {
    id: "",
    name: "",
    children: ""
}
var MenuData = new Array();
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
            var jsonData=JSON.stringify(row);
            if (row.levelnum == 3) {
                //3级菜单不予许有子菜单

                return  "<a onclick='menu_stop(this," + row.id + ")' href='javascript:;' title='启用'><i class='layui-icon'>&#xe601;</i></a>" +
                    // "<a title='添加' onclick='WeAdminShow(\"添加\",\"./MenuAdd.html\","+ jsonData+")' href='javascript:;'><i class='layui-icon'>&#xe654;</i></a>" +
                    "<a title='编辑' onclick='WeAdminEdit(\"编辑\",\"./MenuEdit.html\","+ jsonData+")' href='javascript:;'><i class='layui-icon'>&#xe642;</i></a>";
                //  这里都不能删除
            } else {

                return "<a onclick='menu_stop(this," + row.id + ")' href='javascript:;' title='启用'><i class='layui-icon'>&#xe601;</i></a>" +
                    "<a title='添加' onclick='WeAdminShow(\"添加\",\"./MenuAdd.html\","+ jsonData+")' href='javascript:;'><i class='layui-icon'>&#xe654;</i></a>" +
                    "<a title='编辑' onclick='WeAdminEdit(\"编辑\",\"./MenuEdit.html\","+ jsonData+")' href='javascript:;'><i class='layui-icon'>&#xe642;</i></a>";

            } //  这里都不能删除
            // '<a title="删除" onclick="del(' + row.id + ')" href="javascript:;">\<i class="layui-icon">&#xe640;</i></a>';
            //return '<a class="layui-btn layui-btn-danger layui-btn-mini" onclick="del(' + row.id + ')"><i class="layui-icon">&#xe640;</i> 删除</a>'; //列渲染
        }
    },
];

layui.use(['treeGird', 'jquery', 'request', 'layer','form'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
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
                    menuOne.levelnum = data[i].levelnum;
                    menuOne.menuUrl=data[i].menuUrl;
                    menuOne.menuSort=data[i].menuSort;
                    menuOne.menuIcon=data[i].menuIcon;
                    menuOne.pid=data[i].pareMenuId;
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].pareMenuId == data[i].menuId && data[j].levelnum == 2) {
                            var list3 = new Array();
                            var menuTwo = new Object();
                            menuTwo.id = data[j].menuId;
                            menuTwo.name = data[j].menuName;
                            menuTwo.status = data[j].status;
                            menuTwo.levelnum = data[j].levelnum;
                            menuTwo.menuUrl=data[j].menuUrl;
                            menuTwo.menuIcon=data[j].menuIcon;
                            menuTwo.menuSort=data[j].menuSort;
                            menuTwo.pid=data[j].pareMenuId;
                            for (var k = 0; k < data.length; k++) {
                                if (data[k].pareMenuId == data[j].menuId && data[k].levelnum == 3) {
                                    var menuThree = new Object();
                                    menuThree.id = data[k].menuId;
                                    menuThree.name = data[k].menuName;
                                    menuThree.status = data[k].status;
                                    menuThree.levelnum = data[k].levelnum;
                                    menuThree.menuUrl=data[k].menuUrl;
                                    menuThree.menuIcon=data[k].menuIcon;
                                    menuThree.menuSort=data[k].menuSort;
                                    menuThree.pid=data[k].pareMenuId;
                                    list3.push(menuThree);
                                }
                            }
                            menuTwo.children = list3;
                            list2.push(menuTwo);
                        }

                    }
                    menuOne.children = list2;
                    nodes.push(menuOne);
                    MenuData = nodes;
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
    /*分类-停用*/
    window.menu_stop = function (obj, id) {
        var confirmTip;
        if ($(obj).attr('title') == '启用') {
            confirmTip = '确认要停用吗？';
        } else {
            confirmTip = '确认要启用吗？';
        }
        layer.confirm(confirmTip, function (index) {
            if ($(obj).attr('title') == '启用') {
                //发异步把用户状态进行更改
                request.doPost("MenuOperation/changeMenuStatus", {
                    menuId: id,
                    status: 0
                }, function (data) {
                    $(obj).attr('title', '停用')
                    $(obj).find('i').html('&#xe62f;');
                    $(obj).parents("tr").find(".td-status").find('span').addClass('layui-btn-disabled').html('已停用');
                    layer.msg('已停用!', {
                        icon: 5,
                        time: 1000
                    });
                });

            } else {
                request.doPost("MenuOperation/changeMenuStatus", {
                    menuId: id,
                    status: 1
                }, function (data) {
                    $(obj).attr('title', '启用')
                    $(obj).find('i').html('&#xe601;');

                    $(obj).parents("tr").find(".td-status").find('span').removeClass('layui-btn-disabled').html('已启用');
                    layer.msg('已启用!', {
                        icon: 6,
                        time: 1000
                    });
                });

            }
        });
    }
    window.reflush = function () {
        window.parent.location.reload(); //刷新父页面
        location.replace(location.href);
    }
    window.del = function (nodeId) {
        alert(nodeId);
    }
    window.WeAdminShow = function (title, url, data, w, h) {
        if (data == null || data == undefined) {
            data = MenuData;
        } else {
            var menu = new Object();
            menu.id = data.id;
            menu.levelnum = data.levelnum;
            menu.name = data.name;
            menu.status = data.status;
            var list=new Array();
            list.push(menu);
            data =list;
        }
        if (title == null || title == '') {
            title = false;
        }
        ;
        if (url == null || url == '') {
            url = "/HotelAdmin/pages/404.html";
        }
        ;
        if (w == null || w == '') {
            w = ($(window).width() * 0.9);
        }
        ;
        if (h == null || h == '') {
            h = ($(window).height() - 50);
        }
        ;
        layer.open({
            type: 2,
            area: [w + 'px', h + 'px'],
            fix: false, //不固定
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            title: title,
            content: url,
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);

                if (data) {
                    var selectHtml = '';
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].levelnum != 3 && data[i].status != 0) {
                            // <option value="0" data-level="0">顶级分类</option>
                            selectHtml += "<option value=\"" + data[i].id + "\" data-level=\"" + data[i].levelnum + "\">" + data[i].name + "</option>"
                        }
                        if (data[i].children!=null&&data[i].children.length>0){
                            var children= data[i].children;
                            for (var j=0;j<children.length;j++){

                                selectHtml += "<option value=\"" + children[j].id + "\" data-level=\"" +children[j].levelnum + "\">" + children[j].name + "</option>"

                            }

                        }
                    }
                    body.find("#pid-select").html(selectHtml);
                    layui.form.render('select'); //刷新select选择框渲染

                }
            }
        });
    }
    window.WeAdminEdit = function (title, url, data, w, h) {


        if (title == null || title == '') {
            title = false;
        }
        ;
        if (url == null || url == '') {
            url = "/HotelAdmin/pages/404.html";
        }
        ;
        if (w == null || w == '') {
            w = ($(window).width() * 0.9);
        }
        ;
        if (h == null || h == '') {
            h = ($(window).height() - 50);
        }
        ;
        layer.open({
            type: 2,
            area: [w + 'px', h + 'px'],
            fix: false, //不固定
            maxmin: true,
            shadeClose: true,
            shade: 0.4,
            title: title,
            content: url,
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);

                if (MenuData) {
                    var selectHtml = ' <option value="0" data-level="0">顶级菜单</option>';
                    for (var i = 0; i < MenuData.length; i++) {
                        if (MenuData[i].levelnum != 3 && MenuData[i].status != 0) {
                            // <option value="0" data-level="0">顶级分类</option>
                            selectHtml += "<option value=\"" + MenuData[i].id + "\" data-level=\"" + MenuData[i].levelnum + "\">" + MenuData[i].name + "</option>"
                        }
                        if (MenuData[i].children!=null&&MenuData[i].children.length>0){
                            var children= MenuData[i].children;
                            for (var j=0;j<children.length;j++){

                                selectHtml += "<option value=\"" + children[j].id + "\" data-level=\"" +children[j].levelnum + "\">" + children[j].name + "</option>"

                            }

                        }
                    }
                    body.find("#pid-select").html(selectHtml);
                    layui.form.render('select'); //刷新select选择框渲染
                    body.find("#pid-select").val(data.pid);
                    body.find("#menuName").val(data.name);
                    body.find("#menuIcon").val(data.menuIcon);
                    body.find("#menuUrl").val(data.menuUrl);
                    body.find("#menuSort").val(data.menuSort);
                    body.find("#menuid").val(data.id);

                    if (data.status == 1) {
                        $("#radio1").attr("checked", "checked");
                        $("#radio2").removeAttr("checked");
                    } else {
                        //  $('input:radio:checked').val()；
                        $("#radio2").attr("checked", "checked");
                        $("#radio1").removeAttr("checked");
                    }

                }
            }
        });
    }
});

