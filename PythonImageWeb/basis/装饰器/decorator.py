# -*- encoding=UTF-8 -*-

def log(level, *args, **kvargs):
    def inner(func):
        '''
        * 用来传递任意个无名字参数，这些参数会以一个Tuple的形式访问
        ** 用来传递任意个有名字的参数，这些参数用dict来访问
        '''

        def wrapper(*args, **kvargs):
            print level, 'before calling ', func.__name__
            print level, 'args', args, 'kvargs', kvargs
            func(*args, **kvargs)
            print level, 'end calling ', func.__name__

        return wrapper

    return inner


@log(level='INFO')
def hello(name, age):
    print 'hello', name, age


if __name__ == '__main__':
    hello(age=2, name='nowcoder')  # = log(level='INFO')(hello())
