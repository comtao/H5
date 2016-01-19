/**
 小孩走路  **/
 function BoyWalk(){
 	var container = $("#content");
 	//页面可使区域
 	var visualWidth = container.width();
 	var visualHeight = container.height();

    var $boy = $('#boy');
    var boyWidth = $boy.width();
    var boyHeight = $boy.height();

 	//获取数据
 	var getValue = function(className){
 		var $elem = $('' + className + '');
 		return {
 			height: $elem.height(),
 			top:$elem.position().top
 		};
 	};

 	//路的Y轴
 	var pathY = function(){
 		var data = getValue('.a_background_middle');
 		return data.top + data.height / 2;
 	}();

    //暂停走路
 	function pauseWalk(){
 		$boy.addClass('pauseWalk');
 	}

 	//恢复走路
 	function restoreWalk(){
 		$boy.removeClass('pauseWalk');
 	}

 	//css3动作变化
 	function slowWalk(){
 		$boy.addClass('slowWalk');
 	}

 	//用transition做运动
 	function startRun(options, runTime){
         var dfdPlay = $.Deferred();
         restoreWalk();
         $boy.transition(
         	options,
         	runTime,
         	'linear',
         	function(){
         		dfdPlay.resolve();  //动画完成
         	});
         return dfdPlay;
 	}

 	//开始走路
 	function walkRun(time, dist, disY){
 		time = time || 3000;
 		slowWalk();
 		var d1 = startRun({
 			'left':dist + 'px',
 			'top' :disY ? disY : undefined
 		},time);
 		return d1;
 	}

 	// 走进商店
        function walkToShop(runTime) {
            var defer = $.Deferred();
            var doorObj = $('.door')
            // 门的坐标
            var offsetDoor = doorObj.offset();
            var doorOffsetLeft = offsetDoor.left;
            // 小孩当前的坐标
            var offsetBoy     = $boy.offset();
            var boyOffetLeft = offsetBoy.left;

            // 当前需要移动的坐标
            instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffetLeft + $boy.width() / 2);

            // 开始走路
            var walkPlay = startRun({
                transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
                opacity: 0.1
            }, 2000);
            // 走路完毕
            walkPlay.done(function() {
                $boy.css({
                    opacity: 0
                })
                defer.resolve();
            })
            return defer;
        }

        // 走出店
        function walkOutShop(runTime) {
            var defer = $.Deferred();
            restoreWalk();
            //开始走路
            var walkPlay = startRun({
               transform: 'translateX(' + instanceX + 'px),translateY(0),,scale(1,1)',
               opacity: 1
            }, runTime);
            //走路完毕
            walkPlay.done(function() {
                defer.resolve();
            });
            return defer; 
        }

        // 取花
        function talkFlower() {
            // 增加延时等待效果
            var defer = $.Deferred();
            setTimeout(function() {
                // 取花
                $boy.addClass('slowFlolerWalk');
                defer.resolve();
            }, 1000);
            return defer;
        }


        // 计算移动距离
        function calculateDist(direction, proportion) {
            return (direction == "x" ?
                visualWidth : visualHeight) * proportion;
        }
        return {
            //修正男孩正确位置
            setBoyLocaltion:function(){
                $boy.css({
                  top:pathY - boyHeight + 25
                });
            },
            // 开始走路
            walkTo: function(time, proportionX, proportionY) {
                var distX = calculateDist('x', proportionX)
                var distY = calculateDist('y', proportionY)
                return walkRun(time, distX, distY);
            },
            // 走进商店
            toShop: function() {
                return walkToShop.apply(null, arguments);
            },
            // 走出商店
            outShop: function() {
                return walkOutShop.apply(null, arguments);
            }, 
            // 停止走路
            stopWalk: function() {
                pauseWalk();
            },
            setColor: function(value) {
                $boy.css('background-color', value)
            },
            getWidth:function(value){
                return $boy.width();
            },
            //复位初始状态
            resetOriginal:function(){
                this.stopWalk();
                $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
            },
            //转身动作
            rotate:function(callBack){
                restoreWalk();
                $boy.addClass('boy-rotate');
                //监听转身完毕
                if(callBack){
                    $boy.on(animationEnd, function(){
                        callBack();
                        $(this).off();
                    });
                }
            },
            // 取花
            talkFlower: function() {
                return talkFlower();
            }
        }
 }