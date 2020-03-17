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
        var that = this;
        // 常用元素
        that.listEl = $('div.js-image-list');
        that.listUl = $('ul.js-discuss-list');
        // 初始化数据
        // that.uid = window.mid;
        that.page = 1;
        that.pageSize = 20;
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
            page: that.page + 1,
            pageSize: that.pageSize,
            call: function (oResult) {
                // 是否有更多数据
                that.listHasNext = !!oResult.has_next && (oResult.images || []).length > 0;
                // 更新当前页面
                that.page++;
                // 渲染数据
                var sHtml = '';
                var uHtml = '';
                $.each(oResult.images, function (nIndex, oImage) {
                    sHtml += that.tpl([
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
                                        '<div class="lianjie">',
                                            '<a class="heart"></a>',
                                           '<span class="comsp"> 0 &nbsp;&nbsp;次赞</span>',
                                        '</div>',
                                        '<div class="lianjie">',
                                            '<a class="com" href="/image/#{id}"></a>',
                                            '<span class="comsp">#{comment_count}&nbsp;&nbsp;条评论</span>',
                                        '</div>',
                                    '</li>',
                                    '<ul class=#{id} id="shuaxin"></ul>',
                                    // $.each(oResult.images, function (nIndex, oImage) {
                                    //     var comments=oImage.comments;
                                    //     $.each(comments, function (nIndex, oImage) {
                                    //         if(comments.length>2){
                                    //             return;
                                    //         }
                                    //         uHtml += that.tpl([
                                    //             '<li>',
                                    //                 '<a class="_4zhc5 _iqaka" title="#{oImage.username}" href="/profile/#{oImage.user_id}" data-reactid=".0.1.0.0.0.2.1.2:$comment-17856951190001917.1">#{oImage.username}</a>',
                                    //                 '<span>',
                                    //                     '<span>#{oImage.content}</span>',
                                    //                 '</span>',
                                    //             '</li>'
                                    //         ].join(''), oImage);
                                    //     });
                                    //     uHtml && that.listUl.append(uHtml);
                                    // }),
                                '</ul>',
                                '<section class="discuss-edit">',
                                    '<form>',
                                        '<input placeholder="添加评论..." type="text" class="jsCmt" id=#{id}>',
                                    '</form>',
                                    '<button class="more-info" value=#{id} onmousedown="fInitialize()">更多选项</button>',
                                    '<script type="text/javascript">' +
                                    'function fInitialize() {\n' +
                                    '        let that = this;\n' +
                                    '        clearInterval(that.timeId);'+
                                    '        // 点击添加评论\n' +
                                    '        var bSubmit = false;\n' +
                                    '        $(\'.more-info\').one(\'click\', function() {\n' +
                                    '            let sImageId = this.value;\n' +
                                    '            let oCmtIpt = $(\'#\'+sImageId+\'\');\n' +
                                    '            let sId = oCmtIpt.attr("id");\n' +
                                    '            let oListDv = $(\'.\'+sImageId+\'\');\n' +
                                    '            let sCmt = $.trim(oCmtIpt.val());\n' +
                                    '            // 评论为空不能提交\n' +
                                    '            if (!sCmt) {\n' +
                                    '                return alert(\'评论不能为空\');\n' +
                                    '            }\n' +
                                    '            // 上一个提交没结束之前，不再提交新的评论\n' +
                                    '            if (bSubmit) {\n' +
                                    '                return;\n' +
                                    '            }\n' +
                                    '            bSubmit = true;\n' +
                                    '            $.ajax({\n' +
                                    '                url: \'/add/comment/\',\n' +
                                    '                type: \'post\',\n' +
                                    '                dataType: \'json\',\n' +
                                    '                data: {image_id: sImageId, content: sCmt}\n' +
                                    '            }).done(function (oResult) {\n' +
                                    '                if (oResult.code !== 0) {\n' +
                                    '                    return alert(oResult.msg || \'提交失败，请重试\');\n' +
                                    '                }\n' +
                                    '                // 清空输入框\n' +
                                    '                oCmtIpt.val(\'\');\n' +
                                    '                // 渲染新的评论\n' +
                                    '                var nHtml = [\n' +
                                    '                    \'<li>\',\n' +
                                    '                        \'<a class="_4zhc5 _iqaka" title="\', oResult.username, \'" href="/profile/\', oResult.user_id, \'">\', oResult.username, \'</a> \',\n' +
                                    '                        \'<span><span>\', sCmt, \'</span></span>\',\n' +
                                    '                    \'</li>\'].join(\'\');\n' +
                                    '                oListDv.prepend(nHtml);\n' +
                                    '            }).fail(function (oResult) {\n' +
                                    '                alert(oResult.msg || \'提交失败，请重试!\');\n' +
                                    '            }).always(function () {\n' +
                                    '                bSubmit = false;\n' +
                                    '            });\n' +
                                                'oListDv.show().delay(2000).fadeOut();'+//2秒后弹窗消失
                                    '        });\n' +
                                        '$(function () {'+
                                            'that.timeId=setInterval(function () {'+
                                                //window.location.reload();//刷新当前页面
                                                '$(\'#shuaxin\').load(location.href + " #shuaxin");'+//注意后面DIV的ID前面的空格，很重要！没有空格的话，会出双眼皮！（也可以使用类名）
                                            '}, 2000);'+//2秒自动刷新
                                        '})'+
                                    '    }</script>',
                                '</section>',
                            '</div>',
                        '</article>'
                    ].join(''), oImage);
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
