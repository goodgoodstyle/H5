/*
 * audio的一些常用属性(在video里面也有)
 *   属性
 *      duration:播放的总时间(s)
 *      currentTime:已经播放的时间(s)
 *      ended:是否已经播放完成
 *      paused:当前是否为暂停状态
 *      volume:控制音量(0~1)
 *
 *   事件
 *     canplay:可以正常播放(但是播放过程中可能出现卡顿)
 *     canplaythrough:资源加载完毕，可以流畅播放
 *     ended:已经播放完成
 *     loadmetadata:资源的基础信息已经加载完成
 *     loadeddata:整个资源都已经加载完成
 *     pause:触发了暂停
 *     play:触发了播放
 *     playing:正在播放中
 *
 *   方法
 *   pause() 暂停
 *   play() 播放
 *
 *
 */
/*
 * click在移动端是单击事件行为，当触发点击操作，浏览器总会等待300ms，验证是否触发了第二次点击操作，没有触发才会执行click对应的方法(click在移动端的300ms延迟问题)
 *  1.不建议使用click(如果非要使用，最好导入一个插件 fastclick.min.js 就是解决300ms延迟的插件)
 *  2.目前项目中移动端的点击操作等基本上都是基于第三方类库(事件库完成的)
 *     zepto:提供了移动端常用的事件操作
 *     touch.js
 *     hammer.js
 *     ...
 *
 *  zepto中提供的专门供移动端操作的事件方法
 *   $box.tap(ev=>{}) 点击
 *   $box.singleTap(ev=>{}) 单击
 *   $box.doubleTap(ev=>{}) 双击
 *   $box.longTap(ev=>{}) 长按
 *
 *   swipe / swipeLeft / swipeRight / swipeUp / swipeDown ... 滑动
 *   pinchIn / pinchOut ... 缩放，放大
 *
 *
 *   zepto vs jQuery
 *     1.zepto没有考虑浏览器的兼容，专门为移动端开发的小型类库，也仅仅是把JQ中一些常规方法实现了，很多方法没有实现，例如：slideDown / show ...在zepto中都没有 ，为了保证zepto的体积足够小
 *     2.zepto中提供了移动端专门操作的事件方法，例如：tap ... ，这些方法都是基于移动端的touch和gesture事件模型封装好的方法，JQ中并没有提供这些方法 =>zepto更适合移动端
 *
 */

