$(function() {
    var searchText = '';
    if(localStorage.getItem('searchText') != 'undefined'){
        searchText = localStorage.getItem('searchText');
    }
    $('.searchInput').val(searchText);
 
    var pageNo = 1;
    var pageSize = 10;
    var count = 0;
    // 分页查询
    function selectSelfList(pageNo, pageSize, searchText) {
        $.ajax({
            type: 'POST',
            url: IP + 'search/fuzzySearch',
            dataType: 'json',
            async: false,
            data: {
                "pageNo": pageNo, //页数
                "pageSize": pageSize, //每页个数
                "name": searchText, //搜索的内
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(data) {
                console.log(data)
                if (data.status == 200) {
                    count = data.pageSize * pageSize;
                    var tempArr = data.orderBeanList;
                    var _html = '';
                    var myDate = new Date();
                    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                    var month = double(myDate.getMonth() + 1); //获取当前月份(0-11,0代表1月)
                    var day = double(myDate.getDate()); //获取当前日(1-31)
                    for (var i = 0; i < tempArr.length; i++) {
                        var timeStr = tempArr[i].time.split(' ')[0];
                        var time = tempArr[i].time.split(' ')[1];
                        var _year = timeStr.split('-')[0];
                        var _month = timeStr.split('-')[1];
                        var _day = timeStr.split('-')[2];
                        _html += '<tr name="'+tempArr[i].id+'">\
                            <td>\
                                <p class="overHidden1">\
                                    <'+tempArr[i].inName+';'+tempArr[i].inTitle+';'+tempArr[i].inDeptName+';'+tempArr[i].inHospitalName+'>\
                                </p>\
                            </td>\
                            <td>\
                                <p class="overHidden2">\
                                    <'+tempArr[i].outName+';'+tempArr[i].outTitle+';'+tempArr[i].outDeptName+';'+tempArr[i].outHospitalName+'>\
                                </p>\
                            </td>\
                            <td>\
                                <p class="overHidden3">***/'+tempArr[i].sex+'/'+tempArr[i].age+'/'+tempArr[i].diagnosis+'</p>\
                            </td>'
                            if(tempArr[i].manner == 0){
                                _html += '<td class="tc">图文</td>'
                            }else {
                                _html += '<td class="tc">视频</td>'
                            }

                            if (year == _year && month == _month && day == _day) {
                                _html += '<td class="tl2em">今天' + time + '</td>'
                            } else {
                                _html += '<td class="tl2em">' + tempArr[i].time + '</td>'
                            }
                        _html += '</tr>'
                    }
                    $('.searchTbody').html(_html);
                        $('.substance').html('"' + searchText + '"' + data.pageTotal + '条已结束病历')
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

    selectSelfList(pageNo, pageSize, searchText);

    layui.use('laypage', function() {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',
            count: count,
            limit: pageSize,
            theme: '#f6c567',
            jump: function(obj, first) {
                selectSelfList(obj.curr, pageSize, searchText);
            }
        });
    });

    $('.ulList').delegate('li', 'click', function() {
        $(this).toggleClass('active');
    })
})
