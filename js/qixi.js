   var container = $("#content");
   var swipe = Swipe(container);
   var visualWidth = container.width();
   var visualHeight = container.height();

   // 动画结束事件
   var animationEnd = (function() {
       var explorer = navigator.userAgent;
       if (~explorer.indexOf('WebKit')) {
           return 'webkitAnimationEnd';
       }
       return 'animationend';
   })();

   //页面滚动到指定位置
   function scrollTo(time, proportionX){
     var distX = container.width() * proportionX;
     swipe.scrollTo(distX, time);
   }

   var bird = {
        elem: $(".bird"),
        fly: function() {
            this.elem.addClass('birdFly')
            this.elem.transition({
                right: container.width()
            }, 15000, 'linear');
        }
    };

    /*  灯动画  */
    var lamp = {
        elem: $('.b_background'),
        bright: function() {
            this.elem.addClass('lamp-bright');
        },
        dark: function() {
            this.elem.removeClass('lamp-bright');
        }
    };

    

    function doorAction(left, right, time) {
        var $door = $('.door');
        var doorLeft = $('.door-left');
        var doorRight = $('.door-right');
        var defer = $.Deferred();
        var count = 2;
        // 等待开门完成
        var complete = function() {
            if (count == 1) {
                defer.resolve();
                return;
            }
            count--;
        };
        doorLeft.transition({
            'left': left
        }, time, complete);
        doorRight.transition({
            'left': right
        }, time, complete);
        return defer;
    }

    // 开门
    function openDoor() {
        return doorAction('-50%', '100%', 2000);
    }

    // 关门
    function shutDoor() {
        return doorAction('0%', '50%', 2000);
    }

    var snowflakeURl = [
        'img/snowflake/snowflake1.png',
        'img/snowflake/snowflake2.png',
        'img/snowflake/snowflake3.png',
        'img/snowflake/snowflake4.png',
        'img/snowflake/snowflake5.png',
        'img/snowflake/snowflake6.png'
    ]
    
    ///////
    //飘雪花 //
    ///////
    function snowflake() {
        // 雪花容器
        var $flakeContainer = $('#snowflake');

        // 随机六张图
        function getImagesName() {
            return snowflakeURl[[Math.floor(Math.random() * 6)]];
        }
        // 创建一个雪花元素
        function createSnowBox() {
            var url = getImagesName();
            return $('<div class="snowbox" />').css({
                'width': 41,
                'height': 41,
                'position': 'absolute',
                'backgroundSize': 'cover',
                'zIndex': 100000,
                'top': '-41px',
                'backgroundImage': 'url(' + url + ')'
            }).addClass('snowRoll');
        }

        // 开始飘花
        setInterval(function() {
            // 运动的轨迹
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity    = 1,
                endPositionTop  = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration        = visualHeight * 10 + Math.random() * 5000;

            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            // 创建一个雪花
            var $flake = createSnowBox();

            // 设计起点位置
            $flake.css({
                left: startPositionLeft,
                opacity : randomStart
            });

            // 加入到容器
            $flakeContainer.append($flake);

            // 开始执行动画
            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function() {
                $(this).remove() //结束后删除
            });
        }, 200);
    }

    //桥的Y轴
    var bridgeY = function(){
        var data = getValue('.c_background_middle');
        return data.top;
    }

    var girl = {
        elem: $('.girl'),
        getHeight: function() {
            return this.elem.height();
        },
        // 转身动作
        rotate: function() {
            this.elem.addClass('girl-rotate');
        },
        setPosition: function() {
            this.elem.css({
                left: visualWidth / 2,
                top: bridgeY - this.getHeight()
            });
        },
        getPosition: function() {
            return this.elem.position();
        },
        getWidth: function() {
            return this.elem.width()
        }
    };
    // 修正小女孩位置
    girl.setPosition();

    /**logo 动画**/
    var logo = {
        elem: $('.logo'),
        run: function() {
            this.elem.addClass('logolightSpeedIn')
                .on(animationEnd, function() {
                    $(this).addClass('logoshake').off();
                });
        }
    };

    // 音乐配置
    var audioConfig = {
        enable: true, // 是否开启音乐
        playURl: 'happy.wav',         // 正常播放地址
        cycleURL: 'circulation.wav'   // 正常循环播放地址
    };

    function Html5Audio(url, isloop) {
        var audio = new Audio(url);
        audio.autoPlay = true;
        audio.loop = isloop || false;
        audio.play();
        return {
            end: function(callback) {
                audio.addEventListener('ended', function() {
                    callback();
                }, false);
            }
        };
    }

    function audioPlay(){
        var audio1 = Html5Audio(audioConfig.playURl);
        audio1.end(function() {
            Html5Audio(audioConfig.cycleURL, true);
        });
    }

    function startAnima(){
        var boy = BoyWalk();
        boy.setBoyLocaltion();
        boy.walkTo(6000,1/2)
        .then(function(){
            swipe.scrollTo(container.width() * 1, 12000);
        })
        .then(function(){
            return boy.walkTo(12000, 1/2);
        })
        .then(function(){
            return openDoor();
        })
        .then(function(){
            lamp.bright();
        })
        .then(function(){
            return boy.toShop(2000);
        })
        .then(function(){
            return boy.talkFlower();
        })
        .then(function(){
            return bird.fly();
        })
        .then(function(){
            return boy.outShop(2000);
        })
        .then(function(){
            return shutDoor();
        })
        .then(function(){
            lamp.dark();
        })
        .then(function(){
            swipe.scrollTo(container.width() * 2, 8000);
        })
        .then(function(){
            return boy.walkTo(8000,0.15);
        })
        .then(function(){
            return boy.walkTo(1500, 0.25, girl.getPosition().top / visualHeight);
        })
        .then(function(){
            //var proportionX = (girl.getPosition().left - boy.getWidth() + girl.getWidth() / 5) / visualWidth;
            var proportionX = 751 / visualWidth;
            return boy.walkTo(1500, proportionX);
        })
        .then(function(){
            boy.resetOriginal();  
        })
        .then(function(){
            //转身动作
            setTimeout(function(){
                girl.rotate();
                boy.rotate(function(){
                    logo.run();
                });
            }, 1000);
        })
        .then(function(){
            snowflake();
        });
    }

    /* 启动 */
    $(function(){
      startAnima();
    });