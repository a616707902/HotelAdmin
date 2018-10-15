layui.extend({
    request: '{/}../../static/js/network/request',
});
layui.use(['layer', 'request', 'jquery', 'form', 'upload'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;
    var form = layui.form;
    var request = layui.request;
    var upload = layui.upload;
    var demoListView = $('#layer-photos-demo');
    var uploadData = null;
    form.on('submit(add)', function (data) {
        //发异步，把数据提交给php
        uploadData = data;
        if (getJsonLength(Instfiles) > 0) {
            uploadInst.upload();
        } else if (getJsonLength(files) > 0) {
            uploadListIns.upload();
        } else {
            loadData();
        }

        return false;
    });

    function loadData() {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");

        if ("edit" == op) {
            editGoods(uploadData, id);
        } else {
            addGoods(uploadData);
        }

    }

    form.on('radio(is_integral)', function (data) {
        // console.log(data.elem); //得到radio原始DOM对象
        // console.log(data.value); //被点击的radio的value值
        if (data.value == 0) {
            $('#need_div').addClass("layui-hide");
            $('#price_div').removeClass("layui-hide");

        } else {
            $('#need_div').removeClass("layui-hide");
            $('#price_div').addClass("layui-hide");
        }
        return false;
    });
    form.on('radio(is_special)', function (data) {
        // console.log(data.elem); //得到radio原始DOM对象
        // console.log(data.value); //被点击的radio的value值
        if (data.value == 0) {
            $('#special_div').addClass("layui-hide");
        } else {
            $('#special_div').removeClass("layui-hide");
        }
        return false;
    });
    $(function () {
        var op = request.getQueryString("op");
        var id = request.getQueryString("id");
        getStyleSelect(op, id);

    });

    /**
     * 根据当前的酒店获取房间类型
     * @param hotel
     */
    function getStyleSelect(op, id) {
        var htmlselect = "";
        request.doGet("/admin/goods_category/", {
            page: 1,
            page_size: 100000,
            search: ''
        }, function (data) {
            if (data != null && data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    htmlselect += "<option value=\"" + data.results[i].id + "\">" + data.results[i].category_name + "</option>";
                }
            }
            $('#category').html(htmlselect);
            form.render('select'); //刷新select选择框渲染
            getVipSettingList(op, id)

        });
    }

    function getVipSettingList(op, id) {
        var htmlselect = "";
        request.doGet("/admin/vip_settings/", {
            page: 1,
            page_size: 100000,
            search: ""
        }, function (data) {
            if (data != null && data.results.length > 0) {
                for (var i = 0; i < data.results.length; i++) {
                    htmlselect += "<option value=\"" + data.results[i].id + "\">" + data.results[i].vip_name + "</option>";
                }
            }
            $('#vip_info').html(htmlselect);
            form.render('select'); //刷新select选择框渲染
            if ("edit" == op) {
                getGoodsDetail(id, op);
            }
        });
    }

    function editGoods(data, id) {
        request.doPut("/admin/goods/" + id + "/", {
            category: data.field.category,
            is_integral: data.field.is_integral == '1' ? true : false,
            goods_name: data.field.goods_name,
            need_integral: data.field.need_integral,
            is_special: data.field.is_special == '1' ? true : false,
            is_active: data.field.is_active == '1' ? true : false,
            vip_info: data.field.vip_info,
            images: getImages(),
            is_promotion: data.field.is_promotion == '1' ? true : false,
            cover_image: $("#cover_image").val(),
            goods_price: data.field.goods_price
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

    function addGoods(data) {
        request.doPost("/admin/goods/", {
            category: data.field.category,
            is_integral: data.field.is_integral == '1' ? true : false,
            goods_name: data.field.goods_name,
            need_integral: data.field.need_integral,
            is_special: data.field.is_special == '1' ? true : false,
            is_active: data.field.is_active == '1' ? true : false,
            vip_info: data.field.vip_info,
            images: getImages(),
            is_promotion: data.field.is_promotion == '1' ? true : false,
            cover_image: $("#cover_image").val(),
            goods_price: data.field.goods_price
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

    var files;
    var uploadListIns = upload.render({
        elem: '#testList'
        , url: 'http://api.gaoshiwang.cn/admin/image/'
        , accept: 'file'
        , field: 'image'
        , headers: {"Authorization": layui.data('token').token}
        , multiple: true
        , auto: false
        //  , bindAction: '#add'
        , choose: function (obj) {
            files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function (index, file, result) {

                var tr = $([' <div class="layui-upload-list ">\n' +
                '<span class="con_img" >' +
                '                    <img id="image_' + index + '" style="width: 200px;height: 200px" layer-src=' + file + ' src=' + result + ' class="layui-upload-img image_path" >\n' +
                '<span id="upload_' + index + '" class="ms layui-hide"style="color: rgb(248,253,253);text-align: center;">上传成功</span></span>' +
                '                    <span ><button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>' +
                '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>' +
                '</span>\n' +
                '                </div>'
                ].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function () {
                    obj.upload(index, file);
                });

                //删除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                    //tr.find('.uploadSucceed').removeAttr("imgpath");
                });

                demoListView.append(tr);

            });
        }, before: function (obj) { //obj参数包含的信息，跟choose回调完全一致
            layer.load(); //上传loading

        }
        , done: function (res, index, upload) {
            layer.closeAll('loading');
            if (res.id > 0) { //上传成功
                var span = demoListView.find('#upload_' + index);
                // ,tds = tr.children();
                span.removeClass('layui-hide');
                var img = demoListView.find('#image_' + index);
                img.attr("imageUrl", res.image);
                // tds.eq(3).html(''); //清空操作
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }
            this.error(index, upload);
        }
        , error: function (index, upload) {
            var tr = demoListView.find('tr#upload-' + index)
                , tds = tr.children();
            // tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            tds.eq(2).find('.demo-reload').removeClass('layui-hide'); //显示重传
        }
        , allDone: function (obj) { //当文件全部被提交后，才触发
            console.log(obj.total); //得到总文件数
            console.log(obj.successful); //请求成功的文件数
            console.log(obj.aborted); //请求失败的文件数
            if (obj.total == obj.successful) {
                loadData();
            } else {
                layer.msg("有文件未上传成功，请重新上传", {icon: 5});
            }

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
            $('#cover_image').val(res.image);
            if (getJsonLength(files) > 0) {
                uploadListIns.upload();
            } else {
                loadData();
            }
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

    function getGoodsDetail(id, op) {
        request.doGet("/admin/goods/" + id + "/", {}, function (response) {
            $.each(response, function (key, value) {
                $('#' + key).val(value);
            });
            $('#category option:contains(' + response.category_name + ')').each(function () {
                if ($(this).text() == response.category_name) {
                    $(this).attr('selected', true);
                }
            });
            $("input[name=is_active]").each(function () {
                if ($(this).val() == response.is_active) {
                    $(this).attr('checked', true);
                }
            });
            $("input[name=is_integral]").each(function () {
                if ($(this).val() == response.is_integral) {
                    $(this).attr('checked', true);
                }
            });
            if (response.is_integral) {
                $('#need_div').removeClass("layui-hide");
                $('#price_div').addClass("layui-hide");
            } else {
                $('#need_div').addClass("layui-hide");
                $('#price_div').removeClass("layui-hide");
            }
            $("input[name=is_promotion]").each(function () {
                if ($(this).val() == response.is_promotion) {
                    $(this).attr('checked', true);
                }
            })
            $("input[name=is_special]").each(function () {
                if ($(this).val() == response.is_special) {
                    $(this).attr('checked', true);
                }
            });
            if (response.is_special) {
                $('#special_div').removeClass("layui-hide");
            } else {
                $('#special_div').addClass("layui-hide");
            }
            var images = response.cover_image;
            $('#demo1').attr('src', images); //图片链接（base64）
            var images = response.images;
            for (var i = 0; i < images.length; i++) {
                var tr = $([' <div class="layui-upload-list ">\n' +
                '<span class="con_img" >' +
                '                    <img id="image_' + i + '" imageUrl="' + images[i] + '" style="width: 200px;height: 200px" layer-src=' + images[i] + ' src=' + images[i] + ' class="layui-upload-img image_path" >\n' +
                '</span>' +
                '                    <span >' +
                '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>' +
                '</span>\n' +
                '                </div>'
                ].join(''));
                //删除
                tr.find('.demo-delete').on('click', function () {
                    // console.log($(this).parent("span").parent(".layui-upload-list"));
                    $(this).parent("span").parent(".layui-upload-list").remove();

                    return false;
                });
                demoListView.append(tr);
            }
            form.render(); //刷新select选择框渲染
        });
    }

    var getImages = function () {
        var images = new Array();
        var spans = $(".image_path");
        for (var i = 0; i < spans.length; i++) {
            images.push($(spans[i]).attr("imageUrl"))
        }
        return images;
    }

    function getJsonLength(jsonData) {

        var jsonLength = 0;

        for (var item in jsonData) {

            jsonLength++;

        }
        return jsonLength;
    }
});