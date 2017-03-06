//构造直线弹；
function dBullet(spd,x,y,num) {
	this.num = num || parseInt(Math.random()*20+5)//生成个数
	this.toX = x || 0;		//往哪移动
	this.toY = y || 600;
	this.speed = spd || 8000;

}

/*构造开花弹*/
function CircleMatrix(num) {
	var len = num || 20
	var arr = [];
	for(var i=0; i<len; i++){
		arr.push([1291*Math.sin(2*Math.PI*i/len),1291*Math.cos(2*Math.PI*i/len)]);
	}
	return arr;
}
// /*	构造五角星	*/
function Pentagon(a,x,y) {
	var pt = [
		[-a-a*Math.sin(Math.PI/10)+x,y],//-a-a*sin18°,0
		[a+a*Math.sin(Math.PI/10)+x,y],//a+a*sin18°,0
		[-a*Math.cos(Math.PI/5)+x,
			a*Math.cos(Math.PI/5)*(1/Math.tan(Math.PI/10))-a*Math.cos(Math.PI/10)+y],//-a*cos36°,-a*cos36°*cot18°+a*cos18°
		[x,-a*Math.cos(Math.PI/10)+y],//0,a*cos18°
		[a*Math.cos(Math.PI/5)+x,
			a*Math.cos(Math.PI/5)*(1/Math.tan(Math.PI/10))-a*Math.cos(Math.PI/10)+y]//a*cos36°,-a*cos36°*cot18°+a*cos18°
	];


	return pt;
}

/*连线五角星*/
function  fillPentagon(a,x,y,num) {
	a = a || 120;
	num = num || 7+2*gameSt.diff;
	var pt = Pentagon(a,x,y)
	var arr = new Array();

	for(var i=0; i<5; i++){
		var j = 0;


			var len = pt[(i+1)%5][0]-pt[i][0];
			while(Math.abs(j)<Math.abs(len)){
				arr.push(
					[pt[i][0]+j,pt[i][1]+j*(pt[(i+1)%5][1]-pt[i][1])/len]
				)
					j += len/num;
			}
		// if(i!=4){} else {
		//
		// 	var len = pt[0][0]-pt[i][0];
		//
		// 	while(Math.abs(j)<Math.abs(len)){
		// 		arr.push(
		// 			[pt[i][0]+j,pt[i][1]+j*(pt[0][1]-pt[i][1])/len]
		// 		)
		// 		j += len/num;
		// 	}
		// }

	}
	return arr;
}


//构造横向飞行物
function Xobject(sign,speed,hp){
	this.ox = sign?-60:620//初始位置
	this.x = sign?660:-90;//结束位置
	this.oy = parseInt(Math.random()*100);
	this.y = parseInt(Math.random()*100);
	this.hp = hp || 10;
	this.speed = speed || 3000;
}

//构造纵向飞行物
function Yobject(hp,speed){

	this.x = Math.random()*500+10 || 300;//随机出现在顶端
	this.oy = -30;
	this.y = -60;
	this.hp = hp || 10;
	this.speed = speed || 1000;
	
}



/*真 直线发射*/
function shootIt($obj,x,y,toX,toY,speed,ease,delay) {

	speed = speed || 2500-gameSt.diff*250;
	ease = ease || "linear"
	$obj.addClass('bullet');
	$obj.css({
		left: x+"px",
		top: y+"px"
	});

	//ammoOperating();
	function delayShoot() {
		if($obj.attr("title")==2){
			$obj.animate({top: toY + "px", left: toX + "px"},speed,ease);
		}
	}
	if(!delay){
		$obj.animate({top: toY + "px", left: toX + "px"},speed,ease);
	} else {
		setTimeout(delayShoot,delay)
	}

}


//直线发射,snipe为自机狙
function doLaunch(x,y,snipe,direct){

	var toXY = [];
	var blt1 = $('#danmaku' + requestDanmaku());
	
	// blt1.addClass('bullet');
	// blt1.css({
	// 	left: x+"px",
	// 	top: y+"px"
	// });

	if(!snipe){
		toXY = [direct?direct:parseInt(Math.random()*800),650];
		// blt1.animate({top: '650px', left: toX+'px'},2500-gameSt.diff*250,"linear",function (){})
	} else {
		toXY = snipeCoord(x,y);

		// blt1.animate({top: toY+'px', left: toX+'px'},2500-gameSt.diff*250,"linear",function (){})

	}

	shootIt(blt1,x,y,toXY[0],toXY[1],2500-gameSt.diff*250,"linear",0);


}
function snipeCoord(x,y){
	var zijiX = ziji.offsetLeft+37,zijiY = ziji.offsetTop+37;
	var k = (zijiY-y)/(zijiX-x);//斜率
	if(k==Infinity){
		var toX = (zijiX-x)<0? -60:660;
		var toY = y;
	} else if(k==0){
		var toX = x;
		var toY = (zijiY-y)<0? -60:660;

	} else if(k<1 && k>-1){
		var toX = (zijiX-x)<0? -60:660;
		var toY = y+((zijiX-x)>0?660:-660)*k;
	} else {
		var toY = (zijiY-y)<0?-60:660;
		var toX = x+((zijiY-y)>0?660:-660)*(1/k);

	}
	return [toX,toY];
}

