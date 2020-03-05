# -*- encoding=UTF-8 -*-
from flask_script import Manager

from demo2 import app

manager = Manager(app)


@manager.option('-n', '--name', dest='name', default='nowcoder')
def hello(name):
    print "hello", name


@manager.command
def initialize_database():
    # 初始化数据库
    print 'database ...'


if __name__ == "__main__":
    manager.run()
