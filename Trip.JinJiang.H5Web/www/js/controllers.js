﻿angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    //$ionicModal.fromTemplateUrl('templates/login.html', {
    //    scope: $scope
    //}).then(function (modal) {
    //    $scope.modal = modal;
    //});

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
})

//线路列表控制器
.controller('LinelistsCtrl', function ($scope, $http) {
    var searchParam = request("search");
    var nghttp = "../../ajax/apihandler.ashx?fn=getlines";

    $scope.listhistorygoback = function () {
        window.location.href = "#/app/index";
        location.reload();
    }

    $http.get(nghttp).success(function (response) {
        //debugger
        var arrayLinemm = new Array(0);
        for (var i = 0; i < response.lines.length; i++) {
            if (response.lines[i].imageUrls[0] === undefined || response.lines[i].imageUrls[0] === null || response.lines[i].imageUrls[0].indexOf('http') < 0)
                response.lines[i].imageUrls[0] = 'http://img5.imgtn.bdimg.com/it/u=45254662,160915219&fm=21&gp=0.jpg'
            //往搜索结果中添加合集(1)
            if (response.lines[i].lineName.indexOf(searchParam) > -1)
                arrayLinemm.push(response.lines[i])
        }
        //往搜索结果中添加合集(2)
        $scope.linelists = arrayLinemm;
        $scope.agencies = response.agencies;

    });
    $scope.listent = function () {
        setCookie('ent2detail', 'index', 1);
    }
})
 //线路列表控制器2,唯独不一样的是路由
.controller('LinelistsCtrl2', function ($scope, $http) {
    //debugger
    var url = location.href;
    var lineCategory = url.substring(url.lastIndexOf('/') + 1, url.length);
    var searchParam = lineCategory;
    //lineCategory = "SALELINE"
    var nghttp = "../../ajax/apihandler.ashx?fn=getlinesbycategory&lineCategory=" + lineCategory + "";
    //loading层
    var mylayeruiwait = layer.load(1, {
        shade: [0.5, '#ababab'] //0.1透明度的白色背景
    });
    $http.get(nghttp).success(function (response) {
        $.ajax({
            url: "../../ajax/apihandler.ashx",
            data: { fn: "getlinecategoriecrm", category: lineCategory },
            type: "post",
            success: function (text) {
                layer.close(mylayeruiwait);
               //    debugger
                var d = eval("(" + text + ")");
                var arrayLinemm = new Array(0);
                for (var i = 0 ; i < d.rows.length; i++) {
                    for (var j = 0 ; j < response.lines.length; j++) {
                        if (d.rows[i].lineId == response.lines[j].lineId) {
                            //往搜索结果中添加合集(1)
                            if (response.lines[j].imageUrls[0] === undefined || response.lines[j].imageUrls[0] === null || response.lines[j].imageUrls[0].indexOf('http') < 0)
                                response.lines[j].imageUrls[0] = 'http://img5.imgtn.bdimg.com/it/u=45254662,160915219&fm=21&gp=0.jpg';
                            response.lines[j].lineCategory = d.rows[i].lineCategory;
                            arrayLinemm.push(response.lines[j]);
                        }
                    }
                }

                //for (var i = 0; i < response.lines.length; i++) {
                //    if (response.lines[i].imageUrls[0] === undefined || response.lines[i].imageUrls[0] === null || response.lines[i].imageUrls[0].indexOf('http') < 0)
                //        response.lines[i].imageUrls[0] = 'http://img5.imgtn.bdimg.com/it/u=45254662,160915219&fm=21&gp=0.jpg'
                //    //往搜索结果中添加合集(1)
                //    if (response.lines[i].lineCategory == searchParam)
                //        arrayLinemm.push(response.lines[i])
                //}
                //往搜索结果中添加合集(2)
                //debugger
                $scope.linelists = arrayLinemm;
                $scope.agencies = response.agencies;

            }
        })

    });
    $scope.listent = function () {
        setCookie('ent2detail', lineCategory, 1);
    }
    $scope.listhistorygoback = function () {
        window.location.href = "#/app/index";
        location.reload();
    }
})


