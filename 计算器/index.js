var Boo = false;  //判断是否按下计算符号的布尔变量；
var result = 0;  //存储计算数据的变量
function $(x) {
    return document.getElementById(x)
}

function check() {
    // var txt = $('jg');
    // var p = /[^0-9]/;
    // if (p.test(txt.value) === true) {
    //     txt.value = "";
    // }
}

function num(Num) {
    var txt = $('jg');
    if (Boo) {
        txt.value += Num;
        Boo = false;
    } else {
        if (txt.value === '0') {
            txt.value = Num;
        } else {
            txt.value += Num;
        }
    }
}

function compute(op) {
    var txt = $('jg');
    txt.value += op;
    Boo = true;
}

var i = 0;

//求一个表达式的值
function cal2(expr) {
    i = 0;
    var result = term_value(expr);
    var more = true;
    while (more) {
        var op = expr[i];
        if (op === '+' || op === '-') {
            i++;
            var value = term_value(expr);
            if (op === '+')
                result += value;
            else
                result -= value;
        } else more = false;
    }
    return result;
}

function term_value(expr) {
    var result = factor_value(expr);
    while (true) {
        var op = expr[i];
        if (op === '*' || op === '/') {
            i++;
            var value = factor_value(expr);
            if (op === '*') result *= value;
            else result /= value;
        } else break;
    }
    return result;
}

function factor_value(expr) {
    var result = 0;
    var c = expr[i];
    while (c <= '9' && c >= '0') {
        result = 10 * result + parseInt(c, 10);
        i++;
        c = expr[i];
    }
    return result;
}

function error() {
    var txt = $('jg');
    if (txt.value.length > 64) {
        txt.value = '';
        $('jg').placeholder = 'Error:"输入字符串总长度不超过64位"';
        return false;
    } else {
        var hasYsf = false;//是否有运算符
        var len = 0;//判断单个数字长度的下标
        // if (txt.value[0] <= '9' && txt.value[0] >= '0') {
        //     len++;
        // } else {
        //     txt.value = '';
        //     $('jg').placeholder = 'Error:"首位不是数字"';
        // }
        for (var i = 0; i < txt.value.length; i++) {
            if (txt.value[i] <= '9' && txt.value[i] >= '0') {
                hasYsf = false;
                len++;
            } else {
                len = 0;
                if (!hasYsf) hasYsf = true;
                else {
                    txt.value = '';
                    $('jg').placeholder = 'Error:"不符合四则运算法则，出现连续的运算符"';
                    return false;
                }
            }
            if (len > 10) {
                txt.value = '';
                $('jg').placeholder = 'Error:"单个数字位数不能大于10"';
                return false;
            }

        }
    }
    return true;
}

function results() {
    var txt = $('jg');
    //txt.value = '789-78*49/7+52*4+85+78+8';//622
    //txt.value = '789-78*49/7+52*4';//451
    //txt.value = '45-8-9/3+89*5';//479
    //txt.value='123233333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333';
    //txt.value='12+26**789';
    //txt.value='124565465756768+2';
    var flag = error();
    if (flag) {
        result = cal2(txt.value);
        $('jg').value = result;
    }

}

//清除
function qc() {
    var txt = $('jg');
    txt.value = '0';
    Boo = false;
    result = 0;
}

//退格
function backspace() {
    var txt = $('jg');
    txt.value = txt.value.slice(0, txt.value.length - 1);
    if (txt.value === '') {
        txt.value = 0
    }
}