layui.define(["form", "jquery"], function (exports) {
    var form = layui.form
    var $ = layui.jquery


   var  Address =  {



    provinces : function (province ,city,area) {
        //加载省数据
        var proHtml = '', that = this;
        $.get("../../../static/js/extends/address.json", function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == province) {
                    proHtml += '<option selected="selected" value="' + data[i].code + '">' + data[i].name + '</option>';
                    that.citys(data[i].childs,city,area);
                } else {
                    proHtml += '<option value="' + data[i].code + '">' + data[i].name + '</option>';
                }
            }
            //初始化省数据
            $("select[name=province]").append(proHtml);
            form.render();
            form.on('select(province)', function (proData) {
                $("select[name=area]").html('<option value="">请选择县/区</option>');
                var value = proData.value;
                if (value > 0) {
                    that.citys(data[$(this).index() - 1].childs,'','');
                } else {
                    $("select[name=city]").attr("disabled", "disabled");
                }
            });
        })
    },

    //加载市数据
  citys : function (citys,city,area) {
        var cityHtml = '<option value="">请选择市</option>', that = this;
        for (var i = 0; i < citys.length; i++) {
            if (citys[i].name==city){
                cityHtml += '<option  selected="selected" value="' + citys[i].code + '">' + citys[i].name + '</option>';
                that.areas(citys[i].childs,area);
            }else{
                cityHtml += '<option value="' + citys[i].code + '">' + citys[i].name + '</option>';
            }

        }
        $("select[name=city]").html(cityHtml).removeAttr("disabled");
        form.render();
        form.on('select(city)', function (cityData) {
            var value = cityData.value;
            if (value > 0) {
                that.areas(citys[$(this).index() - 1].childs,'');
            } else {
                $("select[name=area]").attr("disabled", "disabled");
            }
        });
    },

    //加载县/区数据
   areas :function (areas,area) {
        var areaHtml = '<option value="">请选择县/区</option>';
        for (var i = 0; i < areas.length; i++) {
            if (areas[i].name==area){
                areaHtml += '<option selected="selected" value="' + areas[i].code + '">' + areas[i].name + '</option>';
            }else{
                areaHtml += '<option value="' + areas[i].code + '">' + areas[i].name + '</option>';
            }

        }
        $("select[name=area]").html(areaHtml).removeAttr("disabled");
        form.render();
    }
};

    exports("address", Address
    );
})