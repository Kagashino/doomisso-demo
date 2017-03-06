/**
 * Created by Huangchengpei on 2017/2/20.
 * 事件监听器
 */


/*This is for Mouse-click Test for Creating barrage*/
$gameScreen.click(function (e) {
	var X = e.clientX,Y=e.clientY;
	// pentagonStar(X,Y,80,7+2*gameSt.diff,1)
	// pentagonStar(X,Y-50,240,7+2*gameSt.diff,2)
	//OutLaunch(9);
	//blossomLaunch(X,Y,"linear",1,3,1)
	//doLaunch(X,Y,1,0)

})


//Bind KeyBoardEvent
window.onkeydown = function(event){

	var event=event||window.event;//兼容
	var code = event.keyCode || event.which;
	//console.log(event.key)//获取按键名称
	/*开控制台*/

	if(code!==123){
		event.preventDefault();
	}

	switch(code){
		case 13:{					/*ENTER*/
			if(!gameSt.playing){
				gameInit();
			}
		};break;
		case keySt.LS : {keySt.toLSpeed=true; }					;break;//You can check Keycode at Keymap.js at this path
		case keySt.LT : {keySt.toLeft=true; }					;break;
		case keySt.UP : {keySt.toUp=true; }						;break;
		case keySt.RT : {keySt.toRight=true; }					;break;
		case keySt.DN : {keySt.toDown=true; }					;break;
		// case keySt.FR : {keySt.tofire=true; fireUp() }		;break;
		case 80		  : pauseTheGame()							;break;

	}

}



window.onkeyup = function(event){

	var event=event||window.event;
	var code = event.keyCode || event.which;
	switch(code){
		case keySt.LS : keySt.toLSpeed=false		;break;//Release Key to break the loop
		case keySt.LT : keySt.toLeft=false			;break;
		case keySt.UP : keySt.toUp=false			;break;
		case keySt.RT : keySt.toRight=false			;break;
		case keySt.DN : keySt.toDown=false			;break;
		// case keySt.FR : keySt.toFire = false		;break;

	}

}



function showDmkcount() {
	$('#dmkcount').text($('.bullet').length)
}

$('#readme').click(function () {
	$('.layout1').hide();
	$('.layout3').show();
})
$('#gameConfig').click(function () {
	$('.layout1').hide();
	$('.layout2').show();
})
$('.returnMain').click(function () {
	$('.layout').hide();
	$('.layout1').show();
})


/*		难易度选择	*/
$('.selectDiff').click(function () {
	switch(this.innerText){
		case "简单":gameSt.diff = 0;break;
		case "正常":gameSt.diff = 1;break;
		case "疯狂":gameSt.diff = 2;break;
		default: console.log(this.innerText);break;
	}
	$('#difficult').val(this.innerText);
	$('.currDiff').text($('#difficult').val());
	$('.selectDiff').css({ borderColor:"transparent" });
	$(this).css({ borderColor:"#fff" });
	
})

$('.keySet').click(function(){
	alert('developing');
})
