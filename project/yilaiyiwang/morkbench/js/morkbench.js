$(function() {
    var pageNo = 1; // 页码
    var pageSize = 10; // 每页条数
    var count = 0; // 列表总条数
    var draftsCount = 0; // 草稿箱总条数
    var orderStateId = ''; // 订单id

    /*日历点击显示隐藏 */
    $("#calender").animate({
        left: 300
    }, "slow");
    $(".small_button").click(function() {
        var div = $(".wrap");
        if (div.hasClass("dest")) {
            div.removeClass("dest").animate({
                right: -400
            }, "slow");
            $(".small_button span").html("工 作 日 历 表");
            $(this).css("height", "160px");

        } else {
            div.addClass("dest").animate({
                right: 0
            }, "slow");
            $(".small_button").css(" height","200px");
            $(".small_button span").html("收 起");
            $(this).css({
                "height": "100px",
                "border-radius": "0 0 0 10px;"
            });
        }
    });


   

     var markJson = {};
     var myDate = new Date();
     var dateStr = myDate.getFullYear() + '-' + double(myDate.getMonth() + 1) + '-' + double(myDate.getDate());
     var currentMonth = myDate.getMonth() + 1;
     MouthSection(currentMonth);

      function MouthSection(month) {
          var _date = new Date();
           var startDate = _date.getFullYear() + '-' + double(month) + '-01 00:00:00';
           _date.setMonth(month)
           _date.setDate(0);
           var endDate = _date.getFullYear() + '-' + double(month) + '-' + _date.getDate() + ' 23:59:59';
         $.ajax({
             type: 'POST',
             url: IP + 'order/doctorSchedulingList',
             dataType: 'json',
             data: {
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
                    for (var i = 0; i < tempArr.length;i++){
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
     doctorScheduling(dateStr + ' 00:00:00', dateStr + ' 23:59:00')
     // 渲染日历控件
     layui.use('laydate', function () {
         var laydate = layui.laydate;
         //执行一个laydate实例
         laydate.render({
             elem: '#test-n1',
             position: 'static',
             showBottom: false,
             value: dateStr,
             mark: markJson,
             change: function (value, date) { //监听日期被切换
                 $('.workUl').html('');
                 doctorScheduling(value + ' 00:00:00', value + ' 23:59:00');
                 if (currentMonth != date.month) {
                     currentMonth = date.month;
                     MouthSection(date.month);
                 }
             }
         });
     });

      

   
/* 医生排期悬浮框 */
    function doctorScheduling(startDate, endDate) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/doctorScheduling',
            dataType: 'json',
            data: {
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
                    var tempArr = data.orderFormList;
                    var _html = '';
                    for (var i = 0; i < tempArr.length; i++) {
                        var time = tempArr[i].time.split(' ')[1];
                        _html += '<li class="wordItem">\
						<p><span class="timeText">' + time + '</span>已排期/视频会诊</p>\
						<div class="contentBox">\
							<p>***/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
							<p>收件人：' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '</p>\
							<p>发件人：' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '</p>\
						</div>\
                    </li>'
                    
                    }
                    $('.workUl').append(_html);
                    /* 日历 */
 
                } else if (data.status == 250) {
                    // 未登录操作
                    window.location = '/yilaiyiwang/login/login.html';
                } else if (data.status == 205) {
                    $('.workUl').html('');
                } else {
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    }
    
    // 查询草稿数量
    $.ajax({
        type: 'GET',
        url: IP + 'order/draftSize',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false,
        crossDomain: true,
        global: false,
        success: function(data) {
            if (data.status == 200) {
                // 成功操作
                $('.unReadNum').html(data.size);
                draftsCount = data.size;
            } else if (data.status == 250) {
                // 未登录操作
                window.location = '/yilaiyiwang/login/login.html';
            } else {}
        },
        error: function(err) {
            console.log(err);
        },
    });

    // 医生受邀订单列表
    function getInvitedList(orderStateId, pageNo, pageSize) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/queryReceiveOrderList',
            dataType: 'json',
            data: {
                "orderStateId": orderStateId,
                "pageNo": pageNo,
                "pageSize": pageSize,
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
                    var myDate = new Date();
                    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
                    var day = double(myDate.getDate()); //获取当前日(1-31)
                    var _html = '';
                    var tempArr = data.orderBeanList;
                    for (var i = 0; i < tempArr.length; i++) {
                        var timeStr = tempArr[i].time.split(' ')[0];
                        var time = tempArr[i].time.split(' ')[1];
                        var _year = timeStr.split('-')[0];
                        var _month = timeStr.split('-')[1];
                        var _day = timeStr.split('-')[2];
                        _html += '<tr applyFlag="' + tempArr[i].applyFlag + '" type="2" name="' + tempArr[i].id + '">\
						<td>'
                        if (tempArr[i].isurgent == 1) {
                            _html += '<img class="w14" src="/yilaiyiwang/images/light.png" />'
                        }

                        _html += '</td>'
                        if (tempArr[i].orderType == 0) {
                            _html += '<td class="tc">会诊</td>'
                        } else {
                            _html += '<td class="tc">转诊</td>'
                        }
                        _html += '<td>\
						            	<p class="overHidden3">' + '***' + '/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
						        </td>\
                        <td>\
							<p class="overHidden1">\
								<' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '>\
							</p>\
						</td>\
						<td>\
							<p class="overHidden2">\
								<' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '>\
							</p>\
						</td>'
                        if (tempArr[i].manner == 0) {
                            _html += '<td class="tc">图文</td>'
                        } else {
                            _html += '<td class="tc">视频</td>'
                        }
                        if (year == _year && month == _month && day == _day) {
                            _html += '<td class="tl2em">今天' + time + '</td>'
                        } else {
                            _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
                        }
                        _html += '</tr>'
                    }
                    $('#tabContent').html(_html);
                } else if (data.status == 250) {
                    // 未登录操作
                } else if (data.status == 205) {
                    // 其他操作
                    $('#tabContent').html('');
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    }

    // 医生发出订单列表
    function getIssueList(orderStateId, pageNo, pageSize) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/queryApplyOrderList',
            dataType: 'json',
            data: {
                "orderStateId": orderStateId,
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    var myDate = new Date();
                    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
                    var day = double(myDate.getDate()); //获取当前日(1-31)
                    var _html = '';
                    var tempArr = data.orderListBeanList;
                  
                          for (var i = 0; i < tempArr.length; i++) {
                              var timeStr = tempArr[i].time.split(' ')[0];
                              var time = tempArr[i].time.split(' ')[1];
                              var _year = timeStr.split('-')[0];
                              var _month = timeStr.split('-')[1];
                              var _day = timeStr.split('-')[2];
                        _html += '<tr applyFlag="' + tempArr[i].applyFlag + '" type="3" name="' + tempArr[i].id + '">\
						<td>'
                        if (tempArr[i].isurgent == 1) {
                            _html += '<img class="w14" src="/yilaiyiwang/images/light.png" />'
                        }
                        _html += '</td>'
                        if (tempArr[i].orderType == 0) {
                            _html += '<td class="tc">会诊</td>'
                        } else {
                            _html += '<td class="tc">转诊</td>'
                        }
                        _html += '<td>\
							<p class = "overHidden3" > ' + '***' + ' / ' + tempArr[i].sex + ' / ' + tempArr[i].age + ' / ' + tempArr[i].diagnosis + ' </p>\
						</td>\
                        <td>\
							<p class="overHidden1" style=" width:270px;">\
								<' + tempArr[i].inName + ';' + tempArr[i].inTitle + ';' + tempArr[i].inDeptName + ';' + tempArr[i].inHospitalName + '>\
							</p>\
						</td>\
						<td>\
							<p class="overHidden2"style=" width:160px;">\
								<' + tempArr[i].outName + ';' + tempArr[i].outTitle + ';' + tempArr[i].outDeptName + ';' + tempArr[i].outHospitalName + '>\
							</p>\
						</td>'
                        if (tempArr[i].manner == 0) {
                            _html += '<td class="tc">图文</td>'
                        } else {
                            _html += '<td class="tc">视频</td>'
                        }
                        if (year == _year && month == _month && day == _day) {
                            _html += '<td class="tl2em">今天' + time + '</td>'
                        } else {
                            _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
                        }
                        _html += '</tr>'
                    }

                    $('#tabContent').html(_html);
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';

                } else if (data.status == 205) {
                    // 其他操作
                    $('#tabContent').html('');
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    }
    // 获取草稿箱数据
    function getDrafts(pageNo, pageSize) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/queryDraft',
            dataType: 'json',
            data: {
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    var myDate = new Date();
                    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
                    var day = double(myDate.getDate()); //获取当前日(1-31)
                    var tempArr = data.draftOrderList;
                    var _html = '';
                    for (var i = 0; i < tempArr.length; i++) {
                        var timeStr = tempArr[i].time.split(' ')[0];
                        var time = tempArr[i].time.split(' ')[1];
                        var _year = timeStr.split('-')[0];
                        var _month = timeStr.split('-')[1];
                        var _day = timeStr.split('-')[2];
                        _html += '<tr name="' + tempArr[i].id + '">\
						<td>\
							<p class="w520">' + tempArr[i].name + '/' + tempArr[i].sex + '/' + tempArr[i].age + '/' + tempArr[i].diagnosis + '</p>\
						</td>'
                        if (year == _year && month == _month && day == _day) {
                            _html += '<td class="tl2em">今天' + time + '</td>'
                        } else {
                            _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
                        }
                        _html += '</tr>'
                    }
                    $('.drafts_tbody').html(_html);
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';
                } else {
                    // 其他操作
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
    }

    
    /* 左边导航栏 医生受邀请列表 */
    $.ajax({
        type: 'POST',
        url: IP + 'doctorOrderStatus/findOrderStatus',
        dataType: 'json',
        data: {
            "type": '2', //(0:医政受邀列表,1:医政发出列表,2:医生受邀，3医生发出
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        global: false,
        success: function(data) {
            console.log(data)
            if (data.status == 200) {
                var tempArr = data.doctorOrderStatusList;
                var _html = '';
                for (var i = 0; i < tempArr.length; i++) {
                    if (i == 0) {
                        if (tempArr[i].unReadFlag == 0) {
                            _html += '<li name="' + tempArr[i].states.id + '" class="ulAct">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class=""></div>\
					</li>'
                        }
                         else {
                            _html += '<li name="' + tempArr[i].states.id + '" class="ulAct">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class = "unRead" > '+tempArr[i].orderSize+' </div>\
					</li>'
                        }
                    } else {
                        if (tempArr[i].unReadFlag == 0) {
                            _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class=""></div>\
					</li>'
                        } else {
                            _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class = "unRead" > '+tempArr[i].orderSize+' </div>\
					</li>'
                        }
                    }
                }
                $('#inviteUl').html(_html);
                getInvitedList(tempArr[0].states.id, pageNo, pageSize);
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
    /* 左边导航栏 医生发出列表 */
    $.ajax({
        type: 'POST',
        url: IP + 'doctorOrderStatus/findOrderStatus',
        dataType: 'json',
        data: {
            "type": '3', //(0:医政受邀列表,1:医政发出列表,2:医生受邀，3医生发出
        },
        xhrFields: {
            withCredentials: true
        },
        async: false,
        crossDomain: true,
        global: false,
        success: function(data) {
            console.log(data)
            if (data.status == 200) {
                var tempArr = data.doctorOrderStatusList;
                var _html = '';
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].unReadFlag == 0) {
                        _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span>' + tempArr[i].statesName + '</span>\
						<div class=""></div>\
					</li>'
                    } else {
                        _html += '<li name="' + tempArr[i].states.id + '" class="">\
						<span> ' + tempArr[i].statesName + ' </span>\
						<div class="unRead">'+tempArr[i].orderSize+'</div>\
					</li>'
                    }
                }
                $('#issueUl').html(_html);
                // 成功操作
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

    // 列表的切换
    $('.leftNav').click(function() {
        var _index = $(this).index();
        $(this).addClass('active').siblings('div').removeClass('active');
        if (_index == 0) {
            // 医政受邀列表
            localStorage.setItem('orderType', '0');
            $('.drafts_table').css("display", 'none');
            $('.tables').css('display', 'block');
            
        } else if (_index == 1) {
            // 1:医政发出列表
            localStorage.setItem('orderType', '1');
            $('.drafts_table').css("display", 'none');
            $('.tables').css('display', 'block');
        } else if (_index == 2) {
            $('.drafts_table').css("display", 'block');
            $('.tables').css('display', 'none');
            getDrafts(pageNo, pageSize);
        }
    });


    // 草稿箱分页
    layui.use('laypage', function() {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'drafts',
            count: draftsCount,
            limit: pageSize,
            theme: '#f6c567',
            jump: function(obj, first) {
                getDrafts(obj.curr, pageSize);
            }
        });
    });
    // 列表分页 默认
    layui.use('laypage', function() {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'listBox',
            count: count,
            limit: pageSize,
            theme: '#f6c567',
            jump: function(obj, first) {
                getInvitedList(orderStateId, obj.curr, pageSize);
            }
        });
    });

    // 受邀ul切换 queryReceiveOrderList
    $("#inviteUl").delegate('li', 'click', function() {
        $('.recipients').css('width', '160px');
        $('.originator').css('width', '270px');
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
      
        // $(this).children("div").removeClass("unRead");
        // if ($("#leftUL").children().find(".unRead").length == 0) {
        //     $("#leftTitle").next("div").removeClass("unRead");
        // }
        orderStateId = $(this).attr('name');
        console.log(orderStateId);
        var countNum = 0;
        $.ajax({
            type: 'POST',
            url: IP + 'order/queryReceiveOrderList',
            dataType: 'json',
            data: {
                "orderStateId": orderStateId,
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            async: false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    countNum = data.pageSize * pageSize; // 当前li Tab 下的总条数
                } else if (data.status == 250) {
                    // 未登录操作
                } else if (data.status == 205) {
                    // 其他操作
                    $('#tabContent').html('');
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: countNum,
                limit: pageSize,
                theme: '#f6c567',
                jump: function(obj, first) {
                    getInvitedList(orderStateId, obj.curr, pageSize);
                }
            });
        });
    });
    
    // 发出ul切换 queryApplyOrderList
    $("#issueUl").delegate('li', 'click', function() {
        $('.recipients').css('width','270px');
        $('.originator').css('width', '160px');
        $(".ulAct").removeClass("ulAct");
        $(this).addClass("ulAct");
        // $(this).children("div").removeClass("unRead");
        // if ($("#leftUL").children().find(".unRead").length == 0) {
        //     $("#leftTitle").next("div").removeClass("unRead");
        // }
        orderStateId = $(this).attr('name');
        var countNum = 0;
        $.ajax({
            type: 'POST',
            url: IP + 'order/queryApplyOrderList',
            dataType: 'json',
            data: {
                "orderStateId": orderStateId,
                "pageNo": pageNo,
                "pageSize": pageSize,
            },
            async: false,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    countNum = data.pageSize * pageSize;
                } else if (data.status == 250) {
                    window.location = '/yilaiyiwang/login/login.html';

                } else if (data.status == 205) {
                    // 其他操作
                    $('#tabContent').html('');
                }
            },
            error: function(err) {
                console.log(err);
            },
        })
        layui.use('laypage', function() {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'listBox',
                count: countNum,
                limit: pageSize,
                theme: '#f6c567',
                jump: function(obj, first) {
                    getIssueList(orderStateId, obj.curr, pageSize);
                }
            });
        });
    });


    // 发出列表详情
    $('#tabContent').delegate('tr', 'click', function() {
        selectOrderById($(this).attr('name'), $(this).attr('type'), $(this).attr('applyFlag'));
    })

    // 查看订单详情
    function selectOrderById(orderId, type, readFlag) {
        $.ajax({
            type: 'POST',
            url: IP + 'order/selectOrderById',
            dataType: 'json',
            data: {
                "orderId": orderId,
                "type": type, //是那个列表的类型(0:医政受邀列表,1:医政发出列表,2:医生受邀列表,3:医生发出列表)
                "readFlag": readFlag,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            global: false,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    sessionStorage.setItem('data', JSON.stringify(data));
                    if (type == 2) {
                        // -------受邀的----------
                        if (data.orderFormBean.statesName == "首诊待审核") {
                            // 待审核
                        } else if (data.orderFormBean.statesName == "待收诊" || data.orderFormBean.statesName == "专家协调") {
                            window.location = '/yilaiyiwang/receive/RcollectingClinical.html';
                        } else if (data.orderFormBean.statesName == "排期审核") {
                            window.location = '/yilaiyiwang/receive/schedulingExamine.html';
                        } else if (data.orderFormBean.statesName == "已排期") {
                            window.location = '/yilaiyiwang/receive/scheduling.html';
                        } else if (data.orderFormBean.statesName == "会诊中") {
                            // 会诊中
                            window.location = '/yilaiyiwang/receive/Rconsultation.html'
                        } else if (data.orderFormBean.statesName == "待反馈") {
                            // 待反馈
                            window.location = '/yilaiyiwang/receive/Rfeedback.html'
                        } else if (data.orderFormBean.statesName == "已结束") {
                            // 已完成
                            window.location = '/yilaiyiwang/receive/Rfinish.html'
                        } else if (data.orderFormBean.statesName == "会诊已拒收") {
                            // 已拒收
                            window.location = '/yilaiyiwang/receive/Rrejection.html'
                        }
                    } else if (type == 3) {
                        // --------------发出的-----
                        if (data.orderFormBean.statesName == "首诊待审核") {
                            localStorage.setItem('orderId', orderId);
                            window.location = '/yilaiyiwang/particulars/toAudit.html';
                        } else if (data.orderFormBean.statesName == "待收诊" || data.orderFormBean.statesName == "排期审核" || data.orderFormBean.statesName == "专家协调") {
                            localStorage.setItem('orderId', orderId);
                            window.location = '/yilaiyiwang/particulars/collectingClinical.html';
                        } else if (data.orderFormBean.statesName == "已排期") {
                            window.location = '/yilaiyiwang/particulars/scheduling.html';
                        } else if (data.orderFormBean.statesName == "会诊中") {
                            // 会诊中
                            window.location = '/yilaiyiwang/particulars/consultation.html'
                        } else if (data.orderFormBean.statesName == "待反馈") {
                            // 待反馈
                            window.location = '/yilaiyiwang/particulars/feedback.html'
                        } else if (data.orderFormBean.statesName == "已结束") {
                            // 已完成
                            window.location = '/yilaiyiwang/particulars/finish.html'
                        } else if (data.orderFormBean.statesName == "会诊已拒收") {
                            // 已拒收
                            window.location = '/yilaiyiwang/particulars/rejection.html'
                        }
                    }
                    // 成功操作
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
    }


    // 草稿箱详情
    $('.drafts_tbody').delegate('tr', 'click', function() {
        localStorage.setItem('detailsId', $(this).attr('name'));
         window.location = '/yilaiyiwang/detailsDraft/detailsDraft.html';
    })

})
