layui.extend({
    request: '{/}../../../static/js/network/request',
    authtree: '{/}../../../lib/layui/lay/authtree'
});
layui.use(['layer', 'request', 'jquery', 'form', 'authtree'], function () {
    var usertable = layui.data('user');
    var user = usertable.user;
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var authtree=layui.authtree;
    var request = layui.request;
    form.render();
    $(function () {

        request.doGet("MenuOperation/getOperationMenuList", {username: user.username}, function (data) {

            var nodes = new Array();

            for (var i = 0; i < data.length; i++) {
//&& data[i].levelnum == 1
                if (data[i].pareMenuId == 0 ) {
                    var list2 = new Array();
                    var menuOne = new Object();
                    menuOne.value = data[i].menuId;
                    menuOne.name = data[i].menuName;
//&& data[j].levelnum == 2
                    for (var j = 0; j < data.length; j++) {
                        if (data[j].pareMenuId == data[i].menuId ) {
                            var list3 = new Array();
                            var menuTwo = new Object();
                            menuTwo.value = data[j].menuId;
                            menuTwo.name = data[j].menuName;
                            for (var k = 0; k < data.length; k++) {
                                //&& data[k].levelnum == 3
                                if (data[k].pareMenuId == data[j].menuId ) {
                                    var menuThree = new Object();
                                    menuThree.value = data[k].menuId;
                                    menuThree.name = data[k].menuName;
                                    list3.push(menuThree);
                                }
                            }
                            menuTwo.list = list3;
                            list2.push(menuTwo);
                        }

                    }
                    menuOne.list = list2;
                    nodes.push(menuOne);
                }

            }
            authtree.render('#LAY-auth-tree-index', nodes, {inputname: 'authids[]', layfilter: 'lay-check-auth', openall: false});

        });

    });
    // 异步提交表单信息
    form.on('submit(add)', function(obj){
        // 注意如果直接通过layui的obj.field可能会出现问题，layuiAdmin请使用admin.req();
        var authids = authtree.getAll('#LAY-auth-tree-index');
        console.log('Choosed authids is', authids);
        request.doPost("addRole",{
            rolename:obj.field.rolename,
            describe:obj.field.describe,
            state:obj.field.state,
            rolemenus:authids
        },function (data) {
            parent.reflush();
            // 获得frame索引
            var index = parent.layer.getFrameIndex(window.name);
            //关闭当前frame
            parent.layer.close(index);
        });
        return false;
    });
});