//主页控制器
.controller('indexCtrl', function ($scope, $http, $ionicScrollDelegate) {

    //实现自带搜索按钮跳转并失去焦点关闭键盘.
    $(function () {
        $('.searchtxt').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                searchLines(this);
                document.activeElement.blur();
            }
        });
    });
    $scope.searchlines = function () {
        searchLines();
    }

    //滚动,下拉出电话
    $scope.getScrollPosition = function () {
        var scrolltop = $ionicScrollDelegate.$getByHandle('indexDelegate').getScrollPosition().top;
        $('#teledown').css('top', scrolltop + document.documentElement.childNodes[2].scrollHeight - 120);
    }

    //分类图标
    var nghttpcategory = "../../ajax/apihandler.ashx?fn=getlinecategorys&status=true&pattern=S1";
    $http.get(nghttpcategory).success(function (response) {
        $scope.linecategorys = response.ds;
    })

    var nghttp02 = "../../../ajax/lineCategoryHandler.ashx?fn=getpatternss2";
    $http.get(nghttp02).success(function (response) {
        // debugger
        $scope.linecategorys2 = response.ds;
    })
    //分类样式S2
    var nghttppattern = "../../ajax/apihandler.ashx?fn=getlinecategorys2&status=true&pattern=S2";
    $http.get(nghttppattern).success(function (response) {
        //debugger
        var myimgurl;
        for (var i = 0; i < response.ds.length; i++) {
            myimgurl = response.ds[i].imageUrls;
            if (myimgurl.indexOf('|') > 0) {
                myimgurl = myimgurl.substring(0, myimgurl.indexOf('|'));
                response.ds[i].imageUrls = myimgurl;
            }
        }
        $scope.linecategorys2detail = response.ds;
    })

    //var nghttp = "../../ajax/apihandler.ashx?fn=getlinespromotion&pattern=S2";
    //$http.get(nghttp).success(function (response) {

    //  //  if ($scope.linecategorys2[0].categoryName == response.ds[0].lineCategory)
    //    //for (var i = 0; i < 8; i++) {
    //    //    if (response.lines[i].imageUrls[0] === undefined || response.lines[i].imageUrls[0] === null || response.lines[i].imageUrls[0].indexOf('http') < 0)
    //    //        response.lines[i].imageUrls[0] = 'http://img5.imgtn.bdimg.com/it/u=45254662,160915219&fm=21&gp=0.jpg'
    //    //}
    //    //var arrayLineP = new Array(0);
    //    //arrayLineP.push(response.lines[0]);
    //    //arrayLineP.push(response.lines[1]);
    //    //arrayLineP.push(response.lines[2]);
    //    //arrayLineP.push(response.lines[3]);

    //    //var arrayLineN = new Array(0);
    //    //arrayLineN.push(response.lines[4]);
    //    //arrayLineN.push(response.lines[5]);
    //    //arrayLineN.push(response.lines[6]);
    //    //arrayLineN.push(response.lines[7]);

    //    $scope.linelistsP = arrayLineP;
    //    $scope.linelistsN = arrayLineN;
    //    $scope.agencies = response.agencies;

    //});

    $scope.indexent = function () {
        setCookie('ent2detail', 'index', 1);
    }
    //城目的地选择
    $scope.desSelect = function () {
        $('#divcontent').hide();
        $('#bartitle').hide();
        $('#divdesselect').show();

        $('#divdesselect').click(function (event) {
            if (event.target.className === 'searchDest') {
                $(".searchtxt")[1].value = event.target.innerText;
            }
        })
    }

    //二级线路查询
    $scope.search0Dest = function (event) {
        //debugger
        var aId = event.currentTarget.lastElementChild.innerText;
        var nghttp = "../../ajax/areaHandler.ashx?fn=getarea2list&aId=" + aId + "";
        $http.get(nghttp).success(function (response) {
            $scope.dest = response.ds;
        })
    }
    //二级线路的选择
    $scope.search1Dest = function (event) {
        //debugger
        //如果有做过特殊关键词链接,则直接跳转不解释.否则就老老实实查询
        if (!event.currentTarget.childNodes[1].innerText) {
            $(".searchtxt")[1].value = event.currentTarget.innerText;
            $(".searchtxt")[1].placeholder = "";
            searchLines();
            return;
        }
        else {
            window.location.href = event.currentTarget.childNodes[1].innerText;
            return;
        }

    }
    var nghttp3 = "../../ajax/areaHandler.ashx?fn=getarealist";
    $http.get(nghttp3).success(function (response) {
        $scope.area = response.ds;
    })

    //查看更多
    $scope.seemore = function (event) {
        //debugger
        var thislineCategory = event.currentTarget.childNodes[0].innerText;
        $('.amore').href = "/app/linelists/" + thislineCategory;
        window.location.href = "#/app/linelists/" + thislineCategory;
    }

    //自加载运行
    $scope.$on("$ionicView.loaded", function () {
        //自动加载播放滚动图片
        //轮播图
        var nghttpgg = "../../ajax/bannerImgHandler.ashx?fn=getbannerimglist&status=true";
        $http.get(nghttpgg).success(function (response) {
            //debugger
            for (var i = 0; i < 4; i++) { //response.ds.length
                var urls;
                if (response.ds[i].lineId === 0) {
                    urls = response.ds[i].H5Url;
                }
                else {
                    urls = "#/app/linedetail/" + response.ds[i].lineId;
                }
                $('#full-width-slider').append('<div class="rsContent"><a href="' + urls + '"><img class="rsImg" src=' + response.ds[i].imgUrl + ' /></a></div>');
            }
            $('#full-width-slider').royalSlider({
                arrowsNav: true,
                loop: false,
                keyboardNavEnabled: true,
                controlsInside: false,
                imageScaleMode: 'fill',
                arrowsNavAutoHide: false,
                autoScaleSlider: true,
                autoScaleSliderWidth: 960,
                autoScaleSliderHeight: 350,
                controlNavigation: 'bullets',
                thumbsFitInViewport: false,
                navigateByClick: true,
                startSlideId: 0,
                autoPlay: false,
                transitionType: 'move',
                globalCaption: true,
                deeplinking: {
                    enabled: true,
                    change: false
                },

                imgWidth: 1400,
                imgHeight: 680
            });
            getPro();
        })

        //初始化二级目的地页面
        var aId = 1;
        var nghttp = "../../ajax/areaHandler.ashx?fn=getarea2list&aId=" + aId + "";
        $http.get(nghttp).success(function (response) {
            $scope.dest = response.ds;
        })

        //空搜关键词
        var nghttp = "../../ajax/areaHandler.ashx?fn=getarea3list";
        $http.get(nghttp).success(function (response) {
            $("#divdesselect .searchtxt").attr('placeholder', response.ds[0].searchName)
        })

    });

})

