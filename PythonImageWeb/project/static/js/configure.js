// 思考如何实现,在点击弹出按钮之后,弹出两个标签
    //首先,找标签,注意这个地方是通过id处理的
    var b1Ele=document.getElementById('b1')
    //其次,处理事件,单击button之后,找到类属性,移除类列表中的隐藏属性
    b1Ele.onclick=function (ev) {
        document.getElementsByClassName('cover')[0].classList.remove('hide');
        document.getElementsByClassName('modal')[0].classList.remove('hide');
        //移除样式
    }

    var s1Ele=document.getElementById('s1')
    //其次,处理事件,单击button之后,找到类属性,添加类列表中的隐藏属性
    s1Ele.onclick=function (ev) {
        document.getElementsByClassName('cover')[0].classList.add('hide');
        document.getElementsByClassName('modal')[0].classList.add('hide');
        //移除样式
    }