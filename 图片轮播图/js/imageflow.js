function ImageFlow() {
    /* 设置默认展示图片 */
    this.defaults =
        {
            animationSpeed: 50,             /* 动画速度（毫秒） */
            aspectRatio: 2.3,          /* ImageFlow容器的纵横比（宽度除以高度）*/
            buttons: false,          /* 切换导航按钮 */
            circular: true,          /* 切换圆形旋转 */
            imageCursor: 'pointer',      /* 所有图像的光标类型-默认为“pointer” */
            ImageFlowID: 'starsIF',    /* ImageFlow容器的默认id */
            imageFocusMax: 3,              /* 左右二侧图片数量 */
            imagePath: '',             /* 相对于reflect\php脚本的图像路径 */
            imageScaling: true,           /* 切换图像缩放 */
            imagesHeight: 0.65,           /* 高宽比例 */
            imagesM: 1.2,            /* 图片深度 */
            opacity: false,          /* 切换图像不透明度 */
            opacityArray: [10, 8, 6, 4, 2],   /* 图像不透明度（范围：0到10）第一个值用于聚焦图像 */
            percentLandscape: 118,            /* 比例尺横向格式 */
            percentOther: 120,            /* 缩放纵向和方形格式 */
            preloadImages: true,           /* 切换加载栏（false:需要img属性height和width） */
            reflections: true,           /* 切换反射 */
            reflectionP: 0.5,            /* 反射高度，以源图像的百分比表示 */
            scrollbarP: 0.6,            /* 滚动条的宽度（百分比） */
            slider: true,           /* 切换滑块 */
            sliderCursor: 'e-resize',     /* 滑块光标类型-默认为“默认” */
            sliderWidth: 14,             /* 滑块宽度（px） */
            slideshow: true,          /* 切换幻灯片放映 */
            slideshowSpeed: 3000,           /* 幻灯片之间的时间（毫秒） */
            slideshowAutoplay: true,          /* 启动时切换自动幻灯片播放 */
            startID: 1,              /* 图像ID以开头 */
            glideToStartID: true,           /* 切换滑动动画以开始ID */
            startAnimation: false,          /* 启动时设置从右侧移入的图像的动画 */
            xStep: 90             /* px中x轴上的步长 */
        };

    var my = this;

    /* 初始化 ImageFlow */
    this.init = function (options) {
        for (var name in my.defaults) {
            this[name] = (options !== undefined && options[name] !== undefined) ? options[name] : my.defaults[name];
        }

        /* 获取元素 */
        var ImageFlowDiv = document.getElementById(my.ImageFlowID);
        if (ImageFlowDiv) {
            ImageFlowDiv.style.visibility = 'visible';
            this.ImageFlowDiv = ImageFlowDiv;

            /* 创建HTML结构 */
            if (this.createStructure()) {
                this.imagesDiv = document.getElementById(my.ImageFlowID + '_images');
                this.navigationDiv = document.getElementById(my.ImageFlowID + '_navigation');
                this.scrollbarDiv = document.getElementById(my.ImageFlowID + '_scrollbar');
                this.sliderDiv = document.getElementById(my.ImageFlowID + '_slider');
                this.buttonNextDiv = document.getElementById(my.ImageFlowID + '_next');
                this.buttonPreviousDiv = document.getElementById(my.ImageFlowID + '_previous');
                this.buttonSlideshow = document.getElementById(my.ImageFlowID + '_slideshow');

                    this.indexArray = [];
                this.current = 0;
                 this.imageID = 0;
                this.target = 0;
                this.memTarget = 0;
                this.firstRefresh = true;
                this.busy = false;

                /* 设置ImageFlow容器的高度并使加载条居中 */
                var width = this.ImageFlowDiv.offsetWidth;
                var height = Math.round(width / my.aspectRatio);
                document.getElementById(my.ImageFlowID + '_loading_txt').style.paddingTop = ((height * 0.5) - 22) + 'px';
                ImageFlowDiv.style.height = height + 'px';

                /* 初始加载进度 */
                this.loadingProgress();
            }
        }
    };

    this.createStructure = function () {
        /* 创建图像div容器 */
        var imagesDiv = my.Helper.createDocumentElement('div', 'images');

        /* 将所有图像移到images div */
        var node, version, src, imageNode;
        var max = my.ImageFlowDiv.childNodes.length;
        for (var index = 0; index < max; index++) {
            node = my.ImageFlowDiv.childNodes[index];
            if (node && node.nodeType === 1 && node.nodeName === 'IMG') {
                /* 兼容IE低版本返回相对路径 */
                if (my.reflections === true) {
                    src = my.imagePath + node.getAttribute('src', 2);
                    node.setAttribute('src', src);
                }

                imageNode = node.cloneNode(true);
                imagesDiv.appendChild(imageNode);
            }
        }

        /* 克隆更多的图像，使循环动画成为可能 */
        if (my.circular) {
            /* 创建临时元素以保存克隆的图像 */
            var first = my.Helper.createDocumentElement('div', 'images');
            var last = my.Helper.createDocumentElement('div', 'images');

            /* 确保有足够的图像可以使用循环模式 */
            max = imagesDiv.childNodes.length;
            if (max < my.imageFocusMax) {
                my.imageFocusMax = max;
            }

            /* 如果只有一个图像，不克隆任何内容 */
            if (max > 1) {
                /* 克隆第一个和最后一个图像 */
                var i;
                for (i = 0; i < max; i++) {
                    /* 每边的克隆数等于imageFocusMax */
                    node = imagesDiv.childNodes[i];
                    if (i < my.imageFocusMax) {
                        imageNode = node.cloneNode(true);
                        first.appendChild(imageNode);
                    }
                    if (max - i < my.imageFocusMax + 1) {
                        imageNode = node.cloneNode(true);
                        last.appendChild(imageNode);
                    }
                }

                /* 按以下顺序对图像节点排序：last | originals | first */
                for (i = 0; i < max; i++) {
                    node = imagesDiv.childNodes[i];
                    imageNode = node.cloneNode(true);
                    last.appendChild(imageNode);
                }
                for (i = 0; i < my.imageFocusMax; i++) {
                    node = first.childNodes[i];
                    imageNode = node.cloneNode(true);
                    last.appendChild(imageNode);
                }

                /* 用新的顺序覆盖imagesDiv */
                imagesDiv = last;
            }
        }

        /* 创建幻灯片按钮div并将其附加到images div */
        if (my.slideshow) {
            var slideshowButton = my.Helper.createDocumentElement('div', 'slideshow');
            imagesDiv.appendChild(slideshowButton);
        }

        /* 创建加载文本容器 */
        var loadingP = my.Helper.createDocumentElement('p', 'loading_txt');
        var loadingText = document.createTextNode(' ');
        loadingP.appendChild(loadingText);

        /* 创建加载div容器 */
        var loadingDiv = my.Helper.createDocumentElement('div', 'loading');

        /* 在loading div中创建loading bar div容器 */
        var loadingBarDiv = my.Helper.createDocumentElement('div', 'loading_bar');
        loadingDiv.appendChild(loadingBarDiv);

        /* 在滚动条div中创建slider和button div容器 */
        var scrollbarDiv = my.Helper.createDocumentElement('div', 'scrollbar');
        var sliderDiv = my.Helper.createDocumentElement('div', 'slider');
        scrollbarDiv.appendChild(sliderDiv);
        if (my.buttons) {
            var buttonPreviousDiv = my.Helper.createDocumentElement('div', 'previous', 'button');
            var buttonNextDiv = my.Helper.createDocumentElement('div', 'next', 'button');
            scrollbarDiv.appendChild(buttonPreviousDiv);
            scrollbarDiv.appendChild(buttonNextDiv);
        }

        /* 在images div下面创建导航div容器 */
        var navigationDiv = my.Helper.createDocumentElement('div', 'navigation');
        navigationDiv.appendChild(scrollbarDiv);

        /* 更新文档结构并在成功时返回true */
        var success = false;
        if (my.ImageFlowDiv.appendChild(imagesDiv) &&
            my.ImageFlowDiv.appendChild(loadingP) &&
            my.ImageFlowDiv.appendChild(loadingDiv) &&
            my.ImageFlowDiv.appendChild(navigationDiv)) {
            /* 移除images div之外的图像节点 */
            max = my.ImageFlowDiv.childNodes.length;
            for (index = 0; index < max; index++) {
                node = my.ImageFlowDiv.childNodes[index];
                if (node && node.nodeType === 1 && node.nodeName === 'IMG') {
                    my.ImageFlowDiv.removeChild(node);
                }
            }
            success = true;
        }
        return success;
    };


    /* 调用刷新函数 */
    this.loadingProgress = function () {
        /* 启动时调用刷新一次以显示图像 */
        my.refresh();

        /* 仅当有多个图像时初始化导航元素 */
        if (my.max > 1) {
            /* 初始化鼠标、触摸和按键支持 */
            my.MouseWheel.init();
            my.Touch.init();
            my.Key.init();

            /* 切换幻灯片放映 */
            if (my.slideshow) {
                my.Slideshow.init();
            }
        }
    };

    /* 缓存仅在刷新或调整窗口大小时更改的所有内容 */
    this.refresh = function () {
        /* 缓存全局变量 */
        this.imagesDivWidth = my.imagesDiv.offsetWidth + my.imagesDiv.offsetLeft;
        this.maxHeight = Math.round(my.imagesDivWidth / my.aspectRatio);
        this.maxFocus = my.imageFocusMax * my.xStep;
        this.size = my.imagesDivWidth * 0.5;
        this.scrollbarWidth = (my.imagesDivWidth - (Math.round(my.sliderWidth))) * my.scrollbarP;
        this.imagesDivHeight = Math.round(my.maxHeight * my.imagesHeight);

        /* 更改imageflow div属性 */
        my.ImageFlowDiv.style.height = my.maxHeight + 'px';

        /* 更改图像div属性 */
        my.imagesDiv.style.height = my.imagesDivHeight + 'px';

        /* 更改导航分区div属性 */
        my.navigationDiv.style.height = (my.maxHeight - my.imagesDivHeight) + 'px';

        /* 更改滚动条div属性 */
        my.scrollbarDiv.style.width = my.scrollbarWidth + 'px';
        my.scrollbarDiv.style.marginTop = Math.round(my.imagesDivWidth * 0.02) + 'px';
        my.scrollbarDiv.style.marginLeft = Math.round(my.sliderWidth + ((my.imagesDivWidth - my.scrollbarWidth) / 2)) + 'px';

        /* 设置滑块属性 */
        my.sliderDiv.style.cursor = my.sliderCursor;

        if (my.buttons) {
            my.buttonPreviousDiv.onclick = function () {
                my.MouseWheel.handle(1);
            };
            my.buttonNextDiv.onclick = function () {
                my.MouseWheel.handle(-1);
            };
        }

        /* 设置反射乘法器 */
        var multi = (my.reflections === true) ? my.reflectionP + 1 : 1;

        /* 设置图像属性 */
        var max = my.imagesDiv.childNodes.length;
        var i = 0;
        var image = null;
        for (var index = 0; index < max; index++) {
            image = my.imagesDiv.childNodes[index];
            if (image !== null && image.nodeType === 1 && image.nodeName === 'IMG') {
                this.indexArray[i] = index;

                /* 设置图像属性以存储值 */
                image.i = i;

                /* 仅将宽度和高度作为属性添加一次 */
                if (my.firstRefresh) {
                    if (image.getAttribute('width') !== null && image.getAttribute('height') !== null) {
                        image.w = image.getAttribute('width');
                        image.h = image.getAttribute('height') * multi;
                    } else {
                        image.w = image.width;
                        image.h = image.height;
                    }
                }

                /* 检查源图像格式。获取图像高度减去反射高度！ */
                if ((image.w) > (image.h / (my.reflectionP + 1))) {
                    /* 横向格式 */
                    image.pc = my.percentLandscape;
                    image.pcMem = my.percentLandscape;
                } else {
                    /* 纵向和方形格式 */
                    image.pc = my.percentOther;
                    image.pcMem = my.percentOther;
                }

                /* 更改图像定位 */
                if (my.imageScaling === false) {
                    image.style.position = 'relative';
                    image.style.display = 'inline';
                }

                /* 设置图像光标类型 */
                image.style.cursor = my.imageCursor;
                i++;
            }
        }
        this.max = my.indexArray.length;

        /* 基于第一个图像覆盖动态大小 */
        if (my.imageScaling === false) {
            image = my.imagesDiv.childNodes[my.indexArray[0]];

            /* 为第一个图像设置左填充 */
            this.totalImagesWidth = image.w * my.max;
            image.style.paddingLeft = (my.imagesDivWidth / 2) + (image.w / 2) + 'px';

            /* 覆盖图像和导航分区高度 */
            my.imagesDiv.style.height = image.h + 'px';
            my.navigationDiv.style.height = (my.maxHeight - image.h) + 'px';
        }

        /* 第一次刷新时处理startID */
        if (my.firstRefresh) {
            /* 重置变量 */
            my.firstRefresh = false;

            /* 将imageID设置为startID */
            my.imageID = my.startID - 1;
            if (my.imageID < 0) {
                my.imageID = 0;
            }

            /* 在cicular模式下映射图像id范围（忽略克隆的图像） */
            if (my.circular) {
                my.imageID = my.imageID + my.imageFocusMax;
            }

            /* 确保id小于图像计数  */
            maxId = (my.circular) ? (my.max - (my.imageFocusMax)) - 1 : my.max - 1;
            if (my.imageID > maxId) {
                my.imageID = maxId;
            }

            /* 切换滑动动画以开始ID */
            if (my.glideToStartID === false) {
                my.moveTo(-my.imageID * my.xStep);
            }

            /* 设置从右侧移入的图像的动画 */
            if (my.startAnimation) {
                my.moveTo(5000);
            }
        }

        /* 仅当有多个图像时才设置动画 */
        if (my.max > 1) {
            my.glideTo(my.imageID);
        }

        /* 按当前顺序显示图像 */
        my.moveTo(my.current);
    };


    /* 主要动画功能 */
    this.moveTo = function (x) {
        this.current = x;
        this.zIndex = my.max;

        /* 主回路 */
        for (var index = 0; index < my.max; index++) {
            var image = my.imagesDiv.childNodes[my.indexArray[index]];
            var currentImage = index * -my.xStep;

            /* 启用图像缩放 */
            if (my.imageScaling) {
                /* 不显示未聚焦的图像 */
                if ((currentImage + my.maxFocus) < my.memTarget || (currentImage - my.maxFocus) > my.memTarget) {
                    try {
                        image.style.visibility = 'hidden';
                        image.style.display = 'none';
                    } catch (e) {
                    }
                } else {
                    try {
                        var z = (Math.sqrt(10000 + x * x) + 100) * my.imagesM;
                        var xs = x / z * my.size + my.size;

                        /* 在处理图像之前仍隐藏图像，但将“显示样式”设置为“块” */
                        image.style.display = 'block';

                        /* 处理新图像的高度和宽度 */
                        var newImageH = (image.h / image.w * image.pc) / z * my.size;

                        var newImageW = 0;
                        switch (newImageH > my.maxHeight) {
                            case false:
                                newImageW = image.pc / z * my.size;
                                break;

                            default:
                                newImageH = my.maxHeight;
                                newImageW = image.w * newImageH / image.h;
                                break;
                        }

                        var newImageTop = (my.imagesDivHeight - newImageH) + ((newImageH / (my.reflectionP + 1)) * my.reflectionP);

                        /* 设置新图像属性 */
                        image.style.left = xs - (image.pc / 2) / z * my.size + 'px';
                        if (newImageW && newImageH) {
                            image.style.height = newImageH + 'px';
                            image.style.width = newImageW + 'px';
                            image.style.top = newImageTop + 'px';
                        }
                        image.style.visibility = 'visible';

                        /* 通过zIndex设置图像层 */
                        switch (x < 0) {
                            case true:
                                this.zIndex++;
                                break;

                            default:
                                this.zIndex = my.zIndex - 1;
                                break;
                        }

                        /* 改变聚焦图像的zIndex和onclick函数 */
                        switch (image.i === my.imageID) {
                            case false:
                                image.onclick = function () {
                                    my.glideTo(this.i);
                                };
                                break;

                            default:
                                this.zIndex = my.zIndex + 1;
                                break;
                        }
                        image.style.zIndex = my.zIndex;
                    } catch (e) {
                    }
                }
            }

            /* 禁用图像缩放 */
            else {
                if ((currentImage + my.maxFocus) < my.memTarget || (currentImage - my.maxFocus) > my.memTarget) {
                    image.style.visibility = 'hidden';
                } else {
                    image.style.visibility = 'visible';

                    /* 更改聚焦图像的onclick函数 */
                    switch (image.i === my.imageID) {
                        case false:
                            image.onclick = function () {
                                my.glideTo(this.i);
                            };
                            break;
                    }
                }
                my.imagesDiv.style.marginLeft = (x - my.totalImagesWidth) + 'px';
            }

            x += my.xStep;
        }
    };


    /* 初始化图像滑动动画 */
    this.glideTo = function (imageID) {
        /* 检查跳线 */
        var jumpTarget, clonedImageID;
        if (my.circular) {
            /* 触发左跳跃点 */
            if (imageID + 1 === my.imageFocusMax) {
                /* 将跳转目标设置为右侧相同的克隆图像 */
                clonedImageID = my.max - my.imageFocusMax;
                jumpTarget = -clonedImageID * my.xStep;

                /* 将imageID设置为最后一个图像 */
                imageID = clonedImageID - 1;
            }

            /* 触发右跳线 */
            if (imageID === (my.max - my.imageFocusMax)) {
                /* 将跳转目标设置为左侧相同的克隆图像 */
                clonedImageID = my.imageFocusMax - 1;
                jumpTarget = -clonedImageID * my.xStep;

                /* 将imageID设置为第一个图像 */
                imageID = clonedImageID + 1;
            }
        }

        /* 计算新图像位置目标 */
        var x = -imageID * my.xStep;
        this.target = x;
        this.memTarget = x;
        this.imageID = imageID;

        /* 将图像移动到跳转目标 */
        if (jumpTarget) {
            my.moveTo(jumpTarget);
        }

        /* 动画滑动到新的x位置 */
        if (my.busy === false) {
            my.busy = true;
            my.animate();
        }
    };

    /* 动画图像滑动 */
    this.animate = function () {
        switch (my.target < my.current - 1 || my.target > my.current + 1) {
            case true:
                my.moveTo(my.current + (my.target - my.current) / 3);
                window.setTimeout(my.animate, my.animationSpeed);
                my.busy = true;
                break;

            default:
                my.busy = false;
                break;
        }
    };

    /* 由用户事件用于调用glideTo函数 */
    this.glideOnEvent = function (imageID) {
        /* 在鼠标滚轮、按键、触摸上中断幻灯片放映 */
        if (my.slideshow) {
            my.Slideshow.interrupt();
        }

        /* 滑动到新的imageID */
        my.glideTo(imageID);
    };

    /* 幻灯片放映功能 */
    this.Slideshow =
        {
            direction: 1,

            init: function () {
                /* 如果启用了autoplay，则调用start（），如果禁用了autoplay，则调用stop（） */
                (my.slideshowAutoplay) ? my.Slideshow.start() : my.Slideshow.stop();
            },

            interrupt: function () {
                /* 删除中断事件 */
                my.Helper.removeEvent(my.ImageFlowDiv, 'click', my.Slideshow.interrupt);

                /* 中断幻灯片放映 */
                my.Slideshow.stop();
            },

            addInterruptEvent: function () {
                /* 单击ImageFlow div中的任何位置都会中断幻灯片放映 */
                my.Helper.addEvent(my.ImageFlowDiv, 'click', my.Slideshow.interrupt);
            },

            start: function () {
                /* 将按钮样式设置为暂停 */
                my.Helper.setClassName(my.buttonSlideshow, 'slideshow pause');

                /* 设置onclick行为以停止 */
                my.buttonSlideshow.onclick = function () {
                    my.Slideshow.stop();
                };

                /* 设置滑动间隔 */
                my.Slideshow.action = window.setInterval(my.Slideshow.slide, my.slideshowSpeed);

                /* 允许用户始终中断幻灯片放映 */
                window.setTimeout(my.Slideshow.addInterruptEvent, 100);
            },

            stop: function () {
                /* 设置要播放的按钮样式 */
                my.Helper.setClassName(my.buttonSlideshow, 'slideshow play');

                /* 将onclick行为设置为开始 */
                my.buttonSlideshow.onclick = function () {
                    my.Slideshow.start();
                };

                /* 清除滑动间隔 */
                window.clearInterval(my.Slideshow.action);
            },

            slide: function () {
                var newImageID = my.imageID + my.Slideshow.direction;
                var reverseDirection = false;

                /* 在右边最后一个图像的反向 */
                if (newImageID === my.max) {
                    my.Slideshow.direction = -1;
                    reverseDirection = true;
                }

                /* 在左边最后一张图片上反转方向 */
                if (newImageID < 0) {
                    my.Slideshow.direction = 1;
                    reverseDirection = true;
                }

                /* 如果方向相反，请调用此方法，否则调用glideTo方法 */
                (reverseDirection) ? my.Slideshow.slide() : my.glideTo(newImageID);
            }
        };


    /* 鼠标滚轮支持 */
    this.MouseWheel =
        {
            init: function () {
                /* 初始化鼠标滚轮侦听器 */
                if (window.addEventListener) {
                    my.ImageFlowDiv.addEventListener('DOMMouseScroll', my.MouseWheel.get, false);
                }
                my.Helper.addEvent(my.ImageFlowDiv, 'mousewheel', my.MouseWheel.get);
            },

            get: function (event) {
                var delta = 0;
                if (!event) {
                    event = window.event;
                }
                if (event.wheelDelta) {
                    delta = event.wheelDelta / 120;
                } else if (event.detail) {
                    delta = -event.detail / 3;
                }
                if (delta) {
                    my.MouseWheel.handle(delta);
                }
                my.Helper.suppressBrowserDefault(event);
            },

            handle: function (delta) {
                var change = false;
                var newImageID = 0;
                if (delta > 0) {
                    if (my.imageID >= 1) {
                        newImageID = my.imageID - 1;
                        change = true;
                    }
                } else {
                    if (my.imageID < (my.max - 1)) {
                        newImageID = my.imageID + 1;
                        change = true;
                    }
                }

                /* 滑动到下一个（鼠标滚轮向下）/上一个（鼠标滚轮向上）图像  */
                if (change) {
                    my.glideOnEvent(newImageID);
                }
            }
        };


    /* iPhone和iPod touch上的Safari touch事件 */
    this.Touch =
        {
            x: 0,
            startX: 0,
            stopX: 0,
            busy: false,
            first: true,

            /* 初始化触摸事件侦听器 */
            init: function () {
                my.Helper.addEvent(my.navigationDiv, 'touchstart', my.Touch.start);
                my.Helper.addEvent(document, 'touchmove', my.Touch.handle);
                my.Helper.addEvent(document, 'touchend', my.Touch.stop);
            },

            isOnNavigationDiv: function (e) {
                var state = false;
                if (e.touches) {
                    var target = e.touches[0].target;
                    if (target === my.navigationDiv || target === my.sliderDiv || target === my.scrollbarDiv) {
                        state = true;
                    }
                }
                return state;
            },

            getX: function (e) {
                var x = 0;
                if (e.touches) {
                    x = e.touches[0].pageX;
                }
                return x;
            },

            start: function (e) {
                my.Touch.startX = my.Touch.getX(e);
                my.Touch.busy = true;
                my.Helper.suppressBrowserDefault(e);
            },

            isBusy: function () {
                var busy = false;
                if (my.Touch.busy) {
                    busy = true;
                }
                return busy;
            },

            /* 在导航分区内处理触摸事件位置 */
            handle: function (e) {
                if (my.Touch.isBusy && my.Touch.isOnNavigationDiv(e)) {
                    var max = (my.circular) ? (my.max - (my.imageFocusMax * 2) - 1) : (my.max - 1);
                    if (my.Touch.first) {
                        my.Touch.stopX = (max - my.imageID) * (my.imagesDivWidth / max);
                        my.Touch.first = false;
                    }
                    var newX = -(my.Touch.getX(e) - my.Touch.startX - my.Touch.stopX);

                    /* 在图像流宽度范围内映射x轴触摸坐标 */
                    if (newX < 0) {
                        newX = 0;
                    }
                    if (newX > my.imagesDivWidth) {
                        newX = my.imagesDivWidth;
                    }

                    my.Touch.x = newX;

                    var imageID = Math.round(newX / (my.imagesDivWidth / max));
                    imageID = max - imageID;
                    if (my.imageID !== imageID) {
                        if (my.circular) {
                            imageID = imageID + my.imageFocusMax;
                        }
                        my.glideOnEvent(imageID);
                    }
                    my.Helper.suppressBrowserDefault(e);
                }
            },

            stop: function () {
                my.Touch.stopX = my.Touch.x;
                my.Touch.busy = false;
            }
        };


    /* 键盘按键支持 */
    this.Key =
        {
            /* 初始化键盘按键事件侦听器 */
            init: function () {
                document.onkeydown = function (event) {
                    my.Key.handle(event);
                };
            },

            /* 处理箭头键 */
            handle: function (event) {
                var charCode = my.Key.get(event);
                switch (charCode) {
                    /* 右箭头键 */
                    case 39:
                        my.MouseWheel.handle(-1);
                        break;
                    /* 左箭头键 */
                    case 37:
                        my.MouseWheel.handle(1);
                        break;
                }
            },

            /* 获取当前按键码 */
            get: function (event) {
                event = event || window.event;
                return event.keyCode;
            }
        };


    /* 辅助函数 */
    this.Helper =
        {
            /* 添加事件 */
            addEvent: function (obj, type, fn) {
                if (obj.addEventListener) {
                    obj.addEventListener(type, fn, false);
                } else if (obj.attachEvent) {
                    obj["e" + type + fn] = fn;
                    obj[type + fn] = function () {
                        obj["e" + type + fn](window.event);
                    };
                    obj.attachEvent("on" + type, obj[type + fn]);
                }
            },

            /* 移除事件 */
            removeEvent: function (obj, type, fn) {
                if (obj.removeEventListener) {
                    obj.removeEventListener(type, fn, false);
                } else if (obj.detachEvent) {
                    obj.detachEvent('on' + type, obj[type + fn]);
                    obj[type + fn] = null;
                    obj['e' + type + fn] = null;
                }
            },

            /* 设置图像不透明度 */
            setOpacity: function (object, value) {
                if (my.opacity === true) {
                    object.style.opacity = value / 10;
                    object.style.filter = 'alpha(opacity=' + value * 10 + ')';
                }
            },

            /* 创建HTML元素 */
            createDocumentElement: function (type, id, optionalClass) {
                var element = document.createElement(type);
                element.setAttribute('id', my.ImageFlowID + '_' + id);
                if (optionalClass !== undefined) {
                    id += ' ' + optionalClass;
                }
                my.Helper.setClassName(element, id);
                return element;
            },

            /* 设置CSS类 */
            setClassName: function (element, className) {
                if (element) {
                    element.setAttribute('class', className);
                    element.setAttribute('className', className);
                }
            },

            /* 禁止默认浏览器行为以避免在拖动时选择图像/文本 */
            suppressBrowserDefault: function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
                return false;
            },
        };
}