//开花
function blossomLaunch(x,y,ease,spiral,lay,byWho){
	var ammo2Speed = 8000-400*gameSt.diff;
	var ammo2Number = parseInt(Math.random()*20+5)*gameSt.diff
	var mtx = new Array;
	for(var i=0;i<lay;i++){
		mtx=mtx.concat(CircleMatrix(ammo2Number));
	}
	var mtxRest = mtx.length-1;
	function spiralLaunch() {
		var bltSpiral = $('#danmaku' + requestDanmaku());
		shootIt(bltSpiral,x,y,mtx[mtxRest][1],mtx[mtxRest][0],ammo2Speed,ease);
		mtxRest--;
		if(mtxRest>=0 && byWho){
			setTimeout(spiralLaunch,10)
		}
	}
	if(spiral){
		spiralLaunch();
	} else {
		for(var i = mtx.length-1; i>=0; i--){

			var blt2 = $('#danmaku' + requestDanmaku());
			shootIt(blt2,x,y,mtx[i][1],mtx[i][0],ammo2Speed,ease)

		}
	}

}


/*五角星*/
/*
*1. 正向扩张
* 2. 反向扩张
* 3. 自机狙
* 其他 竖直砸下
* */
function pentagonStar(x,y,size,num,mode) {
	var coord = fillPentagon(size,x,y,num);
	var coolen = coord.length;

	for(var i=0;i<coolen ;i++){

		if( Math.pow((ziji.offsetLeft+37-coord[i][0]),2)+Math.pow((ziji.offsetTop+37-coord[i][1]),2)>1000 ){

			var blt3 = $('#danmaku' + requestDanmaku());
			var toXY = [];
			switch(mode){
				case 1:{
					if(i>=0 && i<coolen/5){
						toXY[0] = 0;
						toXY[1] = -650;
					}else if(i>=coolen/5 && i<coolen*2/5){
						toXY[0] =  650*Math.tan(Math.PI/5)/// + coord[i][0];
						toXY[1] = 650;
					} else if(i>=coolen*2/5 && i<coolen*3/5){
						toXY[0] = -650;
						toXY[1] = -650*Math.tan(Math.PI/5)// - coord[i][0];

					} else if(i>=coolen*3/5 && i<coolen*4/5){
						toXY[0] = 650;
						toXY[1] = -650*Math.tan(Math.PI/5)// - coord[i][0];

					} else {
						toXY[0] = -650;
						toXY[1] = 650*Math.tan(Math.PI/5);
					}
					toXY[0] = "+=" + toXY[0];
					toXY[1] = "+=" + toXY[1];
				};break;
				case 2:{
					if(i>=0 && i<coolen/5){
						toXY[0] = 0;
						toXY[1] = 650;
					}else if(i>=coolen/5 && i<coolen*2/5){
						toXY[0] =  -650*Math.tan(Math.PI/5) // + coord[i][0];
						toXY[1] = -650;
					} else if(i>=coolen*2/5 && i<coolen*3/5){
						toXY[0] = 650;
						toXY[1] = 650*Math.tan(Math.PI/5) //+ coord[i][0];

					} else if(i>=coolen*3/5 && i<coolen*4/5){
						toXY[0] = -650;
						toXY[1] = 650*Math.tan(Math.PI/5) //+ coord[i][0];

					} else {
						toXY[0] = 650;
						toXY[1] = -650*Math.tan(Math.PI/5) //- coord[i][0];
					}
					toXY[0] = "+=" + toXY[0];
					toXY[1] = "+=" + toXY[1];
				};break;
				case 3:{
					toXY = snipeCoord();
				};break;
				default:{
					toXY[0] = "+=0";
					toXY[1] = "+=650";
				};
			}
			blt3.hide();


			shootIt(blt3,coord[i][0],coord[i][1],toXY[0],toXY[1],5000-400*gameSt.diff,"linear",2500-gameSt.diff*200);
			blt3.delay(i*20).fadeIn(1,function () {});

		} else {
			continue;
		}



	}

}
/*外部自机狙*/
function OutLaunch(num) {
	var delay = Math.floor(Math.random()*500+100);
	var rest = num;
	delayLaunch();
	function delayLaunch() {
		var ranX,ranY
		do{
			ranX = Math.floor(Math.random()*630-15);
			ranY = Math.floor(Math.random()*630-15);
		} while(ranX>-10 && ranX<610 && ranY>-10 && ranY<610)
		doLaunch(ranX,ranY,1);
		rest--;
		if(rest>0){
			setTimeout(delayLaunch,delay)
		}
	}




}

/*先横向扩散，再上下来回2轮*/