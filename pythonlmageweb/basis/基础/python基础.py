# -*-coding:utf-8-*-
import random
import re


def demo_string():
    str1 = 'hello world'
    print str1.capitalize()
    print str1.replace('world', 'yuer')
    str2 = '  \n\rhello world  \r\n'
    print 1, str2.lstrip()  # remove unview char what on it's left
    print 2, str2.rstrip()
    str3 = 'hello cjx'
    print 3, str3.startswith('he')
    print 4, str3.endswith('cjx')
    print 5, str3 + str2 + str1
    print 6, len(str3)
    print 7, '-'.join(['a', 'b', 'c'])
    print 8, str3.split(' ')


def demo_buildinfuncition():
    print range(1, 9, 3)[1, 4, 7]
    print dir(list)
    x = 2
    print eval('x + 3')  # 5
    print chr(97), ord('a')  # a 97
    print divmod(13, 4)  # (3, 1)


def demo_controlflow():
    score = 85
    if score > 99:
        print 'A'
    elif score > 60:
        print 'B'
    else:
        print 'C'

    while score < 100:
        print score
        score += 10

    for i in range(0, 8, 2):
        if i == 4:
            pass
        if i < 4:
            continue
        print i
        if i == 6:
            break


def demo_list():
    lista = [1, 2, 3]
    print lista
    listb = ['a', 1, 2.2]
    print listb
    lista.extend(listb)
    print lista
    print len(listb)
    print('a' in listb)
    listc = listb + lista
    print(listc)
    listb.insert(0, 'www')
    print(listb)
    listb.pop(1)
    print(listb)
    listb.reverse()
    print(listb)
    print(listb[0], listb[1])
    listb.sort()
    print(listb)
    listb.sort(reverse=True)
    print(listb)
    print(listb * 2)  # ['www', 2.2, 1, 'www', 2.2, 1]
    print([0] * 10)
    tuplea = (1, 2, 3)  # tuple is readonly datestructor
    listaa = [1, 2, 3]
    listaa.append(4)
    print(tuplea)
    print(listaa)


def add(a, b):
    return a + b


def sub(a, b):
    return a - b


def demo_dict():
    dicta = {4: 16, 1: 1, 2: 4, 3: 9}
    print(1, dicta)
    print(2, dicta.keys(), dicta.values())
    print(3, dicta.has_key(1), dicta.has_key('3'))
    for k, v in dicta.items():
        print('key-value:', k, v)
    dictb = {'+': add, '-': sub}
    print(4, dictb['+'](1, 2))
    print(4, dictb.get('-')(1, 2))
    dictb['*'] = 'x'
    print(dictb)
    dicta.pop(3)
    print(dicta)
    del dicta[1]
    print(dicta)


def demo_set():
    seta = set((1, 2, 3))
    setb = set((2, 3, 4))
    print(1, seta)
    print(2, seta.intersection(setb), seta & setb)
    print(3, seta | setb, seta.union(setb))
    print(4, seta - setb, seta.difference(setb))
    seta.add('x')
    print(seta)
    print(len(seta))


class User:
    type = 'USER'

    def __init__(self, name, uid):
        self.name = name
        self.uid = uid

    def __repr__(self):
        return 'im ' + self.name + ' ' + str(self.uid)


class Admin(User):
    type = 'ADMIN'

    def __init__(self, name, uid, group):
        User.__init__(self, name, uid)
        self.group = group

    def __repr__(self):
        return 'im ' + self.name + ' ' + str(self.uid) + ' ' + self.group


def create_user(type):
    if type == 'USER':
        return User('u1', 1)
    elif type == 'ADMIN':
        return Admin('a1', 101, 'g1')
    else:
        raise ValueError('error')


def demo_exception():
    try:
        print(2 / 1)
        print(2 / 0)
        raise Exception('Raise Error', 'code')
    except Exception as e:
        print('error:', e)
    finally:
        print('clean up')


def demo_random():
    '''
    random.seed(1)设置随机数种子
    出题时，给每个用户分发一个‘种子’，按照种子把试题顺序打乱，判题机按照种子打分
    '''
    print(1, int(random.random() * 100))
    print(2, random.randint(0, 200))
    print 3, random.choice(range(1, 100))
    print(4, random.sample(range(0, 100), 5))
    a = [1, 2, 3, 4, 5]
    random.shuffle(a)  # 打乱
    print(5, a)


def demo_re():
    str = 'asd123qwe45ipo789'
    p1 = re.compile('[\d]+')
    p2 = re.compile('\d+')
    p3 = re.compile('\d')
    print(1, p1.findall(str))
    print(2, p2.findall(str))
    print(3, p3.findall(str))
    str = 'a@163.com,b@gmail.com,1@qq.com'
    p4 = re.compile('[\w]+@163\.com')
    print(p4.findall(str))
    p5 = re.compile('[\w]+@[163|qq]+\.com')
    print(p5.findall(str))

    str = '<html><h>title</h><body>text</body></html>'
    p6 = re.compile('<h>[^<]+</h>')
    p7 = re.compile('<h>([^<]+)+</h>')
    p8 = re.compile('<h>([^<]+)+</h><body>([^<]+)+</body>')
    print(p6.findall(str))
    print(p7.findall(str))
    print(p8.findall(str))

    str = 'xx2019/09/14xx'
    p9 = re.compile('\d{4}/\d{2}/\d{2}')
    print(p9.findall(str))


if __name__ == '__main__':
    '''
    user1 = User('u1', 1)
    print(user1)
    admin1 = Admin('a1', 101, 'g1')
    print(admin1)

    print(create_user('USER'))
    '''
    # print 'hello world'
    # comment
    # demo_string()
    # demo_buildinfuncition()
    # demo_controlflow()
    # demo_list()
    # demo_dict()
    # demo_set()
    # demo_exception()
    # demo_random()
    demo_re()