//线路详情控制器
.controller('lineDetailCtrl', function ($scope, $http, $sce, $ionicScrollDelegate) {
    var url = location.href;
    var lineid = url.substring(url.lastIndexOf('/') + 1, url.length);
    $('.linedetail .ordernow').attr('href', '#/app/indexdate/' + lineid);

    //页面详情页分两种情况返回,三个入口
    $scope.historygoback = function () {
        var ent2detail = getCookie('ent2detail');
        if (ent2detail == "index") {
            window.location.href = "#/app/index";
            location.reload();
        }
        else {
            window.location.href = "#/app/linelists/" + ent2detail;
            //window.location.reload();
            location.reload();
        }
    }

    var nghttp = "../../ajax/apihandler.ashx?fn=getlinedetail&lineid=" + lineid + "";

    //blockmyui('正在加载,请稍后...');
    //$.blockUI({
    //    message: '<h6>正在提交,请稍后...</h6>'
    //});
    //loading层
    var mylayeruiwait = layer.load(1, {
        shade: [0.5, '#ababab'] //0.1透明度的白色背景
    });
    $http.get(nghttp).success(function (response) {
        //$.unblockUI();
        find404admin(response);
        layer.close(mylayeruiwait);
        //团框初始高度
        $(".linedetail .groupsheight").height(16);
        $(".linedetail .groupsinheight").height(16);

        //行程
        if (response.line === null) {
            layermyui('此线路暂无详细数据!', 1500);
            window.location.href = "#/app/index";
            return;
        }
        $scope.linedetails = response.line;
        $scope.journeys = response.line.journeys.sort(sortbydayNumber);
        //行程明细
        //$sce 是 angularJS 自带的安全处理模块，$sce.trustAsHtml(str) 方法便是将数据内容以 html 的形式进行解析并返回。将此过滤器添加到 ng-bind-html 、data-ng-bind-html  所绑定的数据中，便实现了在数据加载时对于 html 标签的自动转义。
        if (response.line.lineFeature !== null)
            $scope.featureContent = $sce.trustAsHtml(response.line.lineFeature.replace(/\n/g, "<br>"));
        if (response.line.priceInclude !== null)
            $scope.priceIncludeContent = $sce.trustAsHtml(response.line.priceInclude.replace(/\n/g, "<br>"));
        if (response.line.priceExclusive !== null)
            $scope.priceExclusiveContent = $sce.trustAsHtml(response.line.priceExclusive.replace(/\n/g, "<br>"));

        //取团日期
        response.line.groups = response.line.groups.sort(sortbydepartDate);
        for (var i = 0; i < response.line.groups.length; i++) {
            for (var i = 0; i < response.line.groups.length; i++) {
                if (i != response.line.groups.length - 1) {
                    response.line.groups[i].departDate = FormatDate(response.line.groups[i].departDate) + ',';
                }
                else
                    response.line.groups[i].departDate = FormatDate(response.line.groups[i].departDate);
            }
        }

        //小于4天先取出4天
        var days4 = new Array(0);
        var daysmore = new Array(0);
        var smalllen;
        if (response.line.groups.length <= 4)
            smalllen = response.line.groups.length;
        else
            smalllen = 4;

        for (var i = 0; i < smalllen; i++) {
            days4.push(response.line.groups[i]);
        }
        $scope.group1 = days4;
        //大于4的话就取出剩余的
        if (response.line.groups.length > 4) {
            for (var i = 4; i < response.line.groups.length; i++) {
                daysmore.push(response.line.groups[i]);
            }
        }
        $scope.group2 = daysmore;

        //团日列表数量
        dayslength = response.line.groups.length;

        //取团号
        $scope.groupcode = '团号:' + response.line.groups[0].groupCode.substring(response.line.groups[0].groupCode.length - 14, response.line.groups[0].groupCode.length);

        //取线路旅游类型
        $scope.lineCategory = getcategoryNameByCode(response.line.lineCategory);

        //取价格
        $scope.price = response.minPrice;
        //产品经理推荐
        $scope.recommend = response.line.recommend; // response.line.recommend.url;

        //取图片
        if (response.line.images[0] === undefined || response.line.images[0] === null || response.line.images[0] === "")
            $scope.image = 'http://img5.imgtn.bdimg.com/it/u=45254662,160915219&fm=21&gp=0.jpg'
        else
            $scope.image = response.line.images[0].url;

        $('.linedetail .idline').show();
        $('.linedetail .idfeature').hide();
        $('.linedetail .idexpense').hide();
        $(".linedetail .tunbl1").addClass("contentblue");
        $(".linedetail .tunbl4").addClass("lineblue");

    });

    $scope.lineCl = function() {
        $('.linedetail .idfeature').hide();
        $('.linedetail .idline').show();
        $('.linedetail .idexpense').hide();
        removeclassblue();
        $('.tunbl1').addClass("contentblue");
        $('.tunbl4').addClass("lineblue");
        $ionicScrollDelegate.resize();
    }

    $scope.featureCl = function() {
        $('.linedetail .idfeature').show();
        $('.linedetail .idline').hide();
        $('.linedetail .idexpense').hide();
        removeclassblue();
        $('.tunbl2').addClass("contentblue");
        $('.tunbl5').addClass("lineblue");
        $ionicScrollDelegate.resize();
    }

    $scope.expenseCl = function () {
        $('.linedetail .idfeature').hide();
        $('.linedetail .idline').hide();
        $('.linedetail .idexpense').show();
        removeclassblue();
        $('.tunbl3').addClass("contentblue");
        $('.tunbl6').addClass("lineblue");
        $ionicScrollDelegate.resize();
    }
})

