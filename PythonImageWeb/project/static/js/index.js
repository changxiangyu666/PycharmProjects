$(function () {
    var oExports = {
        initialize: fInitialize,
        // 渲染更多数据
        renderMore: fRenderMore,
        // 请求数据
        requestData: fRequestData,
        // 简单的模板替换
        tpl: fTpl
    };
    // 初始化页面脚本
    oExports.initialize();

    function fInitialize() {
        let that = this;
        // 常用元素
        that.listEl = $('div.js-image-list');
        // 初始化数据
        that.cuid=window.cuid;
        that.page = 1;
        that.pageSize = 10;
        that.listHasNext = true;
        // 绑定事件
        $('.js-load-more').on('click', function (oEvent) {
            var oEl = $(oEvent.currentTarget);
            var sAttName = 'data-load';
            // 正在请求数据中，忽略点击事件
            if (oEl.attr(sAttName) === '1') {
                return;
            }
            // 增加标记，避免请求过程中的频繁点击
            oEl.attr(sAttName, '1');
            that.renderMore(function () {
                // 取消点击标记位，可以进行下一次加载
                oEl.removeAttr(sAttName);
                // 没有数据隐藏加载更多按钮
                !that.listHasNext && oEl.hide();
            });
        });
    }

    function fRenderMore(fCb) {
        var that = this;
        // 没有更多数据，不处理
        if (!that.listHasNext) {
            return;
        }
        that.requestData({
            cuid: that.cuid,
            page: that.page + 1,
            pageSize: that.pageSize,
            call: function (oResult) {
                // 是否有更多数据
                that.listHasNext = !!oResult.has_next && (oResult.images || []).length > 0;
                // 更新当前页面
                that.page++;
                // 渲染数据
                var sHtml = '';
                $.each(oResult.images, function (nIndex, oImage) {
                    let sHtml_part1 = that.tpl([
                        '<article class="mod">',
                            '<header class="mod-hd">',
                                '<time class="time">#{created_date}</time>',
                                '<a href="/profile/#{user_id}" class="avatar">',
                                    '<img src="#{head_url}?imageView/1/w/40/h/40">',
                                '</a>',
                                '<div class="profile-info">',
                                    '<a title="#{user_username}" href="/profile/#{user_id}">#{user_username}</a>',
                                '</div>',
                            '</header>',
                            '<div class="mod-bd">',
                                '<div class="img-box">',
                                    '<a href="/image/#{id}">',
                                        '<img src="#{url}">',
                                    '</a>',
                                '</div>',
                            '</div>',
                            '<div class="mod-ft">',
                                '<ul class="discuss-list">',
                                    '<li class="more-discuss">',
                                        '<div class="lianjie jiazai">'].join(''), oImage);
                                            let sHtml_part2 = '';
                                            // 解析点赞列表中的数据
                                            for (var fi = 0; fi < oImage['fabulous'].length; fi++) {
                                                if (oImage['fabulous'][fi]['user_id'] === cuid) {
                                                    sHtml_part2 += that.tpl([
                                                        '<div class="heart-box"><button class="icobutton icobutton--thumbs-up" value=#{id} onmousedown="initheart()"><span class="after-heart"></span></button></div>',
                                                    ].join(''), oImage);
                                                }
                                            }
                                    let sHtml_part3 = that.tpl([
                                            '<div class="heartBox"><button class="icobutton icobutton--thumbs-up" value=#{id} onmousedown="initheart()"><span class="heart"></span></button></div>',
                                            '<span class="comsp">#{fabulous_count}&nbsp;&nbsp;次赞</span>',
                                        '</div>',
                                        '<script type="text/javascript">' +
                                            function initheart() {
                                                $(".icobutton").one('click', function () {
                                                    let sImageId = this.value;
                                                    //var text_box = $('.'+sImageId+'');
                                                    if ($(this).children('span').attr("class") === ("heart")) {
                                                        $(this).html("<span class=\"after-heart\"></span>");
                                                        //text_box.show().html("<em class='add-animation'>+1</em>");
                                                        $(".add-animation").addClass("hover");
                                                        $.ajax({
                                                            url: '/add/fabulous/',
                                                            type: 'post',
                                                            dataType: 'json',
                                                            data: {image_id: sImageId},
                                                        })
                                                    } else {
                                                        $(this).html("<span class=\"heart\"></span>");
                                                        //text_box.show().html("<em class='add-animation'>-1</em>");
                                                        $(".add-animation").removeClass("hover");
                                                        $.ajax({
                                                            url: '/delete/fabulous/',
                                                            type: 'post',
                                                            dataType: 'json',
                                                            data: {image_id: sImageId},
                                                        })
                                                    }
                                                });
                                            },
                                        '</script>',
                                        '<div class="lianjie">',
                                            '<a class="com" href="/image/#{id}"></a>',
                                            '<span class="comsp">#{comment_count}&nbsp;&nbsp;条评论</span>',
                                        '</div>',
                                    '</li>',
                                    '<ul class=#{id} id="shuaxin"></ul>',
                                //     ].join(''), oImage);
                                //     let sHtml_part4 = '';
                                //     // 解析评论列表中的数据
                                //     for (var ci = 0; ci < oImage['comments'].length; ci++){
                                //         let dict = {'comment_user_username':oImage['comments'][ci]['username'],
                                //                     'comment_user_id':oImage['comments'][ci]['user_id'],
                                //                     'comment_content':oImage['comments'][ci]['content'] };
                                //         sHtml_part4 += that.tpl([
                                //         '    <li>',
                                //             '    <a class="_4zhc5 _iqaka" title="#{comment_user_username}" href="/profile/#{comment_user_id}" data-reactid=".0.1.0.0.0.2.1.2:$comment-17856951190001917.1">#{comment_user_username}</a>',
                                //             '    <span>',
                                //             '        <span>#{comment_content}</span>',
                                //            '     </span>',
                                //          '   </li>',
                                //         ].join(''), dict);
                                //     }
                                // let sHtml_part5 = that.tpl([
                                '</ul>',
                                '<section class="discuss-edit">',
                                    '<form>',
                                        '<input placeholder="添加评论..." type="text" class="jsCmt" id=#{id}>',
                                    '</form>',
                                    '<button class="more-info" value=#{id} onmousedown="fInitialize()">更多选项</button>',
                                    '<script type="text/javascript">' +
                                        function fInitialize() {
                                            let that = this;
                                            clearInterval(that.timeId);
                                            // 点击添加评论
                                            var bSubmit = false;
                                            $('.more-info').off().one('click', function() {
                                                let sImageId = this.value;
                                                let oCmtIpt = $('#'+sImageId+'');
                                                let oListDv = $('.'+sImageId+'');
                                                let sCmt = $.trim(oCmtIpt.val());
                                                // 评论为空不能提交
                                                if (!sCmt) {
                                                    return alert('评论不能为空');
                                                }
                                                // 上一个提交没结束之前，不再提交新的评论
                                                if (bSubmit) {
                                                    return;
                                                }
                                                bSubmit = true;
                                                $.ajax({
                                                    url: '/add/comment/',
                                                    type: 'post',
                                                    dataType: 'json',
                                                    data: {image_id: sImageId, content: sCmt},
                                                }).done(function (oResult) {
                                                    if (oResult.code !== 0) {
                                                        return alert(oResult.msg || '提交失败，请重试');
                                                    }
                                                    // 清空输入框
                                                    oCmtIpt.val('');
                                                    // 渲染新的评论
                                                    var sHtml = [
                                                        '<li>',
                                                            '<a class="_4zhc5 _iqaka" title="', oResult.username, '" href="/profile/', oResult.user_id, '">', oResult.username, '</a> ',
                                                            '<span><span>', sCmt, '</span></span>',
                                                        '</li>'].join('');
                                                    oListDv.prepend(sHtml);
                                                }).fail(function (oResult) {
                                                    alert(oResult.msg || '提交失败，请重试!');
                                                }).always(function () {
                                                    bSubmit = false;
                                                });
                                                oListDv.show().delay(2000).fadeOut();//2秒后弹窗消失
                                                $(function () {
                                                    that.timeId=setInterval(function () {
                                                        $('#shuaxin').load(location.href + " #shuaxin");//注意后面DIV的ID前面的空格，很重要！没有空格的话，会出双眼皮！（也可以使用类名）
                                                    }, 2000);//2秒自动刷新
                                                });
                                            });
                                        },
                                    '</script>',
                                '</section>',
                            '</div>',
                        '</article>'
                    ].join(''), oImage);
                    sHtml += sHtml_part1 + sHtml_part2 + sHtml_part3;
                });
                sHtml && that.listEl.append(sHtml);
            },
            error: function () {
                alert('出现错误，请稍后重试');
            },
            always: fCb
        });
    }

    function fRequestData(oConf) {
        var that = this;
        var sUrl = '/index/images/' + oConf.page + '/' + oConf.pageSize + '/';
        $.ajax({url: sUrl, dataType: 'json'}).done(oConf.call).fail(oConf.error).always(oConf.always);
    }

    function fTpl(sTpl, oData) {
        var that = this;
        sTpl = $.trim(sTpl);
        return sTpl.replace(/#{(.*?)}/g, function (sStr, sName) {
            return oData[sName] === undefined || oData[sName] === null ? '' : oData[sName];
        });
    }
});
