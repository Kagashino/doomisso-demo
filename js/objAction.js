/**
 * Created by 123 on 2017/2/19.
 */
function zijiOperator() {
    var mvrg = keySt.toLSpeed? 4:10;


    if(gameSt.enegy<1000){
        gameSt.enegy +=25;
    }
    if(keySt.toLeft){
        ziji.style.left=ziji.offsetLeft-mvrg+"px";
        ziji.style.backgroundPositionX = "-90px";
    }
    if(keySt.toRight){
        ziji.style.left=ziji.offsetLeft+mvrg+"px";
        ziji.style.backgroundPositionX = "-180px";
    }
    if(keySt.toUp){
        ziji.style.top=ziji.offsetTop-mvrg+"px";
        ziji.style.backgroundPositionX = "0px";

    }
    if(keySt.toDown){
        ziji.style.top=ziji.offsetTop+mvrg+"px";
       ziji.style.backgroundPositionX = "0px";
    }
    if(!keySt.toRight && !keySt.toLeft){
        ziji.style.backgroundPositionX = "0px";
    }
    if(keySt.toLSpeed){
        spot[0].style.visibility = "visible";
    }else{
        spot[0].style.visibility = "hidden";
    }

    if(gameSt.playing){
		gameSt.score ++;
		$('#score').text(gameSt.score);
    }

    limit(ziji);
    collision(ziji.offsetLeft+37,ziji.offsetTop+37);
    
}

/*/////////////开火/////////////*/
function fireUp(){
    eliminate();

    $('#laser').show();
    $('#laser').fadeOut(100);

    if(gameSt.playing){
        setTimeout(fireUp,250);
    }

}


    /*		敌人被击中判定		*/
    function eliminate(){

        var px = ziji.offsetLeft+43,py = ziji.offsetTop;

        $('.theEnemy').each(function(){
            var ex = this.offsetLeft+30,ey = this.offsetTop;
            if(ex+35>px && ex-35<px && ey<py){
                gameSt.score+=(100+gameSt.diff*100);
                explode(0,ex,ey);
                $(this).remove();
            }
        });
        if(gameSt.boss){
        	hitTheBoss(px,py)
		}
    }
    function hitTheBoss(px,py) {
		var ex = $('#theBoss')[0].offsetLeft+30,ey =$('#theBoss')[0].offsetTop,totalHealth=(150+100*gameSt.diff);
		var timeExplode = 3,coordExplode = [[ex+120,ey+60],[ex,ey+30],[ex+60,ey+60],[ex+70,ey+170]];
		if(ex+155>px && ex-30<px && ey<py){
			boss.health -=1;
			$('#bossHealthBar').css({
				width: (200*boss.health)/totalHealth+"px",
				backgroundColor: "rgb("+(256-parseInt(256*(boss.health)/totalHealth))+","+parseInt(256*(boss.health)/totalHealth)+",0)"
			})

			/*测试下爆炸坐标*/
			if( (boss.health/totalHealth)<0.5  && (boss.health/totalHealth)>0.3){
				bossDamage();
			} else if((boss.health/totalHealth)<0.3){
				;
			}
			if(boss.health<=0){
				explode(2,ex-50,ey);
				gameSt.score += (10000+gameSt.diff*2500);
				BossDie();
			}
		}
		function  bossDamage() {


			if(boss.state==1){

				explode(0,coordExplode[timeExplode][0],coordExplode[timeExplode][1]);
				timeExplode--;
				if(timeExplode>=0){
					setTimeout(bossDamage,25);
				} else {
					$('#theBoss').addClass('damagedBoss')
					boss.state = 2;
				}


			}
		}
	}
    /***********************防溢出**********************************/
    function limit(ziji){/*对象*/
        //上下溢出
        ziji.style.top = ziji.offsetTop<-35?"-35px":ziji.offsetTop>550?"550px":ziji.style.top;
        //左右溢出
        ziji.style.left = ziji.offsetLeft<-35?"-35px":ziji.offsetLeft>550?"550px":ziji.style.left;
    }


    /************************自机碰撞判定***************************/
    function collision(x,y){

    	$('.bullet').each(function () {
			var bltX = this.style.left.slice(0,-2)
			var bltY = this.style.top.slice(0,-2)
			if( Math.pow((x-bltX),2)+Math.pow((y-bltY),2)<750 ){
					gameSt.graze++;
					gameSt.score += parseInt(gameSt.graze/20);
					$('#zijiPos').text(gameSt.graze);
			}
			if( Math.pow((x-bltX),2)+Math.pow((y-bltY),2)<150 ){
				
					gameSt.hp-=10;
				
				explode(1,bltX,bltY);
				recycleBullet(this);
				$('#hitCount').text(gameSt.hp);
				if(gameSt.hp<=0)
					endGame();
			}
		});
        // var len = $('.bullet').length;
		//
        // for(var i = 0; i<len; i++){
        //
		//
		//
        //     if( Math.pow((x-bltX),2)+Math.pow((y-bltY),2)<750 ){
        //         gameSt.graze++;
        //         gameSt.score += parseInt(gameSt.graze/20);
        //         $('#zijiPos').text(gameSt.graze);
        //     }
		//
        //     if( Math.pow((x-bltX),2)+Math.pow((y-bltY),2)<150 ){
        //         if(!$('#infinite')[0].checked){
        //             gameSt.hp-=10;
        //         }
        //         explode(1,bltX,bltY);
        //         recycleBullet($('.bullet')[i]);
        //         $('#hitCount').text(gameSt.hp);
        //         if(gameSt.hp<=0)
        //             endGame();
        //     }
        // };

    }
    /*
     *			爆炸效果
     *		1 自己被弹
     	*	2 大爆炸
     		3 小爆炸
     */
    function explode(who,x,y){
        switch(who){
            case 1:{
                var hit = $('<div>')

                hit.text('')       
                hit.css({
                	width:38,
					height:38,
                    position: "absolute",
                    top: (y-15)+"px",
                    left: (x-5)+"px",
                    color: "orange",
                    fontSize: "1.2em",
					background:"url(img/behit.png) no-repeat",
					zIndex:110
                });
                hit.appendTo($gameScreen);
                hit.fadeOut(400,function(){
                    hit.remove();
                });

            };break;
			case 2:{
				var bossExp = $('<img src="img/bigbangloop.gif">').css({
					position:"absolute",
					top: y+"px",
					left: x+"px"
				}).appendTo($gameScreen).delay(200).fadeOut(100,function () {
					bossExp.remove();
				})
			};break;
            default:{
                var exp = $('<img src="img/bang.png" />').css({
                    position: "absolute",
                    top: (y)+"px",
                    left: (x-35)+"px",
					zIndex:500
                }).appendTo($gameScreen).fadeOut(150,function(){
                    exp.remove();
                })
            };break;
        }
    }
    //子弹回收判定
    function ammoOperating(){
    	$('#dmkcount').text($('.bullet').length)

        $('.bullet').each(function(){
            var bltX = this.style.left.slice(0,-2);
            var bltY = this.style.top.slice(0,-2);

            if(bltX>630 || bltX<-30 || bltY>630 || bltY<-30){
                recycleBullet(this);

            }

        })
    }

    //回收子弹
    function recycleBullet(obj){
		$(obj).stop();
		$(obj).removeClass("bullet");
		obj.title = "1";
		resetObject(obj,"620px","620px");


    }

    //重置对象CSS，传px
    function resetObject(obj,x,y){
        obj.style.left = x ;
        obj.style.top = y;

    }