//日期选择控制器
.controller('indexdateCtrl', function ($scope, $http) {
    $scope.$on("$ionicView.loaded", function () {
        $('.spinner').spinner({});
        $('.spinner2').spinner2({});
        var url = location.href;
        var lineid = url.substring(url.lastIndexOf('/') + 1, url.length);
        var nghttp = "../../ajax/apihandler.ashx?fn=getlinedetail&lineid=" + lineid + "";
        $http.get(nghttp).success(function (response) {
            //debugger
            intoCalendarTime();
            adn = 1;
            crn = 0;
            $("#sp01").click(function () {
                adn = this.children[0].children[1].value;
                $('#nextpick').attr('href', nextpickhref + '/' + adn + '/' + crn);
            });
            $("#sp02").click(function () {
                crn = this.children[0].children[1].value;
                $('#nextpick').attr('href', nextpickhref + '/' + adn + '/' + crn);
            });

            function intoCalendarTime() {
                data = "[";
                for (var i = 0; i < response.line.groups.length; i++) {
                    var date1 = FormatDateYear(response.line.groups[i].departDate);
                    var groupid = response.line.groups[i].id;
                    for (var j = 0; j < response.line.groups[i].prices.length; j++) {
                        if (response.line.groups[i].prices[j].offerType == '基本价')
                            minprice = response.line.groups[i].prices[j].salePrice;
                    }
                    var price1 = "¥" + minprice;
                    data += '{"Date":"' + date1 + '","Price":"' + price1 + '","groupid":"' + groupid + '"},';
                }
                data += "]";
                pickerEvent.setPriceArr(eval("(" + data + ")"));
                pickerEvent.Init("calendar");
            }
        })
    });
})

