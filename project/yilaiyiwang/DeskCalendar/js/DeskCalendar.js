$(function() {
    // 查询一级科室
    $.ajax({
        type: 'GET',
        url: IP + 'hospitalDept/selectSelfDeptOneList',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        
        success: function(data) {
            console.log(data);
            if (data.status == 200) {
                var tempArr = data.hospitalDeptList;
                var _html = '<option value="">请选择</option>';
                for (var i = 0; i < tempArr.length; i++) {
                    _html += '<option value="' + tempArr[i].oneDeptId + '">' + tempArr[i].parentDeptName + '</option>';
                }
                $('.oneDeptSelect').html(_html);
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
    });
    $('.oneDeptSelect').change(function() {
        $.ajax({
            type: 'POST',
            url: IP + 'hospitalDept/selectSelfDeptTwoList',
            dataType: 'json',
            data: {
                "deptOneId": $('.oneDeptSelect').val(),
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
        global: false,
            
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    var tempArr = data.hospitalDeptList;
                    var _html = '<option value="">请选择</option>';
                    for (var i = 0; i < tempArr.length; i++) {
                        _html += '<option value="' + tempArr[i].hospitalDeptId + '">' + tempArr[i].deptName + '</option>';
                    }
                    $('.twoDeptSelect').html(_html);
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
        });
    });
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
    $('.rightContent').html(_html);
    var markJson = {};
    var myDate = new Date();
    var dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
    var currentMonth = myDate.getMonth() + 1;
    var deptId = '';

    function MouthSection(month) {
        var _date = new Date();
        var startDate = _date.getFullYear() + '-' + double(month) + '-01 00:00:00';
        _date.setMonth(month)
        _date.setDate(0);
        var endDate = _date.getFullYear() + '-' + double(month) + '-' + _date.getDate() + ' 23:59:59';
        $.ajax({
            type: 'POST',
            url: IP + 'order/deptSchedulingList',
            dataType: 'json',
            data: {
                "deptId": deptId,
                "startDate": startDate,
                "endDate": endDate
            },
            xhrFields: {
                withCredentials: true
            },
            async: false,
            crossDomain: true,
            success: function (data) {
                console.log(data)
                if (data.status == 200) {
                    var tempArr = data.dateList;
                    for (var i = 0; i < tempArr.length; i++) {
                        markJson[tempArr[i]] = '';
                    }
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function (err) {
                console.log(err);
            },
        })
    }
    // var dateTempList = [];
    
    // var flag = true;
    // var startIndex = 0;
    // var endIndex = 0;
    var myDate = new Date();
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
             mark: markJson,
            change: function(value, date) { //监听日期被切换
                deptScheduling(value + ' 00:00:00', value + ' 23:59:00',value);
                if (currentMonth != date.month) {
                    currentMonth = date.month;
                    MouthSection(date.month);
                }
            }
        });
    });

    $('.twoDeptSelect').change(function() {
        deptId = $(this).val();
        deptScheduling(dateStr + ' 00:00:00', dateStr + ' 23:59:00');
        MouthSection(currentMonth);
        $('#timeBox').html('');
        var myDate = new Date();
        var dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
        // 渲染日历控件
        layui.use('laydate', function () {
            var laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#timeBox',
                position: 'static',
                showBottom: false,
                value: dateStr,
                mark: markJson,
                change: function (value, date) { //监听日期被切换
                    deptScheduling(value + ' 00:00:00', value + ' 23:59:00', value);
                    if (currentMonth != date.month) {
                        currentMonth = date.month;
                        MouthSection(date.month);
                    }
                }
            });
        });
    });
    // 科室排班查询接口、
    function deptScheduling(startDate, endDate,value) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/deptScheduling',
            dataType: 'json',
            data: {
                "deptId": $('.twoDeptSelect').val(),
                "startDate": startDate,
                "endDate": endDate,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
        global: false,
            
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    // 成功操作
                    var dateTempList = []; // 收集的时间段
                    var tempArr = data.orderFormList;
                    var _html = '';
                    for (var i = 0; i < tempArr.length; i++) {
                        var date = tempArr[i].time.split(' ')[0];
                        var startDate = tempArr[i].time.split(' ')[1];
                        var hours = startDate.split(':')[0];
                        var minute = startDate.split(':')[1];
                        var startIndex = (hours * 60 + minute * 1) / 15;
                        var endDate = tempArr[i].endTime.split(' ')[1];
                        var endHour = endDate.split(':')[0];
                        var endMinute = endDate.split(':')[1];
                        var endIndex = Math.ceil((endHour * 60 + endMinute * 1) / 15);
                        dateTempList.push({
                            "date": date,
                            "startIndex": startIndex,
                            "endIndex": endIndex - 1,
                        });

                        _html += '<tr>\
                          <td style="padding-left:50px;">' + startDate + '</td>\
                          <td>'
                        if (tempArr[i].isurgent == 1) {
                            _html += '<img class="" src="/yilaiyiwang/images/light.png" />'
                        }
                        _html += '</td>\
                          <td>'
                        if (tempArr[i].orderType == 0) {
                            _html += '会诊'
                        } else {
                            _html += '转诊'
                        }
                        _html += '</td>\
                          <td><' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '></td>\
                          <td><' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '></td>\
                          <td>'
                        if (tempArr[i].manner == '0') {
                            _html += '图文会诊';
                        } else {
                            _html += '视频会诊';
                        }
                        _html += '</td>\
                      </tr>'
                    }
                    $('.bodyContent').html(_html);
                    for (var i = 0; i < dateTempList.length; i++) {
                        if (value == dateTempList[i].date) {
                            for (var j = dateTempList[i].startIndex; j <= dateTempList[i].endIndex; j++) {
                                $('#timeUl > li').eq(j).addClass('active');
                            }
                        }
                    }
                    dateTempList = [];
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else if(data.status == 205){
                    $('.bodyContent').html('<p class="noData">无预约</p>');
                    $('#timeUl > li').removeClass('active');
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);

            },
        });
    }

});
