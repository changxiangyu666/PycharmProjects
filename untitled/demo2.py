# -*- encoding=UTF-8 -*-

from flask import Flask, render_template, request, make_response, redirect, flash, get_flashed_messages
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
app.jinja_env.line_statement_prefix = '#'  # template语法开头是‘#’
app.secret_key = 'nowcoder'  # 通过session唯一标识


@app.route('/index/')
@app.route('/')
def index():
    res = ''
    for msg, category in get_flashed_messages(with_categories=True):
        res = res + category + msg + '<br>'
    res += 'hello'
    return res


@app.route('/profile/<int:uid>/', methods=['get', 'post'])
def profile(uid):
    colors = ('red', 'green', 'yellow')
    infos = {'nowcode': 'abc', 'poople': 'def'}
    return render_template('profile.html', uid=uid, colors=colors, infos=infos)


@app.route('/request')
def request_demo():
    key = request.args.get('key', 'defaultkey')
    res = request.args.get('key', 'defaultkey') + '<br>'
    res = res + request.url + '----------' + request.path + '<br>'
    for property in dir(request):
        res = res + str(property) + '=======<br>' + str(eval('request.' + property)) + '<br>'
    response = make_response(res)
    response.set_cookie('nowcoderid', key)
    response.headers['nowcoder'] = 'hello~~'
    return response


@app.route('/newpath')
def newpath():
    return 'newpath'


@app.route('/re/<int:code>')
def redirect_demo(code):
    return redirect('/newpath', code=code)


@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html', url=request.url), 404


@app.route('/login')
def login():
    app.logger.info('log success')
    flash('登录成功', 'info')
    return redirect('/')


@app.route('/log/<level>/<msg>/')
def log(level, msg):
    dict = {'info': logging.INFO, 'warn': logging.WARN, 'error': logging.ERROR}
    if dict.has_key(level):
        app.logger.log(dict[level], msg)
    return 'logged:' + msg


def set_logger():
    info_file_handler = RotatingFileHandler('C:\\logs\\info.txt')
    info_file_handler.setLevel(logging.INFO)
    app.logger.addHandler(info_file_handler)

    warn_file_handler = RotatingFileHandler('C:\\logs\\warn.txt')
    warn_file_handler.setLevel(logging.WARN)
    app.logger.addHandler(warn_file_handler)

    error_file_handler = RotatingFileHandler('C:\\logs\\error.txt')
    error_file_handler.setLevel(logging.ERROR)
    app.logger.addHandler(error_file_handler)


if __name__ == '__main__':
    set_logger()
    app.run(debug=True)
