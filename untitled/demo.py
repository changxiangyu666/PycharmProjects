# -*- encoding=UTF-8 -*-
import random
import re


def demo_string():
    stra = 'hello world'
    print stra.capitalize()
    print stra.replace('world', 'nowcoder')
    strb = '   \n\rhello nowcoder  \r\n'
    print 1, strb.lstrip()
    print 2, strb.rstrip()
    strc = 'hello w'
    print 3, strc.startswith('hel')
    print 4, strc.endswith('w')
    print 5, stra + strb + strc
    print 6, len(strc)
    print 7, '-'.join(['a', 'b', 'c'])
    print 8, strc.split(' ')
    print 9, strc.find('ello')


def demo_operation():
    print 1, 1 + 2, 5 / 3, 10 - 4, 6 * 6, 17 % 4
    print 2, True, not True
    print 3, 1 < 2, 3 > 2
    print 4, 2 << 3
    print 5, 5 | 3, 5 & 3, 5 ^ 3
    x = 2
    y = 3.3
    print x, y, type(x), type(y)


def demo_buildinfunction():
    print 1, max(2, 1), min(5, 3)
    print 2, len('qweer'), len([1, 2, 3])
    print 3, abs(-4)
    print 4, range(1, 10, 3)
    print 5, dir(list)
    x = 2
    print 6, eval('x+3')
    print 7, chr(65), ord('a')
    print 8, divmod(11, 3)  # 11/3=3余2


def demo_controlflow():
    score = 65
    if score > 90:
        print 1, 'A'
    elif score > 60:
        print 2, 'B'
    else:
        print 3, 'C'

    while score < 100:
        print score
        score += 10

    # for(int i=0;i<10;i++)
    # continue,bresk,pass
    for i in range(0, 10, 2):
        if i == 0:
            pass
        if i < 5:
            continue
        print 4, i
        if i == 6:
            break


def demo_list():
    lista = [1, 2, 3]
    print 1, lista
    listb = ['a', 3, 'c', 1.1]
    print 2, listb
    lista.extend(listb)
    print 3, lista
    print 4, len(lista)
    print 5, 'a' in listb
    lista = lista + listb
    print 6, lista
    listb.insert(0, 'www')
    print 7, listb
    listb.pop(1)
    print 8, listb
    listb.reverse()
    print 9, listb
    print 10, listb[0], listb[1]
    listb.sort()
    print 11, listb
    listb.sort(reverse=True)
    print 12, listb
    print 13, listb * 2
    print 14, [0] * 14
    tuplea = (1, 2, 3)  # 只读的
    listaa = [1, 2, 3]
    listaa.append(4)
    print 15, listaa


def add(a, b):
    return a + b


def sub(a, b):
    return a - b


def demo_dict():
    dicta = {4: 16, 1: 1, 2: 4, 3: 9}
    print 1, dicta
    print 2, dicta.keys(), dicta.values()
    print 3, dicta.has_key(1), dicta.has_key('3')
    for key, value in dicta.items():
        print 'key:', key, 'value:', value
    dictb = {'+': add, '-': sub}
    print 4, dictb['+'](1, 2)
    print 5, dictb.get('-')(15, 3)
    dictb['*'] = 'x'
    print dictb
    dicta.pop(4)
    print 6, dicta
    del dicta[1]
    print 7, dicta


def demo_set():
    seta = set((1, 2, 3))
    setb = set((2, 3, 4))
    print 1, seta
    seta.add(4)
    print 2, seta
    print 3, seta.intersection(setb), seta & setb
    print 4, seta | setb, seta.union(setb)
    print 5, seta - setb
    print 6, len(seta)
    print 7, seta.isdisjoint(set((1, 2)))


def demo_exception():
    try:
        print 2 / 1
        raise Exception('Raise Error', 'NowCoder')
    except Exception as e:
        print 'error:', e
    finally:
        print 'clean up'


def demo_random():
    # random.seed(1)#每次都是一样的随机数
    print 1, int(random.random() * 100)
    print 2, random.randint(0, 200)
    print 3, random.choice(range(0, 100, 10))
    print 4, random.sample(range(0, 100), 4)
    a = [1, 2, 3, 4, 5]
    random.shuffle(a)
    print 5, a


def demo_re():
    str = 'adds12312xcvdf54cbgf878'
    p1 = re.compile('[\d]+')
    p2 = re.compile('\d')
    print 1, p1.findall(str)
    print 2, p2.findall(str)

    str = 'q@163.com;s@gmail.com;12sdd@qq.com'
    p3 = re.compile('[\w]+@[163|qq]+\.com')
    print 3, p3.findall(str)

    str = '<html><head>title</head><body>2141245324</body></html>'
    p4 = re.compile('<head>[^<]+</head>')
    print 4, p4.findall(str)
    p4 = re.compile('<head>([^<]+)</head>')
    print 5, p4.findall(str)
    print 5/2


if __name__ == '__main__':
    # demo_string()
    # demo_operation()
    # demo_buildinfunction()
    # demo_controlflow()
    # demo_list()
    # demo_dict()
    # demo_set()
    # demo_exception()
    # demo_random()
    demo_re()
