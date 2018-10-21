layui.extend({
    request: '{/}../../../static/js/network/request',
});
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var upload = layui.upload;
    var uploadData = null;
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        uploadData = data;
        if (getJsonLength(Instfiles) > 0) {
            uploadInst.upload();
        } else {
            loadData();
        }
        return false;
    });

    function loadData() {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        if ("edit" == op) {
            editBanner(uploadData, id);
        } else {
            addBanner(uploadData);
        }
    }

    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        if ("edit" == op) {
            getBannerDetail(id);
        }

    });

    var Instfiles;
    var uploadInst = upload.render({
        elem: '#test2'
        , url: 'http://api.gaoshiwang.cn/admin/image/'
        , field: 'image'
        , multiple: true
        , headers: {"Authorization": layui.data('token').token}
        , auto: false
        // ,bindAction: '#add'
        , choose: function (obj) {
            //预读本地文件示例，不支持ie8
            Instfiles = obj.pushFile()
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            //上传完毕
            console.log(res);
            $('#banner_images').val(res.image);
            loadData();
        }
        , error: function (res) {
            layer.msg(res, {icon: 5});
            var demoText = $('#demoText');
            demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });

    function addBanner(data) {
        request.doPost("/admin/banner/", {
            jump_url:data.field.jump_url,
            is_show: data.field.is_show==1?true:false,
            banner_title: data.field.banner_title,
            banner_images: $("#banner_images").val()
        }, function (data) {
            layer.alert("增加成功", {
                icon: 6
            }, function () {
                parent.reflush();
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            });
        });
    }

    function editBanner(data, id) {
        request.doPut("/admin/banner/" + id + "/", {
            jump_url:data.field.jump_url,
            is_show: data.field.is_show==1?true:false,
            banner_title: data.field.banner_title,
            banner_images: $("#banner_images").val()
        }, function (data) {
            layer.alert("修改成功", {
                icon: 6
            }, function () {
                parent.reflush();
                // 获得frame索引
                var index = parent.layer.getFrameIndex(window.name);
                //关闭当前frame
                parent.layer.close(index);
            });
        });
    }


    function getBannerDetail(id) {
        request.doGet("/admin/banner/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            $("input[name=is_active]").each(function () {
                if ($(this).val() == response.is_active) {
                    $(this).attr('checked', true);
                }
            });
            var images = response.banner_images;
            $('#demo1').attr('src', images); //图片链接（base64）
            form.render();
        });
    }

    function getJsonLength(jsonData) {

        var jsonLength = 0;

        for (var item in jsonData) {

            jsonLength++;

        }
        return jsonLength;
    }

});