#-*-coding:utf-8-*-

from project import app

if __name__ == '__main__':
    app.run(debug=True, port=8001)
    # app.run(host='127.0.0.1', port=8080)