/*loading*/
let loadingRender = (function () {

    let $loadingBox = $(".loadingBox"),
        $current = $loadingBox.find(".current");

    let imgData = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];

    //RUN:预加载图片
    let n = 0,
        len = imgData.length;
    let run = function run(callback) {
        imgData.forEach(item => {
            let tempImg = new Image;
            tempImg.onload = () => {
                tempImg = null;
                $current.css("width", ++n / len * 100 + "%");

                //加载完成:执行回调函数(让当前loading页面消失)
                if (n === len) {
                    clearTimeout(delayTimer);
                    callback && callback()
                }
            };
            tempImg.src = item;
        })
    };
    //maxDelay:设置最长等待时间(假设10s，到达10s我们看加载多少了，如果已经达到了90%以上，我们可以正常访问内容了，如果不足这个比例，直接提示用户，当前网络状态不佳，稍后重试)
    let delayTimer = null;
    let maxDelay = function maxDelay(callback) {
        delayTimer = setTimeout(() => {
            clearTimeout(delayTimer);
            if (n / len >= 0.9) {
                $current.css("width", "100%");
                callback && callback();
                return;
            }
            alert("非常遗憾，您的网络状态不佳，请稍后再试!");
            window.location.href = "http://www.qq.com";//此时我们不应该继续加载图片，而是让其关掉页面或者是跳转到其他页面
        }, 10000);
    };

    //done : 完成
    let done = function done() {
        //停留一秒中再移除进入下一个环节
        let timer = setTimeout(() => {
            $loadingBox.remove();
            clearTimeout(timer);
            phoneRender.init();
        }, 1000)
    };


    return {
        init: function () {
            $loadingBox.css("display", "block");
            run(done);
            maxDelay(done);
        }
    }
})();
/*phone*/
let phoneRender = (function () {
    let $phoneBox = $(".phoneBox"),
        $time = $phoneBox.find("span"),
        $answer = $phoneBox.find(".answer"),
        $answerMarkLink = $answer.find(".answer>.markLink"),
        $hang = $phoneBox.find(".hang"),
        $hangMarkLink = $hang.find(".markLink"),
        answerBell = $("#answerBell")[0],
        introduction = $("#introduction")[0];


    let answerMarkTouch = function answerMarkTouch() {
        //remove answer
        $answer.remove();
        answerBell.pause();
        $(answerBell).remove();//一定要先暂停播放，然后再移除，否则即使移除了，浏览器也会播放这个声音

        //show hang
        $hang.css("transform", "translateY(0rem)");
        $time.css("display", "block");
        introduction.play();
        computedTime();

    };
    let autoTimer = null;
    /*计算播放时间*/
    let computedTime = function computedTime() {
        let duration = 0;
        //我们让audio播放，首先会去加载资源，部分资源加载完成才会播放，才会计算出总时间duration等信息，所以我们可以把获取的信息放到canplay事件中
        /*introduction.oncanplay = function () {
            duration = introduction.duration;

        };*/

        autoTimer = setInterval(() => {
            let val = introduction.currentTime,
                duration = introduction.duration;
            if (val >= duration) {
                clearInterval(autoTimer);
                closePhone();
                return;
            }
            let minute = Math.floor(val / 60),
                second = Math.floor(val - minute * 60);
            minute = minute < 10 ? "0" + minute : minute;
            second = second < 10 ? "0" + second : second;
            $time.html(`${minute}:${second}`);
        }, 1000)
    };


    //关闭phone
    let closePhone = function closePhone() {
        clearInterval(autoTimer);
        introduction.pause();
        $(introduction).remove();
        $phoneBox.remove();

        messageRender.init();
    };


    return {
        init: function () {
            $phoneBox.css("display", "block");
            //播放bell

            answerBell.play();
            answerBell.volume = 0.3;

            //点击answerMark
            $answerMarkLink.tap(answerMarkTouch);
            $hangMarkLink.tap(closePhone);
        }
    }
})();
/*message*/
let messageRender = (function () {
    let $messageBox = $(".messageBox"),
        $wrapper = $messageBox.find(".wrapper"),
        $messageList = $wrapper.find("li"),
        $keyBoard = $messageBox.find(".keyboard"),
        $textInp = $keyBoard.find("span"),
        $submit = $keyBoard.find(".submit"),
        $demonMusic = $("#demonMusic")[0];

    let step = -1,//记录当前展示信息的索引
        total = $messageList.length, //记录的是信息的总条数(自己手动发送一条)
        autoTimer = null,
        interval = 1500;//记录信息出现的间隔时间
    //展示信息
    /* let tt = 0;*/ //基于transform实现是加上这行代码
    let showMessage = function showMessage() {
        step++;
        if (step === 2) {
            //已经展示两条了，此时我们暂时结束自动信息发送，让键盘出来，开始执行手动发送
            clearInterval(autoTimer);
            handleSend();
            return;
        }
        let $cur = $messageList.eq(step);
        $cur.addClass("active");
        if (step >= 3) {
            //说明展示的条数已经是四条或者四条以上了，此时我们让wrapper向上移动，移动的距离是新展示这一条的高度

            let curH = $cur[0].offsetHeight,
                wraT = parseFloat($wrapper.css("top"));
            $wrapper.css("top", wraT - curH);
            //JS中基于CSS获取transform，得到的结果是一个矩阵
            /*let curH = $cur[0].offsetHeight,
                            wraT=parseFloat($wrapper.css("transform"))*/
            /* let curH = $cur[0].offsetHeight;
             tt -= curH;
             $wrapper.css("transform", `translateY(${tt}px)`)*/
        }
        if (step > total - 1) {
            //展示完了
            clearInterval(autoTimer);
            closeMessage();
        }
    };
    //手动发送
    let handleSend = function handleSend() {

        $keyBoard.css({
            transform: "translateY(0rem)"
        }).one("transitionend", () => {
            //transitionend:监听transition动画结束的事件,并且有几个样式属性改变，并且执行了过渡效果，事件就会被触发执行几次,用one方法做事件绑定只会让其触发一次

            let str = "好的，马上介绍~",
                n = -1,
                textTimer = null;
            textTimer = setInterval(() => {
                let originHTML = $textInp.html();
                $textInp.html(originHTML + str[++n]);
                if (n >= str.length - 1) {
                    clearInterval(textTimer);
                    $submit.css("display", "block");
                }
            }, 200)
        });
    };
    //点击submit
    let handleSubmit = function handleSubmit() {
        //把新创建的li增加到页面中第二个li的后面
        $(`<li class="self">
                <i class="arrow"></i>
                <img src="img/zf_messageStudent.png" alt="" class="pic">
                ${$textInp.html()}
            </li>`).insertAfter($messageList.eq(1)).addClass("active");
        //把新的li增加到页面中，我们此时应该重新获取li，让messageList和页面中的li正对应，方便后期根据索引展示对应的li
        $messageList = $wrapper.find("li");
        //该消失的消失
        $textInp.html("");
        $submit.css("display", "none");
        $keyBoard.css("transform", "translateY(3.7rem)");

        //继续向下展示剩余的消息
        autoTimer = setInterval(showMessage, interval);
    };
    //closeMessage
    let closeMessage = function closeMessage() {
        let delayTimer = setInterval(() => {
            $demonMusic.pause();
            $($demonMusic).remove();
            $messageBox.remove();
            clearTimeout(delayTimer);
            cubeRender.init();
        }, interval)
    };

    return {
        init: function () {
            $messageBox.css("display", "block");
            //加载模块立即展示一条信息:后期间隔interval再发送一条信息
            showMessage();
            autoTimer = window.setInterval(showMessage, interval);
            $submit.tap(handleSubmit);

            //music
            $demonMusic.play();
            $demonMusic.volume = 0.3;
        }
    }
})();
/*cube*/
let cubeRender = (function () {
    let $cubeBox = $(".cubeBox"),
        $cube = $cubeBox.find(".cube"),
        $cubeList = $cube.find("li");


    //手指控制旋转
    let start = function start(ev) {
        //记录手指按下位置的起始坐标
        let point = ev.changedTouches[0];
        this.starX = point.clientX;
        this.starY = point.clientY;
        this.changeX = 0;
        this.changeY = 0;

    };
    //手指控制移动
    let move = function move(ev) {
        //用最新手指的位置减去起始的位置，记录X/Y轴的偏移
        let point = ev.changedTouches[0];
        this.changeX = point.clientX - this.starX;
        this.changeY = point.clientY - this.starY;

    };
    //手指离开
    let end = function end(ev) {
        //获取change/rotate值，
        let point = ev.changedTouches[0];
        let {changeX, changeY, rotateX, rotateY} = this,
            isMove = false;
        //验证是否发生移动(判断滑动误差)
        Math.abs(changeX) > 10 || Math.abs(changeY) > 10 ? isMove = true : null;
        //只有发生移动才做处理
        if (isMove) {
            //左右滑动=>changeX=>rotateY(正比:change越大，rotate越大)
            //上下滑动=>changeY=>rotateX(反比:change越大，rotate越小)
            //为了让每一次操作旋转角度小一点，我们可以把移动距离的1/3作为旋转的角度即可
            rotateX = rotateX - changeY / 3;
            rotateY = rotateY + changeX / 3;
            //赋值给魔方盒子
            $(this).css("transform", `scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
            this.rotateX = rotateX;
            this.rotateY = rotateY;
        }
        //清空其他记录的自定义属性值
        ["starX", "starY", "changeX", "changeY"].forEach(item => this[item] = null);
    };


    return {
        init: function () {
            $cubeBox.css("display", "block");
            //手指操作cube，让cube跟着旋转
            let cube = $cube[0];

            cube.rotateX = -35;
            cube.rotateY = 35;//记录初始的旋转角度(存储到自定义属性上)
            $cube.on("touchstart", start).on("touchmove", move).on("touchend", end);
            //点击每一个面跳转到详情区域对应的页面
            $cubeList.tap(function () {
                $cubeBox.css("display", "none");
                //跳转到详情区域，通过点击li的索引，让其定位到具体的slide
                let index = $(this).index();
                detailRender.init(index);
            });
        }
    }
})();
/*detail*/
let detailRender = (function () {
    let $detailBox = $(".detailBox"),
        swiper = null,
        $dl = $(".page1>dl");
    let initSwiper = function initSwiper() {
        swiper = new Swiper(".swiper-container", {
            effect: "coverflow",
            onInit:move,
            onTransitionEnd: move
        });

        /*
         *  initialSlide : 初始为第几个slide
         *  loop:循环切换 3D切换设置loop的时候，偶尔会出现无法切换的情况(2D效果没问题)
         *  direction: horizontal / vertical 控制滑动方向
         *
         *  无缝切换的原理，把真实第一张克隆一份放到末尾，把真实最后一张也克隆一份放到开始(真实图片有五张，wrapper会有七个slide)
         *  onInit:(sw)=>{}  初始化成功执行的回调函数(参数是当前初始化的实例)
         *  onTransitionEnd:(sw)=>{}  切换动画完成执行的回调函数
         *
         *  实例属性
         *  activeIndex:当前展示slide块的索引
         *  slides:所有的slide(是个数组)
         *  实例共有方法
         *  slideTo:切换到执行索引的slide
         *
         */
    };


    let move = function move(swiper) {
        //swiper:当前创建的实例
        //1.当前是否为第一个slide，如果是让3D菜单展开，不是就让菜单收起
        let activeIndex = swiper.activeIndex,
            slideAry = swiper.slides;
        if (activeIndex === 0) {
            //说明是page1
            //实现折叠效果
            $dl.makisu({
                selector:"dd",
                overlap:0.6,
                speed: 0.8
            });
            $dl.makisu("open");
        }else {
            $dl.makisu({
                selector:"dd",
                speed: 0
            });
            $dl.makisu("close");
        }
        //2.滑动到哪一个页面，把当前页面设置对应ID，其余页面移除ID即可
        slideAry.forEach((item,index)=>{
            if (activeIndex === index) {
                item.id = "page" + (index + 1);
                return;
            }
            item.id = null;
        })

    };


    return {
        init: function (index=0) {
            $detailBox.css("display", "block");
            if (!swiper) {
                //防止swiper重复初始化
                initSwiper();
            }
            swiper.slideTo(index,0);//直接运动到具体的slide页面(第二个参数是切换的速度，0理解切换没有切换的动画效果)

        }
    }
})();


//开发过程中，由于当前项目板块众多(每一个板块都是一个单例)，我们最好规划一种机制:通过标识的判断可以让程序只执行对应板块的内容，这样开发哪个板块，我们把标识改为啥(HASH路由控制)

let url = window.location.href,//获取当前页面的url地址  location.href = "xxx.com"是让其跳转到某一个页面
    well = url.indexOf("#"),
    hash = well === -1 ? null : url.slice(well + 1);

switch (hash) {
    case "loading":
        loadingRender.init();
        break;
    case "phone":
        phoneRender.init();
        break;
    case "message":
        messageRender.init();
        break;
    case "cube" :
        cubeRender.init();
        break;
    case "detail":
        detailRender.init();
        break;
    default:
        loadingRender.init();
}
