//选择资源控制器2
.controller('pickresourceCtrl2', function ($scope, $http) {
    var cnum = getpbyurl(1);
    var pnum = getpbyurl(2);
    var groupid = getpbyurl(3);

    $scope.pnum = pnum;
    $('.spinner').spinner({});
    var amount = 0;
    var secureamount = 0;
    $('#secureamount').empty().append('0');

    var nghttp = "../../ajax/apihandler.ashx?fn=queryrealtimerefresh&groupid=" + groupid + "";
    $http.get(nghttp).success(function (response) {
        var cprice;
        var dprice;
        for (var j = 0; j < response.prices.length; j++) {
            if (response.prices[j].offerType == '基本价')
                minprice = response.prices[j].salePrice;
            if (response.prices[j].offerType == '儿童价')
                cprice = response.prices[j].salePrice;
            if (response.prices[j].offerType == '单房差')
                dprice = response.prices[j].salePrice;
        }
        $scope.minprice = minprice;
        if (cprice > 0) {
            $scope.cprice = cprice;
            $('#divchild').css('display', 'block');
        }
        else {
            cprice = 0
            $('#divchild').css('display', 'none');
        }

        if (dprice > 0) {
            $scope.dprice = dprice;
            $('#divdiff').css('display', 'block');
        }
        else {
            dprice = 0
            $('#divdiff').css('display', 'none');
        }

        $scope.date = FormatDateYear(response.departDate);
        $scope.departurePlace = response.departurePlace;
        $scope.lineTitle = response.lineTitle;
        var cancelprice = 50;
        var accidentprice = 80;
        samount1 = 0;
        samount2 = 0;
        $("#checkcancel").click(function () {
            if (this.checked == false) {
                samount1 = 0;
                secureamount -= cancelprice;
            }
            else {
                samount1 = cancelprice;
                secureamount += cancelprice;
            }
            subamount();
            $('#secureamount').empty().append(secureamount);
        });
        $("#checkaccident").click(function () {
            if (this.checked == false) {
                samount2 = 0;
                secureamount -= accidentprice;
            }
            else {
                samount2 = accidentprice;
                secureamount += accidentprice;
            }
            subamount();
            $('#secureamount').empty().append(secureamount);
        });

        roomdiff = 0;
        roomdiffp1 = 0;
        roomdiffp2 = 0;
        $("#sp1").click(function () {
            roomdiffp1 = this.children[0].children[1].value;
            subamount();
        });
        $("#sp2").click(function () {
            roomdiffp2 = this.children[0].children[1].value;
            subamount();
        });
        $("#sp1").change(function () {
            roomdiffp1 = this.children[0].children[1].value;
            subamount();
        });
        $("#sp2").change(function () {
            roomdiffp2 = this.children[0].children[1].value;
            subamount();
        });
        function subamount() {
            roomdiff = dprice * roomdiffp1 + cprice * roomdiffp2 + samount1 * pnum + samount2 * pnum;
            amountall = minprice * pnum + roomdiff;
            $('#amount').empty().append(amountall);
            $('#amountct').empty().append(minprice * pnum);
            $('#nextfill').attr('href', '#/app/fillorder/' + secureamount + '/' + groupid + '/' + pnum + '/' + cnum + '/' + amountall);
        }
        subamount();
    })

})