//绘制横向飞行物,0为左，1为右
function drawEnemy1(lr,howmany,speed){
	var obj = new Xobject(lr,speed)//左边生成

	var frag = document.createDocumentFragment()

	for(var i = 0; i<howmany ; i++){
		var div = $('<div>');
		div.addClass("theEnemy");
		div.addClass(lr?'enemy1 left':'enemy1 right');
		div.css({
			left:obj.ox + "px",
			top:obj.oy + "px"
		});
		div.appendTo($(frag));

	}
	$(frag).appendTo($gameScreen);


	for(var i = 0; i<howmany; i++){

		if(lr){
			var eachObj = $('.left:eq('+i+')');
			eachObj.delay(speed/5*i).animate({left: obj.x+'px', top: obj.y+'px'},obj.speed,"linear");
		}

		else{
			var eachObj = $('.right:eq('+i+')')
			eachObj.delay(speed/5*i).animate({left: obj.x+'px', top: obj.y+'px'},obj.speed,"linear");
		}

	}

}
//敌人1行为与回收
function enemy1Operating(){

	$('.enemy1').each(function(){
		var obj = $(this);
		var objX = obj.offset().left, objY = obj.offset().top;
		var ranL = parseInt(50+Math.random()*10);
		var ranR = parseInt(550-Math.random()*10);

		if(objX>ranL && objX<ranR){

			if(obj.css('opacity')=="1"){

				doLaunch(objX,objY+20);
				doLaunch(objX,objY+20,1);
				obj.css('opacity','0.7');

			}
		}

		if(objX>650 || objX<-80){
			$(this).remove();
		}

	})
}

//敌人2行为
function drawEnemy2(howmany,speed){
	var obj2 = new Yobject(howmany,speed);

	var ranY = Math.random()*100+50;
	var div = $('<div>').addClass('enemy2').addClass('theEnemy');
	div.css({
		top: obj2.y + 'px',
		left: obj2.x + 'px'
	});

	div.appendTo($gameScreen);
	div.animate({top: ranY+'px'},obj2.speed,"linear",function(){
		if(!$(div).is(':hidden')){

			blossomLaunch(div[0].offsetLeft+10,div[0].offsetTop+20,"linear",0,1);
		}
	}).animate({top: '-100px'},obj2.speed,"linear",function(){
		div.remove();
	});
}
/*绘制BOSS*/
function drawBoss(){
	$('#theBoss').remove();
	var div = $('<div>').attr('id','theBoss');

	resetObject(div[0],"200px","-200px");
	boss.health = 150+100*gameSt.diff;
	div.appendTo($gameScreen);
	$('<div id="bossHealthBar">').appendTo($('#theBoss'));
	div.animate({top:"50px",left:"200px"},1500,"linear",function () {
		blossomLaunch(290,130,"easeOutQuad",0,1,1);
		bossAction();
	})


}
/*Boss行动*/
function bossAction() {
	var bossX = Math.floor(Math.random()*400) , bossY = Math.floor(Math.random()*100);
	$('#theBoss').animate({
		top: bossY+"px",
		left: bossX+"px"
	},1000,function () {
		if(gameSt.boss){
			switch (boss.state){
				case 1:{
					blossomLaunch(bossX+90,bossY+80,"linear",1,1+gameSt.diff,$('#theBoss'));
					OutLaunch(gameSt.diff*5);
				};break;
				case 2:{
					pentagonStar(ziji.offsetLeft+37,ziji.offsetTop+37,80,5+2*gameSt.diff,1)
					pentagonStar(ziji.offsetLeft+37,ziji.offsetTop-13,240,5+2*gameSt.diff,2)
				};break;
				default:{
					blossomLaunch(bossX+90,bossY+80,"linear",1,1+gameSt.diff,$('#theBoss'))
				};
			}
		}
	})
	if(gameSt.boss){
		setTimeout(bossAction,3500+gameSt.diff*500);
	}
}