var domReadyEvent =
    {
        name: "domReadyEvent",
        /* DOMContentLoaded事件处理程序的数组*/
        events: {},
        domReadyID: 1,
        bDone: false,
        DOMContentLoadedCustom: null,

        /* 向数组中添加DOMContentLoaded侦听器的函数*/
        add: function (handler) {
            /* 为每个事件处理程序分配一个唯一的ID。如果该处理程序具有ID，则它已添加到事件对象或已运行。*/
            if (!handler.$$domReadyID) {
                handler.$$domReadyID = this.domReadyID++;

                /* 如果发生了DOMContentLoaded事件，运行该函数。 */
                if (this.bDone) {
                    handler();
                }

                /* 将事件处理程序存储在哈希表中 */
                this.events[handler.$$domReadyID] = handler;
            }
        },

        remove: function (handler) {
            /* 从哈希表中删除事件处理程序 */
            if (handler.$$domReadyID) {
                delete this.events[handler.$$domReadyID];
            }
        },

        /* 函数处理DOMContentLoaded事件数组。 */
        run: function () {
            /* 如果已调用此函数，则退出 */
            if (this.bDone) {
                return;
            }
            /* 标记此函数，不会重复相同的操作两次 */
            this.bDone = true;

            /* 遍历已注册函数的数组 */
            for (var i in this.events) {
                this.events[i]();
            }
        },

        init: function () {
            /* 如果addEventListener支持DOMContentLoaded事件*/
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", function () {
                    domReadyEvent.run();
                }, false);
            }

            function run() {
                domReadyEvent.run();
            }

            /* 以防window.onload首先发生，使用可用方法将其添加到onload*/
            if (typeof addEvent !== "undefined") {
                addEvent(window, "load", run);
            } else if (document.addEventListener) {
                document.addEventListener("load", run, false);
            } else if (typeof window.onload === "function") {
                var oldonload = window.onload;
                window.onload = function () {
                    domReadyEvent.run();
                    oldonload();
                };
            } else {
                window.onload = run;
            }
        }
    };

var domReady = function (handler) {
    domReadyEvent.add(handler);
};
domReadyEvent.init();


/* 加载DOM结构后创建ImageFlow实例 */
domReady(function () {
    var instanceOne = new ImageFlow();
    instanceOne.init({
        ImageFlowID: 'starsIF',
        slider: false,
        startID: Number($("#S_Num").val())
    });
});
