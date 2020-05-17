# -*- coding:utf-8 -*-

from project import app, db
from models import Image, User, Comment, Fabulous
from flask import render_template, redirect, request, flash, get_flashed_messages, send_from_directory
import random, hashlib, json, uuid, os
from flask_login import login_user, logout_user, login_required, current_user
from qiniusdk import qiniu_upload_file


@app.route('/index/images/<int:page>/<int:per_page>/')
def index_images(page, per_page):
    paginate = Image.query.order_by(db.desc(Image.id)).paginate(page=page, per_page=per_page, error_out=False)
    map = {'has_next': paginate.has_next}
    images = []
    for image in paginate.items:
        fabulous = []
        for i in range(0, len(image.fabulous)):
            fab = image.fabulous[i]
            fabulous.append({'user_id': fab.user_id})
        comments = []
        for i in range(0, min(2, len(image.comments))):
            comment = image.comments[i]
            comments.append({'username': comment.user.username, 'user_id': comment.user_id, 'content': comment.content})
        imgvo = {'id': image.id,
                 'url': image.url,
                 'comment_count': len(image.comments),
                 'fabulous_count': len(image.fabulous),
                 'fabulous': fabulous,
                 'user_id': image.user_id,
                 'head_url': image.user.head_url,
                 'user_username': image.user.username,
                 'created_date': str(image.created_date),
                 'comments': comments}
        images.append(imgvo)

    map['images'] = images
    return json.dumps(map)


@app.route('/admin_index/')
def index2():
    return render_template('admin/index.html')


@app.route('/admin_index/user/')
def user():
    users = User.query.order_by(db.desc(User.id)).all()
    return render_template('admin/user.html', users=users)


@app.route('/admin_index/comment/')
def comment():
    comments = Comment.query.order_by(db.desc(Comment.id)).all()
    return render_template('admin/comment.html', comments=comments)


@app.route('/admin_index/fabulous/')
def fabulous():
    fabulous = Fabulous.query.order_by(db.desc(Fabulous.id)).all()
    return render_template('admin/fabulous.html', fabulous=fabulous)


@app.route('/admin_index/image/')
def images():
    images = Image.query.order_by(db.desc(Image.id)).all()
    return render_template('admin/image.html', images=images)


@app.route('/')
def index():
    paginate = Image.query.order_by(db.desc(Image.id)).paginate(page=1, per_page=10)
    # images = Image.query.order_by(db.desc(Image.id)).limit(20).all()
    return render_template('index.html', image=image, has_next=paginate.has_next, images=paginate.items)


@app.route('/image/<int:image_id>/')
@login_required
def image(image_id):
    image = Image.query.get(image_id)
    if image == None:
        return redirect('/')
    fabulous = []
    fabs = Fabulous.query.filter_by(image_id=image_id).all()
    for i in fabs:
        ivo = {'user_id': i.user_id}
        fabulous.append(ivo)
    paginate = Comment.query.filter_by(image_id=image_id).order_by(db.desc(Comment.id)).paginate(page=1, per_page=10)
    return render_template('pageDetail.html', image=image, fabulous=fabulous, has_next=paginate.has_next,
                           comments=paginate.items)


@app.route('/image/comments/<int:image_id>/<int:page>/<int:per_page>/')
def image_images(image_id, page, per_page):
    # 参数检查
    paginate = Comment.query.filter_by(image_id=image_id).order_by(db.desc(Comment.id)).paginate(page=page,
                                                                                                 per_page=per_page,
                                                                                                 error_out=False)
    map = {'has_next': paginate.has_next}
    comments = []
    for comment in paginate.items:
        comgvo = {'head_url': comment.user.head_url, 'content': comment.content, 'user_id': comment.user_id,
                  'username': comment.user.username}
        comments.append(comgvo)
    map['comments'] = comments
    return json.dumps(map)


@app.route('/profile/<int:user_id>/')
@login_required
def profile(user_id):
    user = User.query.get(user_id)
    if user == None:
        return redirect('/')
    paginate= Image.query.filter_by(user_id=user_id).order_by(db.desc(Image.id)).paginate(page=1, per_page=3)

    fabus = Fabulous.query.filter_by(user_id=user_id).all()
    fabus_images = []
    for image in fabus:
        fabus_images.append(Image.query.filter_by(id=image.image_id).all())

    f_images = []
    for f in fabus_images:
        for i in f:
            f_images.append(i)
    return render_template('profile.html', user=user, has_next=paginate.has_next, images=paginate.items,
                           f_images=f_images)


