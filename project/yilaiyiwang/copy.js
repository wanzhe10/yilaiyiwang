// 修改排期
obj = {
    <a class="schedulingBtn" href="javascript:;">
        <span>修改排期</span>
    </a>
    <!-- 视频会诊时间选择 -->
    <div class="selectTimeContainer clearfix">
        <div class="closeBtnTime clearfix">
            <span>关闭</span>
            <img src="/yilaiyiwang/images/close.png" alt="">
        </div>
        <div class="selectTimeContent clearfix">
            <div class="leftContent">
                <h3>发送视频会诊
                <span>选择时间</span>
            </h3>
                <div class="timeBox" id="timeBox"></div>
                <p>*选择您可接受的时间并上传，专家会根据您的选择确定最终时间</p>
                <p>*您选择时段越多，越利于会/转诊的顺利进行</p>
            </div>
            <ul class="rightContent clearfix" id="timeUl">

            </ul>
            <div class="btnBox">
                <a href="javascript:;" class="yesBtn">确定</a>
            </div>
        </div>
    </div>

    // 日期选择
    .selectTimeContainer {
        display: none;
        width: 1060px;
        height: 680px;

        .closeBtnTime {
            height: 50px;
            text-align: right;
            font-size: 18px;
            color: #ffffff;
            line-height: 32px;

            img {
                float: right;
                margin: 3px 5px 0 0;
            }

            span {
                float: right;
            }
        }

        .selectTimeContent {
            box-sizing: border-box;
            background: #f4f4f4;
            height: 630px;
            width: 1060px;
            border-radius: 10px;
            padding: 10px;
            // 时间选择左侧部分
            .leftContent {
                float: left;
                width: 290px;
                height: 500px;
                margin-right: 10px;
                background: #ffffff;
                overflow: hidden;

                > h3 {
                    margin: 15px 0 0 20px;
                    font-weight: 600;
                    font-size: 18px;
                    color: #1937bc;

                    > span {
                        display: block;
                        font-size: 14px;
                    }
                }

                .timeBox {
                    margin: 0 0 0 10px;

                    .layui-laydate {
                        border: none;
                        box-shadow: none;
                    }
                }

                > p {
                    font-size: 14px;
                    color: #101010;
                    line-height: 24px;
                    margin: 25px 20px 0;
                }
            }
            // 时间选择右侧部分
            .rightContent {
                float: right;
                box-sizing: border-box;
                width: 740px;
                height: 500px;
                background: #fff;
                padding: 10px;

                > li {
                    float: left;
                    display: block;
                    box-sizing: border-box;
                    width: 60px;
                    height: 60px;
                    border: 1px solid #f4f4f4;
                    text-align: center;
                    line-height: 60px;
                    font-size: 14px;
                    color: #101010;
                }

                .active {
                    background: #475bc8;
                    color: #fff;
                }
            }

            .btnBox {
                float: left;
                width: 100%;
                // 确定按钮
                .yesBtn {
                    display: block;
                    margin: 50px auto 0;
                    box-sizing: border-box;
                    width: 200px;
                    height: 40px;
                    border: 1px solid #3249c2;
                    background: #516dcf;
                    color: #ffffff;
                    font-size: 14px;
                    text-align: center;
                    line-height: 40px;
                    border-radius: 10px;
                }
            }
        }
    }


    // 修改排期
    $('.schedulingBtn').click(function() {
        var $ = layui.jquery;
        layer.open({
            type: 1,
            content: $('.selectTimeContainer'),
            title: '',
            area: ['1060px', '680px'],
            closeBtn: 0,
            skin: 'noBackground',
        })
        var startMinute = 0; // 开始总分钟数
        var endMinute = 0; // 结束总分钟数
        var startHour = 0; // 开始小时数
        var endHour = 0; // 结束小时数
        var _html = '';
        for (var i = 0; i < 96; i++) {
            startMinute = i * 15;
            endMinute = (i + 1) * 15;
            startHour = parseInt(startMinute / 60);
            endHour = parseInt(endMinute / 60);
            var startM = startMinute %= 60; // 计算后的开始分钟数
            var endM = endMinute %= 60; // 计算后的开始分钟数
            if (endHour == 24) {
                _html += '<li endDate="23:59" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
            } else {
                _html += '<li endDate="' + double(endHour) + ':' + double(endM) + '" index="' + i + '">' + double(startHour) + ':' + double(startM) + '</li>'
            }
        }
        $('.rightContent').html(_html)
    })
    var dateTempList = []; // 收集的时间段
    for (var i = 0; i < data.orderDateList.length; i++) {
        var date = data.orderDateList[i].startDate.split(' ')[0];
        var startDate = data.orderDateList[i].startDate.split(' ')[1];
        var hours = startDate.split(':')[0];
        var minute = startDate.split(':')[1];
        var startIndex = (hours * 60 + minute * 1) / 15;
        var endDate = data.orderDateList[i].endDate.split(' ')[1];
        var endHour = endDate.split(':')[0];
        var endMinute = endDate.split(':')[1];
        var endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
        dateTempList.push({
            "date": date,
            "startIndex": startIndex,
            "endIndex": endIndex - 1,
        })
    }
    var myDate = new Date();
    var flag = true;
    var startIndex = 0;
    var endIndex = 0;
    var dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
    // 渲染日历控件
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#timeBox',
            position: 'static',
            showBottom: false,
            value: dateStr,
            change: function(value, date) { //监听日期被切换
                $('#timeUl > li').removeClass('active');
                dateStr = value;
                for (var i = 0; i < dateTempList.length; i++) {
                    if (dateStr == dateTempList[i].date) {
                        if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                            for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        } else {
                            for (var j = dateTempList[i].endIndex; j <= dateTempList[i].startIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        }
                    }
                }

                for (var i = 0; i < dateTempList.length; i++) {
                    if (value == dateTempList[i].date) {
                        for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                            $('#timeUl > li').eq(j).addClass('active');
                        }
                    }
                }
            }
        });
    });
    // 分钟选择事件、
    $('#timeUl').delegate('li', 'click', function() {
        if (flag) {
            $(this).addClass('active').siblings('li').removeClass('active');
            flag = false;
            startIndex = $(this).attr('index');
        } else {
            $(this).addClass('active');
            flag = true;
            endIndex = $(this).attr('index');
            if (startIndex <= endIndex) {
                for (var i = startIndex; i < endIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            } else {
                for (var i = endIndex; i < startIndex; i++) {
                    $('#timeUl > li').eq(i).addClass('active');
                }
            }
            // var dateTempFlag = true;
            for (var i = 0; i < dateTempList.length; i++) {
                if (dateTempList[i].date == dateStr) {
                    dateTempList.splice(i, 1);
                    dateTempList.push({
                        "date": dateStr,
                        "startIndex": startIndex,
                        "endIndex": endIndex,
                    })
                }
            }
        }
    })
    // 关闭事件
    $('.closeBtnTime').click(function() {
        layer.closeAll();
        $('.selectTimeContainer').hide();
    })

    $('.yesBtn').click(function() {
        var dateList = []; // 选择的时间数据
        for (var i = 0; i < dateTempList.length; i++) {
            if (dateTempList[i].startIndex <= dateTempList[i].endIndex) {
                dateList.push({
                    'startDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).html() + ':00',
                    'endDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).attr('enddate') + ':00'
                });
            } else {
                dateList.push({
                    'startDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].endIndex).html() + ':00',
                    'endDate': dateTempList[i].date + ' ' + $('#timeUl > li').eq(dateTempList[i].startIndex).attr('enddate') + ':00'
                });
            }
        }
        $.ajax({
            type: 'POST',
            url: IP + 'order/updateSchedulingTime',
            dataType: 'json',
            data: {
                "orderId": data.orderFormBean.id,
                "dateList": JSON.stringify(dateList),
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    // 成功操作
                    layer.closeAll();
                    $('.selectTimeContainer').hide();
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    })

}

// 详情图片
obj = {
    <!-- 电子病历的可收缩模块 -->
    <ul class="upfileUl">
        <!-- <li class="upfileItem clearfix">
            <div class="upfileContent">
                <div class="operateLeft">首页-封面(<span class="">0</span>张)</div>
                <ul class="fileContent clearfix">
                    <li class="fileAdd">
                        <a class="addfileBtn" href="javascript:;"></a>
                        <input class="fileInput" type="file" multiple>
                        <p class="fileName">添加文件</p>
                    </li>
                    <li class="fileItem">
                        <div></div>
                        <p class="fileName active">文件名字</p>
                    </li>
                </ul>
            </div>
        </li> -->
    </ul>
    <!-- 查看大图部分 -->
    <div class="bigImgContainer clearfix">
        <div class="bigImgBox">
            <div class="bigImg"></div>
        </div>
        <div class="bigImgRightBox">
            <div class="fileNameBox">
                <h2 class="fileTitle">
                    <span></span>文件名</h2>
                <p class="fileName">图片名字</p>
            </div>
            <div class="fileDescBox">
                <h2 class="descTitle">备注</h2>
                <textarea class="descText" readonly="readonly" name="name" rows="" cols=""></textarea>
            </div>
            <div class="switchBox clearfix">
                <a class="prev" href="javascript:;">上一个文件</a>
                <a class="next" href="javascript:;">下一个文件</a>
            </div>
        </div>
        <a class="closeBtn" href="javascript:;">关闭</a>
    </div>

    // 上传图片
    .upfileItem {
        margin: 28px;

        .upfileContent {
            box-sizing: border-box;
            width: 985px;

            .operateLeft {
                position: relative;
                box-sizing: border-box;
                padding-left: 16px;
                font-size: 14px;

                &:after {
                    content: ' ';
                    position: absolute;
                    top: 4px;
                    left: 0;
                    width: 6px;
                    height: 12px;
                    background: #eef1fb;
                }
            }
        }

        .fileContent {
            height: 100px;

            .fileAdd,
            .fileItem {
                position: relative;
                box-sizing: border-box;
                margin: 19px 4px 0;
                float: left;

                > a {
                    display: block;
                    box-sizing: border-box;
                    width: 100px;
                    height: 100px;
                    border: 1px solid #dbdbdb;
                    border-radius: 10px;
                    background: url("../../images/addfile.png") no-repeat center;
                }

                .fileInput {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100px;
                    height: 100px;
                    margin: 0;
                    padding: 0;
                    opacity: 0;
                    filter:alpha(opacity=0);
                }

                > div {
                    box-sizing: border-box;
                    width: 100px;
                    height: 100px;
                    border-radius: 10px;
                    overflow: hidden;
                    background-size: contain; 
                    bacground-size:
                    background-repeat: no-repeat;
                    border: 1px solid #dbdbdb;
                    background-color: #f4f4f4;
                    background-position: center;
                }

                > img {
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    width: 22px;
                    height: 22px;
                    z-index: 3;
                }

                .fileName {
                    margin-top: 8px;
                    float: left;
                    box-sizing: border-box;
                    padding-right: 20px;
                    width: 100px;
                    color: #101010;
                    font-size: 14px;
                    font-weight: 600;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .active {
                    background: url("../../images/remark.png") no-repeat right center;
                }
            }
        }
    }
    // 查看大图
    .bigImgContainer {
        display: none;
        position: relative;
        width: 1067px;
        height: 600px;
        background: transparent !important;

        .bigImg {
            float: left;
            width: 565px;
            height: 600px;
            box-sizing: border-box;
            overflow: hidden;
            background-size: contain; 
            background-repeat: no-repeat;
            background-color: #f4f4f4;
            background-position: center;
        }

        .bigImgRightBox {
            float: right;
            width: 342px;
            margin: 0 130px 0 30px;

            .fileNameBox {
                box-sizing: border-box;
                width: 342px;
                height: 102px;
                padding: 20px;
                background: rgba(90,90,90,.9);
                border-radius: 10px;

                .fileTitle {
                    font-size: 16px;
                    line-height: 20px;
                    color: #f6c567;

                    > span {
                        display: block;
                        float: left;
                        width: 20px;
                        height: 20px;
                        background: #f6c567;
                        border-radius: 10px 0 0 0;
                        margin-right: 10px;
                    }
                }

                .fileName {
                    font-size: 14px;
                    color: #fff;
                    font-weight: 600;
                    width: 100%;
                    margin: 20px 20px 0 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .fileDescBox {
                box-sizing: border-box;
                width: 342px;
                height: 420px;
                padding: 20px;
                margin: 10px 0 0;
                border-radius: 10px;
                background: rgba(90,90,90,.9);

                .descTitle {
                    box-sizing: border-box;
                    font-size: 16px;
                    line-height: 20px;
                    color: #f6c567;
                    background: url("../../images/remark_active.png") no-repeat left center;
                    padding-left: 30px;
                }

                .descText {
                    box-sizing: border-box;
                    margin-top: 12px;
                    width: 100%;
                    height: 360px;
                    line-height: 26px;
                    background: transparent;
                    padding: 0 5px;
                    color: #fff;

                    &::-webkit-scrollbar {
                        display: none;
                    }
                }
            }

            .switchBox {
                margin-top: 25px;

                > a {
                    display: block;
                    float: left;
                    display: block;
                    box-sizing: border-box;
                    width: 166px;
                    height: 40px;
                    text-align: center;
                    line-height: 40px;
                    color: #fff;
                    background: #101010;
                    font-size: 14px;
                    font-weight: 600;
                    border: 1px solid #666;
                    border-radius: 10px;
                }

                .next {
                    float: right;
                }
            }
        }

        > .closeBtn {
            position: absolute;
            top: 0;
            right: 0;
            box-sizing: border-box;
            color: #fff;
            width: 100px;
            font-size: 18px;
            padding-left: 45px;
            background: url("../../images/close.png") no-repeat 15px center;
        }
    }


    var orderTypes = data.orderFormBean.orderTypes;
    $.ajax({
        type: 'POST',
        url: IP + 'order/selectOrderCaseType',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        data: {
            orderId: data.orderFormBean.id,
        },
        success: function(data) {
            console.log(data);
            if (data.status == 200) {
                var upfileHtml = '';
                $.each(data.list, function(key, val) {
                    for (var i = 0; i < val.length; i++) {
                        upfileHtml += '<li name="' + val[i].name + '" id="' + val[i].id + '" class="upfileItem clearfix">\
                                 <div class="upfileContent">\
                                     <div class="operateLeft">' + key + '-' + val[i].name + '</div>\
                                     <ul class="fileContent clearfix">\
                                     </ul>\
                                 </div>\
                             </li>'
                    }
                })
                $('.upfileUl').html(upfileHtml);
            } else if (data.status == 250) {
                window.location = '/yilaiyiwang/login/login.html'
            }
        },
        error: function(err) {
            console.log(err)
        },
    });
    // 图片插入
    var tempArr = data.patientCaseList;
    for (var i = 0; i < tempArr.length; i++) {
        var fileType = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('.') + 1, tempArr[i].filesUrl.length);
        var fileName = tempArr[i].filesUrl.substr(tempArr[i].filesUrl.lastIndexOf('/') + 1, tempArr[i].filesUrl.length);
        // fileAllArr.push(fileName);
        if (tempArr[i].remarks == '') {
            $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li filePath="' + tempArr[i].filesUrl + '" id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" class="fileItem">\
                                   <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"></div>\
                                    <p type="' + fileType + '" desc="' + tempArr[i].remarks + '" class="fileName">' + fileName + '</p>\
                                </li>')
        } else {
            $('.upfileUl').find('#' + tempArr[i].caseTypes.id).find('.fileContent').append('<li filePath="' + tempArr[i].filesUrl + '" id="' + tempArr[i].id + '" sort="' + tempArr[i].sort + '" class="fileItem">\
                                   <div style = "background-image: url(&apos;'+ imgIp + tempArr[i].filesUrl +'&apos;)"></div>\
                                    <p type="' + fileType + '" desc="' + tempArr[i].remarks + '" class="fileName active">' + fileName + '</p>\
                                </li>')
        }
    }
    $('.sum').html(tempArr.length);//总张数


    // 图片点击查看大图
    var fileArr = [];
    $('.upfileUl').delegate('.fileItem', 'click', function() {
        var $ = layui.jquery;
        // 弹出层
        layer.open({
            type: 1,
            title: '',
            area: ['1067px', '600px'],
            closeBtn: false,
            shade: [0.7, '#000000'],
            shadeClose: true,
            content: $('.bigImgContainer'),
            skin: 'noBackground',
        });
        // 整理一组图片展示数据
        objParent = $(this).parent('.fileContent');
        indexFile = $(this).index();
        ObjArr = $(this).parent('.fileContent').find('.fileItem');
        for (var i = 0; i < ObjArr.length; i++) {
            fileArr.push({
                'name': ObjArr.eq(i).find('p').html(),
                'type': ObjArr.eq(i).find('p').attr('type'),
                'src': ObjArr.eq(i).find('div').css('backgroundImage'),
                'desc': ObjArr.eq(i).find('p').attr('desc'),
            })
        }
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);
    });
    // 备注保存
    // $('.descText').blur(function() {
    //     fileArr[indexFile].desc = $('.descText').val();
    // });
    // 上一个
    $('.switchBox .prev').click(function() {
        if (indexFile <= 0) {
            indexFile = 0;
        } else {
            indexFile--;
        }
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);
    })
    // 下一个
    $('.switchBox .next').click(function() {
        if (indexFile >= fileArr.length - 1) {
            indexFile = fileArr.length - 1;
        } else {
            indexFile++;
        }
        $('.bigImgContainer').find('.bigImg').css('backgroundImage', fileArr[indexFile].src);
        $('.bigImgContainer').find('.fileName').html(fileArr[indexFile].name);
        $('.bigImgContainer').find('.descText').val(fileArr[indexFile].desc);
    });
    // 关闭
    $('.bigImgContainer').find('.closeBtn').click(function() {
        layer.closeAll();
        $('.bigImgContainer').hide();
        var _html = '';
        for (var i = 0; i < fileArr.length; i++) {
            _html += `<li class="fileItem">\
                <div style='background-image:${fileArr[i].src};'></div>`;
            if (fileArr[i].desc == '') {
                _html += '<p type="' + fileArr[i].type + '" desc="" class="fileName">' + fileArr[i].name + '</p>';
            } else {
                _html += '<p type="' + fileArr[i].type + '" desc="' + fileArr[i].desc + '" class="fileName active">' + fileArr[i].name + '</p>';
            }
            _html += '</li>'
        }
        objParent.html(_html);
        fileArr = [];
    });

}

// 诊费
obj = {
    <tr style="background: #fff">
        <td>
            基础诊费
        </td>
        <td class="basePic">500</td>
        <td>
            <input type="text" value="200" class="fees_input gai basePicInput" readonly="readonly">
        </td>
    </tr>
    <tr class="bgfees">
        <td style="font-size: 18px; font-weight: bold; height: 50px;">
            费用总计
        </td>
        <td class="aggregate"></td>
        <td class="dynamicAggregate"></td>
    </tr>

    /* 诊费 */
    var _fees = '';
    for (var i = 0; i < recipientsArr.length; i++) {
        _fees += '<tr>\
                        <td>\
                            <' + recipientsArr[i].name + ' / ' + recipientsArr[i].occupation + ' / ' + recipientsArr[i].deptName + ' / ' + recipientsArr[i].hospitalName + ' > \
                        </td>'
        if (data.orderFormBean.orderTypes == 0) {
            _fees += '<td class = "yuan" >' + recipientsArr[i].picPrice + '</td>'
        } else {
            _fees += '<td class = "yuan" >' + recipientsArr[i].avPrice + '</td>'
        }
        _fees += '<td>'
        if (data.orderFormBean.orderTypes == 0) {
            _fees += '<input type="text" value="' + recipientsArr[i].picPrice + '" class="fees_input gai" readonly="readonly">'
        } else {
            _fees += '<input type="text" value="' + recipientsArr[i].avPrice + '" class="fees_input gai" readonly="readonly">'
        }
        _fees += '</td></tr>'
    }
    $('.basePic').html(data.orderFormBean.basePrice);
    $('.basePicInput').val(data.orderFormBean.basePrice);
    $('.tbody_doc').html(_fees);
    $('.aggregate').html(data.orderFormBean.money);
    $('.dynamicAggregate').html(data.orderFormBean.money);  
//如果是图文会诊 
if (data.orderFormBean.types == '0') {
    $('.schedule ').hide();
    $('.schedule_modules ').hide();

} else {
    $('.schedule ').show();
    $('.schedule_modules ').show();
}

}