//填写订单控制器
.controller('fillorderCtrl', function ($scope, $http) {

    var amount = getpbyurl(1);
    var cnum = getpbyurl(2);
    var pnum = getpbyurl(3);
    var groupid = getpbyurl(4);
    var secureamount = getpbyurl(5);

    var Connect = {
        name: '',
        mobile: '',
        email: ''
    };
    $scope.Connect = Connect;

    var priceid;
    var Discount;
    $scope.amount = amount;
    $scope.pnum = pnum;


    var nghttp = "../../ajax/apihandler.ashx?fn=queryrealtimerefresh&groupid=" + groupid + "";
    //loading层
    var mylayeruiwait = layer.load(1, {
        shade: [0.5, '#ababab'] //0.1透明度的白色背景
    });
    $http.get(nghttp).success(function (response) {
        find404admin(response);
        layer.close(mylayeruiwait);
        $scope.lineTitle = response.lineTitle;
        $scope.date = FormatDateYear(response.departDate);
        for (var j = 0; j < response.prices.length; j++) {
            if (response.prices[j].offerType == '基本价')
                priceid = response.prices[j].id;
        }
        Discount = response.onlineDiscount;

        //出现的出行人行数.
        var arrayGuests = new Array(0);
        for (var i = 0; i < pnum; i++) {
            arrayGuests.push(i);
        }
        $scope.guests = arrayGuests;

        //$.unblockUI();
    })

    var guestsarr = new Array(0);
    $scope.createorder = function () {
        //blockmyui('正在加载,请稍后...');
        var ConnectName = $scope.Connect.name;
        var ConnectMobile = $scope.Connect.mobile;
        var ConnectEmail = $scope.Connect.email;
        if (ConnectName == "" || ConnectName == undefined || ConnectName == null) {
            layermyui('请输入联系人');
            return;
        }
        if (ConnectMobile == "" || ConnectMobile == undefined || ConnectMobile == null) {
            layermyui('请输入手机号');
            return;
        }
        if (ConnectEmail == "" || ConnectEmail == undefined || ConnectEmail == null) {
            layermyui('请输入邮箱');
            return;
        }
        if (!isEmail(ConnectEmail)) {
            layermyui('邮箱格式不正确');
            return;
        }

        $('.inname:first')[0].value = ConnectName;

        function CGuest(category, name) {
            this.category = category;
            this.name = name;
        }
        var p = new CGuest();
        p = new CGuest('ADULT', $('.inname:first')[0].value);
        guestsarr.push(p);
        //debugger
        for (var i = 1 ; i < pnum; i++) {
            try {
                p = new CGuest('ADULT', $('.inname')[i].value);
                guestsarr.push(p);
            }
            catch (e) { }
        }

        //p = new CGuest('ADULT', 'guest3');
        //guestsarr.push(p);
        //p = new CGuest('ADULT', 'guest4');
        //guestsarr.push(p);
        //p = new CGuest('ADULT', 'guest5');
        //guestsarr.push(p);

        var gueststring = "";
        for (var i = 0; i < pnum; i++) {
            gueststring += "{\"category\":\"" + guestsarr[i].category + "\",\"name\":\"" + guestsarr[i].name + "\"},";
        }
        gueststring = gueststring.substring(0, gueststring.length - 1);

        var discountAmount = Math.floor(amount * (1 - Discount));
        //动态成人数.
        //debugger
        var mcMemberCode = getCookie('mcMemberCode');
        //debugger
        json = "{\"adultNum\":" + pnum + ",\"amount\":" + amount + ",\"channel\":\"E_BUSINESS_PLATFORM\",\"childNum\":0,\"contact\":{\"mobile\":\"" + ConnectMobile + "\",\"name\":\"" + ConnectName + "\",\"email\":\"" + ConnectEmail + "\"},\"couponAmount\":0,\"groupId\":" + groupid + ",\"guests\":[" + gueststring + "],\"mcMemberCode\":\"" + mcMemberCode + "\",\"cardNo\":\"1231234\",\"onLinePay\":true,\"receivables\":[{\"copies\":" + pnum + ",\"discountAmount\":" + discountAmount + ",\"priceId\":" + priceid + ",\"singlePrice\":" + amount / pnum + "}],\"scorePay\":false}";
        //2人
        //json = "{\"adultNum\":" + pnum + ",\"amount\":" + amount + ",\"channel\":\"E_BUSINESS_PLATFORM\",\"childNum\":0,\"contact\":{\"mobile\":\"" + ConnectMobile + "\",\"name\":\"" + ConnectName + "\",\"email\":\"" + ConnectEmail + "\"},\"couponAmount\":0,\"groupId\":" + groupid + ",\"guests\":[{\"category\":\"" + guestsarr[0].category + "\",\"name\":\"" + guestsarr[0].name + "\"},{\"category\":\"" + guestsarr[1].category + "\",\"name\":\"" + guestsarr[1].name + "\"}],\"mcMemberCode\":\"1231234\",\"cardNo\":\"1231234\",\"onLinePay\":true,\"receivables\":[{\"copies\":" + pnum + ",\"discountAmount\":" + discountAmount + ",\"priceId\":" + priceid + ",\"singlePrice\":" + amount / pnum + "}],\"scorePay\":false}";
        //1人
        //json = "{\"adultNum\":1,\"amount\":" + amount + ",\"channel\":\"E_BUSINESS_PLATFORM\",\"childNum\":0,\"contact\":{\"mobile\":\"" + ConnectMobile + "\",\"name\":\"" + ConnectName + "\",\"email\":\"" + ConnectEmail + "\"},\"couponAmount\":0,\"groupId\":" + groupid + ",\"guests\":[{\"category\":\"" + guestsarr[0].category + "\",\"name\":\"" + guestsarr[0].name + "\"}],\"mcMemberCode\":\"1231234\",\"cardNo\":\"1231234\",\"onLinePay\":true,\"receivables\":[{\"copies\":1,\"discountAmount\":" + discountAmount + ",\"priceId\":" + priceid + ",\"singlePrice\":" + amount + "}],\"scorePay\":false}";


        //loading层
        var mylayeruiwait = layer.load(1, {
            shade: [0.5, '#ababab'] //0.1透明度的白色背景
        });
        $.ajax({
            url: "../../ajax/apihandler.ashx?fn=createorder&json=" + json + "",
            type: "post",
            success: function (text) {
                //debugger
                layer.close(mylayeruiwait);
                var errormsg = finderrorMsgadmin(text);
                if (errormsg) {
                    if (errormsg == "mcMemberCode不能为空!") {
                        //把参数存入cookie
                        setCookie('amount', amount, 1);
                        setCookie('cnum', cnum, 1);
                        setCookie('pnum', pnum, 1);
                        setCookie('groupid', groupid, 1);
                        setCookie('secureamount', secureamount, 1);
                        //将跳回支付该产品的cookie
                        //debugger
                        setCookie('linkbackpay', 'true', 1);
                        //跳转至登录页
                        window.location.href = '#/app/user/login';
                        return;
                    }
                    else {
                        layermyui(errormsg, 3000);
                        return;
                    }
                }
                //出行人只显示成人,有几人就设置几个cookiename
                for (var i = 0; i < pnum; i++) {
                    setCookie('inname' + i, $('.inname')[i].value, 1);
                }
                //$.unblockUI();
                var d = eval("(" + text + ")");
                //debugger
                setCookie('orderNo', d.orderNo, 1);
                window.location.href = '#/app/payway/' + secureamount + '/' + groupid + '/' + pnum + '/' + cnum + '/' + amount;
            }
        });
    }

})