@app.route('/profile/images/<int:user_id>/<int:page>/<int:per_page>/')
def user_images(user_id, page, per_page):
    # 参数检查
    paginate = Image.query.filter_by(user_id=user_id).order_by(db.desc(Image.id)).paginate(page=page, per_page=per_page,
                                                                                           error_out=False)
    map = {'has_next': paginate.has_next}
    images = []
    for image in paginate.items:
        imgvo = {'id': image.id, 'url': image.url, 'comment_count': len(image.comments),
                 'fab_count': len(image.fabulous)}
        images.append(imgvo)
    map['images'] = images
    return json.dumps(map)


@app.route('/profile/images')
def images_fabulous():
    fabus = Fabulous.query.filter_by(user_id=126).all()
    f_images = []
    for fabu in fabus:
        f_images.append(Image.query.filter_by(image_id=fabu.image_id))

    for image in f_images:
        imgvo = {'id': image.id, 'url': image.url, 'comment_count': len(image.comments),
                 'fab_count': len(image.fabulous)}
        images.append(imgvo)
    map['images'] = images
    return json.dumps(map)


@app.route('/regloginpage/')
def regloginpage():
    msg = ''
    # if current_user.is_authenticated:
    #     return redirect('/')
    for m in get_flashed_messages(with_categories=False, category_filter=['reglogin']):
        msg = msg + m
    # 如果已经登录的就跳到首页
    return render_template('login.html', msg=msg, next=request.values.get('next'))


def redirect_with_msg(target, msg, category):
    if msg != None:
        flash(msg, category=category)
    return redirect(target)


@app.route('/login/', methods={'get', 'post'})
def login():
    username = request.values.get('username').strip()
    password = request.values.get('password').strip()
    # 校验
    # user = User.query.filter_by(username=username).first()
    if username == '' or password == '':
        return redirect_with_msg('/regloginpage', u'用户名和密码不能为空', 'reglogin')

    user = User.query.filter_by(username=username).first()
    if user == None:
        return redirect_with_msg('/regloginpage', u'用户名不存在', 'reglogin')

    m = hashlib.md5()
    m.update(password + user.salt)
    if m.hexdigest() != user.password:
        return redirect_with_msg('/regloginpage', u'密码错误', 'reglogin')

    login_user(user)

    next = request.values.get('next')
    if next != None and next.startswith('/'):
        return redirect(next)

    return redirect('/')


