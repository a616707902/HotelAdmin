layui.extend({
    request: '{/}../../static/js/network/request',
});

layui.use(['layer', 'request', 'jquery', 'form', 'table', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

    });


    form.on('radio(order_status)', function (data) {
        if (data.value == 61) {//拒绝退款
            $('#span_rufund').addClass("layui-hide");
            $('#fail_reason_div').removeClass("layui-hide");

        } else {//同意退款
            $('#span_rufund').removeClass("layui-hide");
            $('#fail_reason_div').addClass("layui-hide");
        }
        return false;
    });
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        var id = request.getQueryString("id");
        if (data.field.order_status==48){

            if(data.field.refunded_name==undefined||data.field.refunded_name==''){
                layer.msg("收货人未填写",{icon:5});
                return false;
            }
            if(data.field.refunded_phone==undefined||data.field.refunded_phone==''){
                layer.msg("联系电话未填写",{icon:5});
                return false;
            }
            if(!isPoneAvailable(data.field.refunded_phone)){
                layer.msg("请输入正确的电话号码",{icon:5});
                return false;
            }
            if(data.field.refunded_address==undefined||data.field.refunded_address==''){
                layer.msg("退货地址未填写",{icon:5});
                return false;
            }
            data.field.fail_reason="";
        }
        request.doPost("/admin/market_refunded/" + id + "/deal_apply/", {
            order_status: data.field.order_status,
            fail_reason: data.field.fail_reason,
            admin_refunded_info: {
                refunded_address: data.field.refunded_address,
                refunded_name: data.field.refunded_name,
                refunded_phone: data.field.refunded_phone,
                remark: data.field.remark
            }
        }, function (data) {
          var index2=  layer.alert("提交成功", {
                icon: 6
            }, function () {
              layer.close(index2);
                parent.reflush();
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            });
        });


        return false;
    });
    $("#close").click(function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
        return false;
    });
    function isPoneAvailable(str) {
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(str)) {
            return false;
        } else {
            return true;
        }
    }

})