//支付方式控制器
.controller('paywayCtrl', function ($scope, $http) {
    //blockmyui('正在加载,请稍后...');
    //清除登录用户cookie
    //setCookie('mcMemberCode','',1);
    var amount = getpbyurl(1);
    var cnum = getpbyurl(2);
    var pnum = getpbyurl(3);
    var groupid = getpbyurl(4);
    var secureamount = getpbyurl(5);
    $scope.amount = amount;
    var nghttp = "../../ajax/apihandler.ashx?fn=queryrealtimerefresh&groupid=" + groupid + "";
    //loading层
    var mylayeruiwait = layer.load(1, {
        shade: [0.5, '#ababab'] //0.1透明度的白色背景
    });
    $http.get(nghttp).success(function (response) {
        //debugger
        find404admin(response);
        layer.close(mylayeruiwait);
        var minprice;
        for (var j = 0; j < response.prices.length; j++) {
            if (response.prices[j].offerType == '基本价')
                minprice = response.prices[j].salePrice;
        }
        $scope.minprice = minprice;
        $scope.secureamount = secureamount;
        $scope.groupCode = response.groupCode;
        $scope.lineTitle = response.lineTitle;
        $scope.pnum = pnum;
        $scope.departDate = FormatDateYear(response.departDate);
        $scope.timepay = FormatDateTimeDiff(3600000);


        //出行人只显示成人,有几人就显示几个cookiename-----------st
        var arrayinname = new Array(0);
        function CGuest(name) {
            this.name = name;
        }
        for (var i = 0; i < pnum; i++) {
            p = new CGuest(getCookie('inname' + i));
            arrayinname.push(p);
        }
        $scope.inname = arrayinname;

        $('.innamebox').height(60 + 31 * (pnum - 2));
        //出行人只显示成人,有几人就显示几个cookiename-----------ed

        //$.unblockUI();

        var accountName = '';
        $scope.pay = function () {
            if (accountName == "") {
                layermyui('请选择支付方式');
                return;
            }
            //首先做身份认证,判断是否已经登录,没有帐号的客户先注册.
            var mcMemberCode = getCookie('mcMemberCode');
            if (mcMemberCode != "" && mcMemberCode != undefined && mcMemberCode != null) {
                //其次再是发起付款
                var orderNo = getCookie('orderNo');
                var nghttp = "../../ajax/apihandler.ashx?fn=pbppayorder&orderNo=" + orderNo + "&payAmount=" + amount + "&accountName=" + accountName + "";
                //loading层
                var mylayeruiwait = layer.load(1, {
                    shade: [0.5, '#ababab'] //0.1透明度的白色背景
                });
                $http.get(nghttp).success(function (response) {
                    layer.close(mylayeruiwait);
                    window.location.href = response;
                })
            }
            else {
                //把参数存入cookie
                setCookie('amount', amount, 1);
                setCookie('cnum', cnum, 1);
                setCookie('pnum', pnum, 1);
                setCookie('groupid', groupid, 1);
                setCookie('secureamount', secureamount, 1);
                //将跳回支付该产品的cookie
                //debugger
                setCookie('linkbackpay', 'true', 1);
                //跳转至登录页
                window.location.href = '#/app/user/login';
            }

        }
        $scope.paywaySelect = function ($event) {
            if ($event.target.parentNode.previousElementSibling.innerText == '支付宝')
                accountName = 'INNS_APP_CLIENT_ALI_WAP_PAY';
            else if ($event.target.parentNode.previousElementSibling.innerText == '微信支付')
                accountName = 'JJE_APP_WECHAT_PAY';
            else
                accountName = 'INNS_APP_CLIENT_ALI_WAP_PAY';
        }

    })

})

