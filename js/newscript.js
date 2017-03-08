//键盘
var keySt = {
			UP: 38,
			DN: 40,
			LT: 37,
			RT: 39,
			LS: 16,

			toUp: false, 
			toDown: false, 
			toLeft: false, 
			toRight: false, 
			toLSpeed: false, 
			toShow: false,
			toFire: false, 
			toPause: false, 
		}



//状态
var gameSt = {
			playing: false, //初始化 
			timer: null,//主定时器
			boss: false,/**/
			stop: true, 
			paused : false,
			graze : 0,//擦弹
			hp : 50,
			enegy : 0,
			score : 0,
			diff : 2 //难易度
		}
var timer = {
			general: null,
			fireCon: null,
			enemyCreator: null,//敌机生成器
			enemy2Creator: null,
			overflowOperator: null,
			releaseBoss:null,
			stg1: { enemy1: null, enemy2: null, boss: null },
			stg2: {},
}

var boss = {
	health:300,
	position:[],
	state:1
}


//自机
var ziji = document.getElementById('p_ship');
var spot = $('#p_spot');//判定点
var $enemy1 = $('.enemy1');
var $enemy2 = $('.enemy2');
var $boss1 = $('.boss1');

//画布
var $gameScreen = $('#gameScreen');
var $startBtn = $('#startBtn,#startBtn2');
$startBtn.click(function(){
	if(!gameSt.playing){
		gameInit();
	}
});



$(function () {

	/*按键显示逻辑*/
    var getKeyCode = keyMap();
    for(i in keySt){

    	for(code in getKeyCode){
    		if(keySt[i]==code){
    			refreshKeyInfo(i,getKeyCode[code])
			}
		}
	}

	/*难易度显示逻辑*/
	$('.currDiff').text($('#difficult').val());
	$('.selectDiff').each(function () {
		if($(this).text()==$('#difficult').val()){
			$(this).css({ borderColor:"#fff" });
		}
	})




})

function refreshKeyInfo(i,keyName) {
	var span = document.getElementById(i+"KeySet");
	span.innerText = keyName;
}
/*生成弹幕池*/
function initDanmaku(){
	var dmFrag = document.createDocumentFragment();
	for(var i=0; i<511; i++){
		var elem = document.createElement("p");
		elem.id = "danmaku"+i;
		elem.className = "poolBlt";
		elem.title = "1";
		resetObject(elem,"620px","620px")
		dmFrag.appendChild(elem);
	}
	$gameScreen.append(dmFrag);
	return true;
}
/*请求弹幕池*/
function requestDanmaku() {
	if(gameSt.playing){
		for(var i=0; i<511; i++){
			if(document.getElementById("danmaku"+i).title==="1"){
				document.getElementById("danmaku"+i).title = "2";
				return i;
			}

		}
	}
	
}

//初始化
function gameInit(){
	gameSt.stop = gameSt.paused = keySt.toShow = false;
	initDanmaku();
	gameContinue();
}

//开始和继续游戏
function gameContinue(){

	$('.layout').hide();
	gameSt.playing = true;
	gameProccess();
	clearInterval(timer.general);
	timer.general=null;

	timer.openFire = setTimeout(fireUp,1);
	timer.general = setInterval(zijiOperator,21);
}
/*生成敌人*/
function createEnemy(){
	//生成敌人1和敌人2
	timer.enemyCreator = setInterval(function(){
		if($('.left').length==0 && $('.right').length==0){
			var both = Math.random()>0.1?1:0;//是否两边出飞机
			if(both){
				drawEnemy1(1,2+gameSt.diff,4500 - gameSt.diff*500);
				drawEnemy1(0,2+gameSt.diff,4500 - gameSt.diff*500);
			} else {
				var lr = Math.random()>0.5?1:0;
				drawEnemy1(lr,3+gameSt.diff*2,4500 - gameSt.diff*500);
			}

		}
		timer.enemy2Creator = setTimeout(drawEnemy2,(Math.random()*1000+200))
	},1000)
}



/*游戏流程控制*/
function gameProccess(){
    clearInterval(timer.overflowOperator);
    clearInterval(timer.enemyCreator);
	timer.overflowOperator = timer.enemyCreator = null;

	// /*用完记得删哈*/
	// gameSt.operator = setInterval(function () {
	// 	ammoOperating();
	// 	showDmkcount()
	// },200)


    //回收子弹和横向敌人
    if(gameSt.playing) {
		createEnemy();
		timer.overflowOperator = setInterval(function () {
			ammoOperating();
			enemy1Operating();

		}, 200)
	}

	//生成BOSS
	timer.releaseBoss = setTimeout(BossInSight,30000)


}

function BossInSight() {

	if(gameSt.playing && !gameSt.boss){
		clearTimeout(timer.releaseBoss);
		console.log("Enemy Ultra Cruiser is Approaching!")
		clearInterval(timer.enemy2Creator);
		clearInterval(timer.enemyCreator);
		timer.enemy2Creator = timer.enemyCreator = null;
		gameSt.boss = true;
		drawBoss();
	}

}

function  BossDie() {
	$('#theBoss').removeClass('damagedBoss').stop().remove();
	gameSt.boss = false;
	boss.state = 1;

	createEnemy();
	setTimeout(BossInSight,30000);
}


//结束游戏
function endGame(){
    gameSt.playing = gameSt.boss = false;

	clearTimeout(timer.openFire);
	alert("你的生命值被耗尽，游戏结束");
	
	alert("最终得分："+gameSt.score);

	keySt.toUp = keySt.toDown = keySt.toLeft = keySt.toRight = keySt.toLSpeed = keySt.toFire =  false;

	clearInterval(timer.enemyCreator);
	clearInterval(timer.overflowOperator);
	clearInterval(timer.general);
	clearTimeout(timer.enemy2Creator);
	clearTimeout(timer.releaseBoss);
	clearTimeout(bossAction);

	for(item in timer){
		timer[item]=null
	}

	//timer.enemy2Creator = timer.enemyCreator = timer.overflowOperator = timer.general = timer.openFire = timer.releaseBoss = null;

	$('.enemy1,.enemy2,.bullet,#theBoss,.poolBlt').stop().remove();

	resetObject(ziji,"250px","300px");
	resetData();

	$('.layout1').show();

}


//重置数据
function resetData(hp,score,graze){
	gameSt.hp = hp || 50;
	gameSt.score = score || 0;
	gameSt.graze = graze || 0;
	$('#hitCount').html(gameSt.hp);
	$('#zijiPos').html(gameSt.graze);
	$('#score').html(gameSt.score);
}