@app.route('/reg/', methods={'get', 'post'})
def reg():
    # args url里的
    # form body里的
    # values 全部
    username = request.values.get('username').strip()
    password = request.values.get('password').strip()
    # 校验
    if username == '' or password == '':
        return redirect_with_msg('/regloginpage', u'用户名和密码不能为空', 'reglogin')

    user = User.query.filter_by(username=username).first()
    if user != None:
        return redirect_with_msg('/regloginpage', u'用户名已存在', 'reglogin')

    salt = ''.join(random.sample('0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10))
    m = hashlib.md5()
    m.update(password + salt)
    password = m.hexdigest()
    user = User(username, password, salt)
    db.session.add(user)
    db.session.commit()
    login_user(user)

    next = request.values.get('next')
    if next != None and next.startswith('/'):
        return redirect(next)
    return redirect('/')

    # 请大家考虑更多边界问题


@app.route('/logout')
def logout():
    logout_user()
    return redirect('/regloginpage')


@app.route('/image/<image_name>')
def view_image(image_name):
    return send_from_directory(app.config['UPLOAD_DIR'], image_name)


@app.route('/add/comment/', methods={'post'})
@login_required
def add_comment():
    image_id = int(request.values['image_id'])
    content = request.values['content']
    comment = Comment(content, image_id, current_user.id)
    db.session.add(comment)
    db.session.commit()
    return json.dumps({"code": 0, "id": comment.id,
                       "content": comment.content,
                       "user_head_url": comment.user.head_url,
                       "username": comment.user.username,
                       "user_id": comment.user_id})


@app.route('/add/fabulous/', methods={'post'})
@login_required
def add_fabulous():
    image_id = int(request.values['image_id'])
    # 未赞过，赞一下
    fabulous = Fabulous(image_id, current_user.id)
    db.session.add(fabulous)
    db.session.commit()
    return json.dumps({"code": 0, "user_id": fabulous.user_id})


@app.route('/delete/fabulous/', methods={'post'})
@login_required
def delete_fabulous():
    image_id = int(request.values['image_id'])
    # 赞过，取消
    fabu = Fabulous.query.filter_by(image_id=image_id).filter_by(user_id=current_user.id).all()
    for i in fabu:
        db.session.delete(i)
        db.session.commit()
    return json.dumps({"code": 0})


def save_to_qiniu(file, file_name):
    return qiniu_upload_file(file, file_name)


def save_to_local(file, file_name):
    save_dir = app.config['UPLOAD_DIR']
    file.save(os.path.join(save_dir, file_name))
    return '/image/' + file_name


@app.route('/upload/', methods={"post"})
@login_required
def upload():
    file = request.files['file']
    # http://werkzeug.pocoo.org/docs/0.10/datastructures/
    # 需要对文件进行裁剪等操作
    file_ext = ''
    if file.filename.find('.') > 0:
        file_ext = file.filename.rsplit('.', 1)[1].strip().lower()
    if file_ext in app.config['ALLOWED_EXT']:
        file_name = str(uuid.uuid1()).replace('-', '') + '.' + file_ext
        # url = qiniu_upload_file(file, file_name)
        url = save_to_local(file, file_name)
        if url != None:
            db.session.add(Image(url, current_user.id))
            db.session.commit()

    return redirect('/profile/%d' % current_user.id)


@app.route('/upload/avatar/', methods={"post"})
@login_required
def upload_avatar():
    file = request.files['file']
    file_ext = ''
    if file.filename.find('.') > 0:
        file_ext = file.filename.rsplit('.', 1)[1].strip().lower()
    if file_ext in app.config['ALLOWED_EXT']:
        file_name = str(uuid.uuid1()).replace('-', '') + '.' + file_ext
        # url = qiniu_upload_file(file, file_name)
        url = save_to_local(file, file_name)
        if url != None:
            User.query.filter_by(id=current_user.id).update({'head_url': url})
            db.session.commit()

    return redirect('/profile/%d' % current_user.id)


@app.route('/delete/img/<int:image_id>', methods={"post"})
@login_required
def delete_img(image_id):
    image = Image.query.get(image_id)
    if image == None:
        return redirect('/')
    comment = Comment.query.filter_by(image_id=image_id).order_by(Comment.id).all()
    for i in comment:
        db.session.delete(i)
        db.session.commit()
    fabu = Fabulous.query.filter_by(image_id=image_id).order_by(Fabulous.id).all()
    for i in fabu:
        db.session.delete(i)
        db.session.commit()
    db.session.delete(image)
    db.session.commit()

    return redirect('/profile/%d' % current_user.id)


@app.route('/api/fabulou/update', methods={'post'})
def fabulouUpdate():
    fid = int(request.values['id'])
    imageId = int(request.values['image_id'])
    userId = int(request.values['user_id'])
    fabu = Fabulous.query.filter_by(id=fid).first()
    fabu.image_id = imageId
    fabu.user_id = userId
    db.session.add(fabu)
    db.session.commit()
    return json.dumps({"code": 0, "id": fid, "image_id": imageId, "user_id": userId})


@app.route('/api/fabulou/add', methods={'post'})
def fabulouAdd():
    image_id = int(request.values['image_id'])
    user_id = int(request.values['user_id'])
    fabulous = Fabulous(image_id, user_id)
    db.session.add(fabulous)
    db.session.commit()
    return json.dumps({"code": 0, "id": fabulous.id})


@app.route('/delete/fabulou/<int:id>', methods={"post"})
def deleteFabulou(id):
    fabu = Fabulous.query.filter_by(id=id).first()
    if fabu == None:
        return json.dumps({"code": 0, "type": "deleteFabulou", "id": id})
    db.session.delete(fabu)
    db.session.commit()
    return redirect('http://127.0.0.1:8001/admin_index/fabulous/')
    # json.dumps({"code": 0, "type": "deleteFabulou", "id": id})


@app.route('/update/fabulou/<int:id>/<int:image_id>/<int:user_id>', methods={"post"})
def updateFabulou(id, image_id, user_id):
    fabu = Fabulous.query.filter_by(id=id).first()
    if fabu == None:
        return json.dumps(
            {"code": 1, "type": "updateFabulou error id 不存在", "id": id, "image_id": image_id, "user_id": user_id})
    fabu = Fabulous.query.filter_by(id=id).first()
    fabu.image_id = image_id
    fabu.user_id = user_id
    db.session.add(fabu)
    db.session.commit()
    return redirect('http://127.0.0.1:8001/admin_index/fabulous/')


@app.route('/delete/image/<int:id>', methods={"post"})
def deleteImage(id):
    image = Image.query.filter_by(id=id).first()
    if image == None:
        return json.dumps({"code": 0, "type": "deleteImage", "id": id})
    db.session.delete(image)
    db.session.commit()
    return redirect('http://127.0.0.1:8001/admin_index/image/')


@app.route('/api/image/add', methods={'post'})
def imageAdd():
    url = request.values['url']
    user_id = int(request.values['user_id'])
    image = Image(url, user_id)
    db.session.add(image)
    db.session.commit()
    return json.dumps({"code": 0, "id": image.id})


@app.route('/api/image/update', methods={'post'})
def imageUpdate():
    id = int(request.values['id'])
    url = request.values['url']
    userId = int(request.values['user_id'])
    image = Image.query.filter_by(id=id).first()
    image.url = url
    image.user_id = userId
    db.session.add(image)
    db.session.commit()
    return json.dumps({"code": 0, "id": id, "url": url, "user_id": userId})


@app.route('/delete/comment/<int:id>', methods={"post"})
def deleteComment(id):
    comment = Comment.query.filter_by(id=id).first()
    if comment == None:
        return json.dumps({"code": 0, "type": "deleteComment", "id": id})
    db.session.delete(comment)
    db.session.commit()
    return redirect('http://127.0.0.1:8001/admin_index/comment/')


@app.route('/api/comment/add', methods={'post'})
def commentAdd():
    content = request.values['content']
    image_id = int(request.values['image_id'])
    user_id = int(request.values['user_id'])
    comment = Comment(content, image_id, user_id)
    db.session.add(comment)
    db.session.commit()
    return json.dumps({"code": 0, "id": comment.id})


@app.route('/api/comment/update', methods={'post'})
def commentUpdate():
    id = int(request.values['id'])
    content = request.values['content']
    imageId = int(request.values['image_id'])
    userId = int(request.values['user_id'])
    comment = Comment.query.filter_by(id=id).first()
    comment.content = content
    comment.image_id = imageId
    comment.user_id = userId
    db.session.add(comment)
    db.session.commit()
    return json.dumps({"code": 0, "id": id, "content": content, "image_id": imageId, "user_id": userId})


@app.route('/delete/user/<int:id>', methods={"post"})
def deleteUser(id):
    user = User.query.filter_by(id=id).first()
    if user == None:
        return json.dumps({"code": 0, "type": "deleteUser", "id": id})
    db.session.delete(user)
    db.session.commit()
    return redirect('http://127.0.0.1:8001/admin_index/user/')


@app.route('/api/user/add', methods={'post'})
def userAdd():
    username = request.values['username']
    password = request.values['password']

    salt = ''.join(random.sample('0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10))
    m = hashlib.md5()
    m.update(password + salt)
    password = m.hexdigest()

    user = User(username, password, salt)
    db.session.add(user)
    db.session.commit()
    return json.dumps({"code": 0, "id": user.id})


@app.route('/api/user/update', methods={'post'})
def userUpdate():
    id = int(request.values['id'])
    username = request.values['username']
    password = request.values['password']
    user = User.query.filter_by(id=id).first()
    user.username = username

    salt = ''.join(random.sample('0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10))
    m = hashlib.md5()
    m.update(password + salt)
    password = m.hexdigest()

    user.password = password
    user.salt = salt
    db.session.add(user)
    db.session.commit()
    return json.dumps({"code": 0, "id": id, "username": username, "password": password})