//取消订单控制器
.controller('cancelorderCtrl', function ($scope, $http) {
    // var ordercode = "1000160512000007";
    var nghttp = "../../ajax/apihandler.ashx?fn=cancelorder&ordercode=111";
    $http.get(nghttp).success(function (response) {
        // debugger

    });
})


//***************************以下公用方法***************************


function costdetail() {
    $(".black_overlay").css('display', 'block');
    $("#costdetail").css('display', 'block');
}

function costdetailnone() {
    $(".black_overlay").css('display', 'none');
    $("#costdetail").css('display', 'none');
}

var dayslength;
var counting = 0;
//更多团日期
function moredays() {
    counting++;
    if (counting % 2 == 1) {
        var moha = dayslength / 4;
        if (moha <= 1) {
            $(".linedetail .groupsheight").height(16);
            $(".linedetail .groupsinheight").height(16);
            $(".daysgroup2").slideToggle();
            return;
        }
        else {
            $(".linedetail .groupsheight").height(5 + 20 * moha);
            $(".linedetail .groupsinheight").height(5 + 20 * moha);
            $(".daysgroup2").slideToggle();
        }

    }
    else {
        $(".linedetail .groupsheight").height(16);
        $(".linedetail .groupsinheight").height(16);
        $(".daysgroup2").slideToggle();
    }

}
//城市选择框
function citySelect() {
    $('#divcontent').hide();
    $('#bartitle').hide();
    $('#divcityselect').show();

    $('#divcityselect').click(function (event) {
        if (event.target.nodeName === 'SPAN') {
            $('#divcontent').show();
            $('#bartitle').show();
            $('#divcityselect').hide();
            $("#beginProtxt")[0].placeholder = event.target.innerText + '出发';
        }
    })
}

//线路查询传参,前台点击事件
function searchLines() {
    var searchParam;
    if ($(".searchtxt")[1].placeholder !== "")
        searchParam = $(".searchtxt")[1].placeholder;
    else
        searchParam = $(".searchtxt")[1].value;
    window.location.href = '#/app/linelists?search=' + searchParam;
}

function removeclassblue() {
    $('.thirdCenter').removeClass("contentblue");
    $('.thirdCenter').removeClass("lineblue");
}
function addclassblue(q, i) {
    $('.thirdCenter:eq(' + q + ')').addClass("contentblue");
    $('.thirdCenter:eq(' + i + ')').addClass("lineblue");
}
