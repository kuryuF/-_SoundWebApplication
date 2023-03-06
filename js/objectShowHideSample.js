//画面サイズの測定
const W_WIDTH = window.parent.screen.width;
const W_HEIGHT = window.parent.screen.height;
console.log("W_WIDTH:" + W_WIDTH + "\nW_HEIGHT:" + W_HEIGHT);

//スマホ画面サイズの指定(360 * 680を想定)
const S_WIDTH = 390;
const S_HEIGHT = 768;


// 使用モジュール
const Engine = Matter.Engine,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Body2 = Matter.Body,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite,
	Composites = Matter.Composites,
	Vector = Matter.Vector,
	Constraint = Matter.Constraint,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse,
	Events = Matter.Events;

// エンジンの生成
const engine = Engine.create();

// 物理演算canvasを挿入する要素
const canvas = $('#canvas-area')[0];

// レンダリングの設定
const render = Render.create({
	element: canvas,
	engine: engine,
	options: {
		width: S_WIDTH,
		height: S_HEIGHT,
		wireframes: false,
		background: "#ffffff",
	}
});

//カラープリセット
const fillWightOptions = {
	render: {
		fillStyle: '#ffffff',
		strokeStyle: '#ffffff',
		lineWidth: 0,
	}
}

const whiteStroke = {
	render: {
		fillStyle: '#000000',
		strokeStyle: '#ffffff',
		lineWidth: 1,
	}
}

const blackStroke = {
	render: {
		fillStyle: '#ffffff',
		strokeStyle: '#000000',
		lineWidth: 1,
	}
}

const r_tomato = {
	render: {
		fillStyle: '#ff7f50',
		strokeStyle: '#ff7f50',
		lineWidth: 1,
	}
}

const r_perple = {
	render: {
		fillStyle: '#84ffc1',
		strokeStyle: '#84ffc1',
		lineWidth: 1,
	}
}

const r_blue = {
	render: {
		fillStyle: '#ffff8e',
		strokeStyle: '#ffff8e',
		lineWidth: 1,
	}
}

const r_green = {
	render: {
		fillStyle: '#c489ff',
		strokeStyle: '#c489ff',
		lineWidth: 1,
	}
}

const fillgray ={
	render:{
		fillStyle: '#e0e0e0',
		lineWidth: 0,
	}
}


// マウス、マウス制約を生成
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
	mouse: mouse,
	constraint: {
		render: {
			visible: false
		}
	}
});

Composite.add(engine.world, mouseConstraint)
render.mouse = mouse

// レンダリングを実行
Render.run(render);

// エンジンを実行
Runner.run(engine);

$('body').append('<p class="coordinate"></p>');
$('body').append('<p class="target"></p>');
$('body').append('<p class="body-counter">NumberOfBalls:<span id="ball_number"></span></p>');
$('body').append('<p class="c_btn">Clear!</p>');
$('body').append('<p class="a_btn">Add!</p>');
$('body').append('<p class="d_btn">ダミー</p>');


// ボール用Compositeを生成する【⑬】
const ballComposite = Composite.create();
Composite.add(engine.world, ballComposite);

//ダミーCompositeの生成
const dummyComposite = Composite.create();
Composite.add(engine.world, dummyComposite);

// 静止オブジェクト（空中の床と画面外落下判定オブジェクト）【⑭】
//下左右の壁
const floor = Bodies.rectangle(S_WIDTH / 2 , S_HEIGHT, 500, 30, { isStatic: true, render: {fillStyle: "#ffffff", strokeStyle:"#000000",lineWidth: 1}});
const leftWall = Bodies.rectangle(0 , S_HEIGHT / 2, 30, S_HEIGHT, { isStatic: true, render: {fillStyle: "#ffffff", strokeStyle:"#000000",lineWidth: 1}});
const rightWall = Bodies.rectangle(S_WIDTH , S_HEIGHT / 2, 30, S_HEIGHT, { isStatic: true, render: {fillStyle: "#ffffff", strokeStyle:"#000000",lineWidth: 1}});
const pit = Bodies.rectangle(S_WIDTH / 2 , S_HEIGHT + 400, 50000, 30, { isStatic: true, label: 'pit' });
Composite.add(engine.world, [floor,leftWall, rightWall, pit]);

// //lineを生成する関数
// let linePos = 0;
// function moveLine(linePos){
// 	console.log("linePos:" + linePos);
// 	const constraint1 = Constraint.create({
// 		//bodyA: compoundBody,
// 		pointA: { x: 0, y: linePos },
// 		pointB: { x: 360, y: linePos },
// 		stiffness: 1
// 	});
// 	Composite.add(engine.world, constraint1);
// 	linePos += 10;
// }

//BLOCKボタンを押したら図形を生成
const block_ary = [];
$(document).on('click', 'img.4block', () => {
	//1/4正方形の生成
	const rect = Bodies.rectangle(S_WIDTH / 2, 100, S_HEIGHT / 8, S_HEIGHT / 8, blackStroke);
	Composite.add(ballComposite, rect);
	block_ary.push(4);

});

$(document).on('click', 'img.2block', () => {
	//二分音符ブロック
	const rect = Bodies.rectangle(S_WIDTH / 2, 100, S_HEIGHT / 16, S_HEIGHT / 4, blackStroke);
	Composite.add(ballComposite, rect);
	block_ary.push(2);
});

$(document).on('click', 'img.8block', () => {
	//八分音符ブロック
	const rect = Bodies.rectangle(S_WIDTH / 2, 100, S_HEIGHT / 16, S_HEIGHT / 16, blackStroke);
	Composite.add(ballComposite, rect);
	block_ary.push(8);
});

$(document).on('click', 'img.16block', () => {
	//16部音符ブロック
	const rect = Bodies.rectangle(S_WIDTH / 2, 100, S_HEIGHT / 16, S_HEIGHT / 32, blackStroke);
	Composite.add(ballComposite, rect);
	block_ary.push(16);
	console.log(block_ary);
});

//posAng情報をhtmlに追加
let obj_index = 1;
$(document).on('click', 'div.blocks', () =>{
	console.log("obj_index:" + obj_index);
	if (obj_index == 1) {
		$('div.obj_btns').append('<p class="obj_btn>object_1</p>');
		$('div.obj_btns').append('<p class="obj1_Pos" id="posAng1"></p>');
	}else if (obj_index == 2)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_2</p>');
		$('div.obj_btns').append('<p class="obj2_Pos" id="posAng2"></p>');
	}else if (obj_index == 3){
		$('div.obj_btns').append('<p class="obj_btn>object_3</p>');
		$('div.obj_btns').append('<p class="obj3_Pos" id="posAng3"></p>');
	}else if (obj_index == 4)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_4</p>');
		$('div.obj_btns').append('<p class="obj4_Pos" id="posAng4"></p>');
	}else if (obj_index == 5)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_5</p>');
		$('div.obj_btns').append('<p class="obj5_Pos" id="posAng5"></p>');
	}else if (obj_index == 6)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_6</p>');
		$('div.obj_btns').append('<p class="obj6_Pos" id="posAng6"></p>');
	}else if (obj_index == 7)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_7</p>');
		$('div.obj_btns').append('<p class="obj7_Pos" id="posAng7"></p>');
	}else if (obj_index == 8)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_8</p>');
		$('div.obj_btns').append('<p class="obj8_Pos" id="posAng8"></p>');
	}else if (obj_index == 9)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_9</p>');
		$('div.obj_btns').append('<p class="obj9_Pos" id="posAng9"></p>');
	}else if (obj_index == 10)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_10</p>');
		$('div.obj_btns').append('<p class="obj10_Pos" id="posAng10"></p>');
	}else if (obj_index == 11)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_11</p>');
		$('div.obj_btns').append('<p class="obj11_Pos" id="posAng11"></p>');
	}else if (obj_index == 12)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_12</p>');
		$('div.obj_btns').append('<p class="obj12_Pos" id="posAng12"></p>');
	}else if (obj_index == 13)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_13</p>');
		$('div.obj_btns').append('<p class="obj13_Pos" id="posAng13"></p>');
	}else if (obj_index == 14)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_14</p>');
		$('div.obj_btns').append('<p class="obj14_Pos" id="posAng14"></p>');
	}else if (obj_index == 15)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_15</p>');
		$('div.obj_btns').append('<p class="obj15_Pos" id="posAng15"></p>');
	}else if (obj_index == 16)
	{
		$('div.obj_btns').append('<p class="obj_btn>object_16</p>');
		$('div.obj_btns').append('<p class="obj16_Pos" id="posAng16"></p>');
	}
	obj_index += 1;
});




// クリックした位置に円を生成とballCompositeへの追加
// let i = 0
// $('img.a_btn').on('click', () => {
// 	// ドラッグ中は生成しない
// 	if (mouseConstraint.body) { return }

// 	if (i % 4 == 0) {
// 		/*
// 		// 半径はランダム（10〜30）;
// 		const min = 10;
// 		const max = 30;
// 		const radius = Math.random() * (max - min) + min;
// 		const ball = Bodies.circle(S_WIDTH / 2, 100, radius, fillgray);
// 		Composite.add(ballComposite, ball);*/

// 		//1/4正方形の生成
// 		const rect = Bodies.rectangle(S_WIDTH / 2, 100, S_HEIGHT / 4, S_HEIGHT / 4, fillgray);
// 		Composite.add(ballComposite, rect);
// 	}
// 	if (i % 4 == 1) {
// 		// const width = 10;
// 		// const height = 10;
// 		// const rect = Bodies.rectangle(S_WIDTH / 2, 100, width * (Math.random() * (height - width) + width), height * (Math.random() * (height - width) + width), fillgray);
// 		// Composite.add(ballComposite, rect);

// 		//二分音符ブロック
// 		const rect = Bodies.rectangle(S_WIDTH / 2, 100, S_HEIGHT / 12, S_HEIGHT / 2, fillgray);
// 		Composite.add(ballComposite, rect);
// 	}
// 	//三角形の生成
// 	if (i % 4 == 2) {
// 		// const polygon_x = S_WIDTH / 2;
// 		// const polygon_y = 100;
// 		// const polygon_sides = 3;
// 		// const polygon_radious = Math.random() * (100 - 60) + 60;

// 		// const polygon = Bodies.polygon(polygon_x, polygon_y, polygon_sides, polygon_radious, fillgray);
// 		// Composite.add(ballComposite, polygon);

// 		//八分音符ブロック
// 		const rect = Bodies.rectangle(S_WIDTH / 2, 100, S_HEIGHT / 8, S_HEIGHT / 8, fillgray);
// 		Composite.add(ballComposite, rect);
// 	}
// 	//台形の生成
// 	if (i % 4 == 3) {
// 		// const tranpezoid_x = S_WIDTH / 2;
// 		// const tranpezoid_y = 100;
// 		// const tranpezoid_width = Math.random() * (200 - 100) + 100;
// 		// const tranpezoid_height = Math.random() * (100 - 50) + 50;
// 		// const tranpezoid_slope = Math.random();

// 		// const tranpezoid = Bodies.trapezoid(tranpezoid_x, tranpezoid_y, tranpezoid_width, tranpezoid_height, tranpezoid_slope, fillgray);
// 		// Composite.add(ballComposite, tranpezoid);

// 		//16部音符ブロック
// 		const rect = Bodies.rectangle(S_WIDTH / 2, 100, S_HEIGHT / 8, S_HEIGHT / 24, fillgray);
// 		Composite.add(ballComposite, rect);
// 	}

// 	i++;
// 	//console.log(i);
// 	switch (i) {
// 		case 1:
// 			$('div.obj_btns').append('<p class="obj_btn1">object_1</p>');
// 			$('div.obj_btns').append('<p class="obj1_Pos" id="posAng1"></p>');
// 			break;
// 		case 2:
// 			$('div.obj_btns').append('<p class="obj_btn2">object_2</p>');
// 			$('div.obj_btns').append('<p class="obj2_Pos"></p>');
// 			break;
// 		case 3:
// 			$('body').append('<p class="obj_btn3">object_3</p>');
// 			$('body').append('<p class="obj3_Pos"></p>');
// 			break;
// 		case 4:
// 			$('body').append('<p class="obj_btn4">object_4</p>');
// 			$('body').append('<p class="obj4_Pos"></p>');
// 			break;
// 		case 5:
// 			$('body').append('<p class="obj_btn5">object_5</p>');
// 			$('body').append('<p class="obj5_Pos"></p>');
// 			break;
// 		case 6:
// 			$('body').append('<p class="obj_btn6">object_6</p>');
// 			$('body').append('<p class="obj6_Pos"></p>');
// 			break;

// 		default:
// 			break;
// 	}
// });


//ダミーブロックの追加と表示
let dummyIndex = 0;
/*$('img.d_btn').on('click', () => {*/
Events.on(mouseConstraint, 'mousedown', e => {
	if (mouseConstraint.body) { return }
	console.log("d_btnClicked!");
	//丸型の生成
	if (dummyIndex % 4 == 0) {
		// // 半径はランダム（10〜30）;
		// const min = 10;
		// const max = 30;
		// const radius = Math.random() * (max - min) + min;
		// const ball = Bodies.circle(e.mouse.position.x, e.mouse.position.y, radius, fillgray);
		// Composite.add(dummyComposite, ball);
		const rect = Bodies.rectangle(e.mouse.position.x, e.mouse.position.y, S_HEIGHT / 8, S_HEIGHT / 8, fillgray);
		Composite.add(dummyComposite, rect);
	}
	//長方形の生成
	if (dummyIndex % 4 == 1) {
		// const width = 100;
		// const height = 100;
		// const rect = Bodies.rectangle(e.mouse.position.x, e.mouse.position.y, width * (Math.random() % 100), height * (Math.random() % 100), fillgray);
		// Composite.add(dummyComposite, rect);
		const rect = Bodies.rectangle(e.mouse.position.x, e.mouse.position.y, S_HEIGHT / 16, S_HEIGHT / 4, fillgray);
		Composite.add(dummyComposite, rect);
	}
	//三角形の生成
	if (dummyIndex % 4 == 2) {
		const polygon_x = S_WIDTH / 2;
		const polygon_y = 100;
		const polygon_sides = 3;
		const polygon_radious = Math.random() * (100 - 60) + 60;

		const polygon = Bodies.polygon(e.mouse.position.x, e.mouse.position.y, polygon_sides, polygon_radious, fillgray);
		Composite.add(dummyComposite, polygon);
	}
	//台形の生成
	if (dummyIndex % 4 == 3) {
		const tranpezoid_x = S_WIDTH / 2;
		const tranpezoid_y = 100;
		const tranpezoid_width = Math.random() * (200 - 100) + 100;
		const tranpezoid_height = Math.random() * (100 - 50) + 50;
		const tranpezoid_slope = Math.random();

		const tranpezoid = Bodies.trapezoid(e.mouse.position.x, e.mouse.position.y, tranpezoid_width, tranpezoid_height, tranpezoid_slope, fillgray);
		Composite.add(dummyComposite, tranpezoid);
	}
	dummyIndex++;

});

// Engineモジュールに対するイベント/衝突の発生を検知する【⑮】
Events.on(engine, 'collisionStart', e => {
	$.each(e.pairs, (i, pair) => {
		// 画面外落下判定オブジェクトに衝突したボールを削除する
		if (pair.bodyA.label === 'pit') {
			Composite.remove(ballComposite, pair.bodyB);
			Composite.remove(dummyComposite, pair.bodyB);
		}
	})
});

// Compositeへのオブジェクト追加を検知してボール総数の表示を更新する【⑯】
Events.on(ballComposite, 'afterAdd', e => {
	// Eventオブジェクトを直接参照してCompositeに含まれる全bodyを取得
	$('p.body-counter span').text(e.source.bodies.length);
});
// Compositeからのオブジェクト削除を検知してボール総数の表示を更新する【⑯】
Events.on(ballComposite, 'afterRemove', () => {
	// Composite#allBodies()を利用してCompositeに含まれる全bodyを取得
	$('p.body-counter span').text(Composite.allBodies(ballComposite).length);
});


let obj_flag = -1;
//オブジェクトボタン1が押された時
$(document).on('click', 'p.obj_btn1', () => {
	//console.log("obj_btn1-clicked!");
	obj_flag = 0;
	console.log(obj_flag);
	//ballComposite.bodies[0].render.fillStyle = '#ff7f50';
	ballComposite.bodies[0].render.strokeStyle = '#ff7f50';
	ballComposite.bodies[0].render.lineWidth = 2;
	console.log(ballComposite.bodies[0].position.x);
	resetObjColor(0);
});

//オブジェクトボタン2が押された時
$(document).on('click', 'p.obj_btn2', () => {
	//console.log("obj_btn1-clicked!");
	obj_flag = 1;
	//ballComposite.bodies[1].render.fillStyle = '#84ffc1';
	ballComposite.bodies[1].render.strokeStyle = '#84ffc1';
	ballComposite.bodies[1].render.lineWidth = 2;
	//console.log(ballComposite);
	resetObjColor(1);
});

//オブジェクトボタン3が押された時
$(document).on('click', 'p.obj_btn3', () => {
	//console.log("obj_btn1-clicked!");
	obj_flag = 2;
	//ballComposite.bodies[1].render.fillStyle = '#84ffc1';
	ballComposite.bodies[2].render.strokeStyle = '#1e90ff';
	ballComposite.bodies[2].render.lineWidth = 2;
	//console.log(ballComposite);
	resetObjColor(2);
});

//オブジェクトボタン4が押された時
$(document).on('click', 'p.obj_btn4', () => {
	//console.log("obj_btn1-clicked!");
	obj_flag = 3;
	//ballComposite.bodies[1].render.fillStyle = '#84ffc1';
	ballComposite.bodies[3].render.strokeStyle = '#ffff8e';
	ballComposite.bodies[3].render.lineWidth = 2;
	//console.log(ballComposite);
	resetObjColor(3);
});

//オブジェクトボタン5が押された時
$(document).on('click', 'p.obj_btn5', () => {
	//console.log("obj_btn1-clicked!");
	obj_flag = 4;
	//ballComposite.bodies[1].render.fillStyle = '#84ffc1';
	ballComposite.bodies[4].render.strokeStyle = '#c489ff';
	ballComposite.bodies[4].render.lineWidth = 2;
	//console.log(ballComposite);
	resetObjColor(4);
});

//clearボタンで画面上のオブジェクトを全て消去
$('span.c_btn').on('click', () => {
	// ボールを一括削除する【⑰】
	for (let j = 0; j < ballComposite.bodies.length; j++) {
		//ballComposite.bodies[0].render = fillWightOptions;
		//console.log(ballComposite.bodies[j].render);

		//objectの座標を非表示にする
		$('p.obj' + (j + 1) + '_Pos').text("");
		console.log("objectMessDeleted!");
	}
	//console.log(ballComposite.bodies);
	Composite.clear(ballComposite);
	Composite.clear(dummyComposite);
	$('p.body-counter span').text(0);
});

//音量offボタンが押された時
$(document).on('click', 'span.sound_off', () => {
	console.log('sound_off clicked!');
	let text = document.getElementById('sound_btn').innerHTML;
	console.log(text);
	document.getElementById('sound_btn').innerHTML = '<span class="material-symbols-outlined sound_on">volume_up</span>';
	return;
});

//音量onボタンが押された時
$(document).on('click', 'span.sound_on', () => {
	console.log('sound_on clicked!');
	let text = document.getElementById('sound_btn').innerHTML;
	console.log(text);
	document.getElementById('sound_btn').innerHTML = '<span class="material-symbols-outlined sound_off">volume_off</span>';
	return;
});


//クリックされたボタン以外の枠を白でリセットする関数
function resetObjColor(num) {
	let index = 0;
	while (index < 10) {
		//num番目をリセットから除外
		if (num == index) {
			index++;
		}

		//オブジェクトの色を白枠でリセット
		ballComposite.bodies[index].render.fillStyle = '#000000';
		ballComposite.bodies[index].render.strokeStyle = '#ffffff';
		ballComposite.bodies[index].render.lineWidth = 1;

		index++;
	}
}

//オブジェクトの座標と角度(ラジアンを弧度法に変換にした値)をclass="objn_Pos"タグに表示させる
function getObjPosAng() {
	//console.log("getPosAng");
	let n = 0;
	while (n < 16) {
		if (ballComposite.bodies[n] != undefined) {
			let obj_posX = Math.floor(ballComposite.bodies[n].position.x);
			let obj_posY = Math.floor(ballComposite.bodies[n].position.y);
			let obj_angle = Math.floor((180 / 3.14 * (ballComposite.bodies[n].angle)) % 360);
			$('p.obj' + (n + 1) + '_Pos').text(`X/${obj_posX}/Y/${obj_posY}/R/${obj_angle}`);
		}
		n++;
	}
}

//outputされた01を取得してオブジェクトを白く塗りつぶす関数
function makeFillObj() {
	//console.log("makeFillObj()");
	let strOut1 = document.getElementById('outport1').innerHTML;
	let strOut2 = document.getElementById('outport2').innerHTML;
	let strOut3 = document.getElementById('outport3').innerHTML;
	let strOut4 = document.getElementById('outport4').innerHTML;
	//console.log(strOut.split(' '));
	//let outNumber = strOut.split(' ');
	if (ballComposite.bodies[0] == undefined )
		return;
	if (Number(strOut1) == 0)
		ballComposite.bodies[0].render.fillStyle = '#000000'
	if (Number(strOut1) == 1)
		ballComposite.bodies[0].render.fillStyle = '#ff6347';
	if (ballComposite.bodies[1] == undefined)
		return;
	if (Number(strOut2) == 0)
		ballComposite.bodies[1].render.fillStyle = '#000000'
	if (Number(strOut2) == 1)
		ballComposite.bodies[1].render.fillStyle = '#9932cc';
	if (ballComposite.bodies[2] == undefined)
		return;
	if (Number(strOut3) == 0)
		ballComposite.bodies[2].render.fillStyle = '#000000'
	if (Number(strOut3) == 1)
		ballComposite.bodies[2].render.fillStyle = '#00bfff';
	if (ballComposite.bodies[3] == undefined)
		return;
	if (Number(strOut4) == 0)
		ballComposite.bodies[3].render.fillStyle = '#000000'
	if (Number(strOut4) == 1)
		ballComposite.bodies[3].render.fillStyle = '#98fb98';
}

//masterCountとオブジェクトの底辺座標が一致したらふちをかえる
//var masterCount = 0;
// function ckeckCollision(masterCount){
// 	console.log("masterCount:" + masterCount);
// }

//移動させているオブジェクト名を表示
Events.on(mouseConstraint, 'mousemove', e => {
	$('p.coordinate').text(`X: ${e.mouse.position.x} Y: ${e.mouse.position.y}`);
	const label = mouseConstraint.body ? mouseConstraint.body.label : '';
	$('p.target').text(`Dragging ${label}`);
	/*
	const posX = mouseConstraint.body ? mouseConstraint.body.position.x: '';
	const posY = mouseConstraint.body ? mouseConstraint.body.position.y: '';

	if (posX == '' && posY == '') {
		return;
	}else{
		//getObjPosition(posX, posY);
		console.log("posX:" + posX + "posY: " + posY);
		if (obj_flag == 0) {
			$('p.obj1_Pos').text(`X: ${ballComposite.bodies[0].position.x} Y: ${ballComposite.bodies[0].position.y}`);
		}else if (obj_flag == 1){
			$('p.obj2_Pos').text(`X: ${e.mouse.position.x} Y: ${e.mouse.position.y}`);
		}else{
			return;
		}
	}*/
});
/*
window.onload = function(){
	setInterval("getObjPosAng()", 100);
}*/

//クオンタイズの関数（y座標を無理やりグリッドに合わせる）
function qiantise(posY){
	if (0 < posY && posY < 42.5) {
		return (21.25);
	}else if (42.5 <= posY && posY < 85){
		return (63.75);
	}else if (85 <= posY && posY < 127.5){
		return(103.25);
	}else if (127.5 <= posY && posY < 170){
		return(148.75);
	}else if (170 <= posY && posY < 212.5){
		return(191.25);
	}else if (212.5 <= posY && posY < 255){
		return(233.75);
	}else if (255 <= posY && posY < 297.5){
		return(276.25);
	}else if (297.5 <= posY && posY < 340){
		return(318.75);
	}else if (340 <= posY && posY < 382.5){
		return(361.25);
	}else if (382.5 <= posY && posY < 425){
		return(403.75);
	}else if (425 <= posY && posY < 467.5){
		return(466.25);
	}else if (467.5 <= posY && posY < 510){
		return(488.75);
	}else if (510 <= posY && posY < 552.5){
		return(531.25);
	}else if (552.5 <= posY && posY < 595){
		return(573.75);
	}else if (595 <= posY && posY < 637){
		return(616.25);
	}else{
		return(658.25);
	}

}

//ソナーのあたり判定と縁取りの色変える
function get_collision(){
	let sonerPos = document.getElementById("test");
	//console.log("soner:" + sonerPos.textContent);

	let under_obj1 = document.getElementById("posAng1");
	let under_obj2 = document.getElementById("posAng2");
	let under_obj3 = document.getElementById("posAng3");
	let under_obj4 = document.getElementById("posAng4");
	let under_obj5 = document.getElementById("posAng5");
	let under_obj6 = document.getElementById("posAng6");
	let under_obj7 = document.getElementById("posAng7");
	let under_obj8 = document.getElementById("posAng8");
	let under_obj9 = document.getElementById("posAng9");
	let under_obj10 = document.getElementById("posAng10");
	let under_obj11 = document.getElementById("posAng11");
	let under_obj12 = document.getElementById("posAng12");
	let under_obj13 = document.getElementById("posAng13");
	let under_obj14 = document.getElementById("posAng14");
	let under_obj15 = document.getElementById("posAng15");
	let under_obj16 = document.getElementById("posAng16");

	let note1 = document.getElementById("note66");
	let note2 = document.getElementById("note72");
	let note3 = document.getElementById("note76");
	let note4 = document.getElementById("note81");

	if (under_obj1 == null) return;
	let split_under_obj1 = under_obj1.textContent.split('/');
	//let obj1_y = qiantise(Number(split_under_obj1[3]));
	if (Number(sonerPos.textContent) == Math.floor(Number(split_under_obj1[3])))
	{
		console.log("obj_1_collision!");
		if (block_ary[0] == 4){
			ballComposite.bodies[0].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[0] == 2){
			ballComposite.bodies[0].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[0] == 8){
			ballComposite.bodies[0].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[0] == 16){
			ballComposite.bodies[0].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}

	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[0].render.fillStyle = '#ffffff';
			ballComposite.bodies[0].render.strokeStyle = '#000000';
			ballComposite.bodies[0].render.lineWidth = 1;
		}
		if (block_ary[0] == 4){
			note1.textContent = "0";
		}
		if (block_ary[0] == 2){
			note2.textContent = "0";
		}
		if (block_ary[0] == 8){
			note3.textContent = "0";
		}
		if (block_ary[0] == 16){
			note4.textContent = "0";
		}
	}
	//obj2のあたり判定
	if (under_obj2 == null) return;
	let split_under_obj2 = under_obj2.textContent.split('/');
	if (Number(sonerPos.textContent) == Math.floor(Number(split_under_obj2[3])))
	{
		console.log("obj_2_collision!");
		//ballComposite.bodies[1].render.lineWidth = 4;
		if (block_ary[1] == 4){
			ballComposite.bodies[1].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[1] == 2){
			ballComposite.bodies[1].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[1] == 8){
			ballComposite.bodies[1].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[1] == 16){
			ballComposite.bodies[1].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[1].render.fillStyle = '#ffffff';
			ballComposite.bodies[1].render.strokeStyle = '#000000';
			ballComposite.bodies[1].render.lineWidth = 1;
		}
		if (block_ary[1] == 4){
			note1.textContent = "0";
		}
		if (block_ary[1] == 2){
			note2.textContent = "0";
		}
		if (block_ary[1] == 8){
			note3.textContent = "0";
		}
		if (block_ary[1] == 16){
			note4.textContent = "0";
		}
	}
	//obj3のあたり判定
	if (under_obj3 == null) return;
	let split_under_obj3 = under_obj3.textContent.split('/');
	if (Number(sonerPos.textContent) ==Math.floor(Number(split_under_obj3[3])))
	{
		console.log("obj_3_collision!");
		if (block_ary[2] == 4){
			ballComposite.bodies[2].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[2] == 2){
			ballComposite.bodies[2].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[2] == 8){
			ballComposite.bodies[2].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[2] == 16){
			ballComposite.bodies[2].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[2].render.fillStyle = '#ffffff';
			ballComposite.bodies[2].render.strokeStyle = '#000000';
			ballComposite.bodies[2].render.lineWidth = 1;
		}
		if (block_ary[2] == 4){
			note1.textContent = "0";
		}
		if (block_ary[2] == 2){
			note2.textContent = "0";
		}
		if (block_ary[2] == 8){
			note3.textContent = "0";
		}
		if (block_ary[2] == 16){
			note4.textContent = "0";
		}
	}
	//obj4のあたり判定
	if (under_obj4 == null) return;
	let split_under_obj4 = under_obj4.textContent.split('/');
	if (Number(sonerPos.textContent) == Math.floor(Number(split_under_obj4[3])))
	{
		console.log("obj_4_collision!");
		if (block_ary[3] == 4){
			ballComposite.bodies[3].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[3] == 2){
			ballComposite.bodies[3].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[3] == 8){
			ballComposite.bodies[3].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[3] == 16){
			ballComposite.bodies[3].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[3].render.fillStyle = '#ffffff';
			ballComposite.bodies[3].render.strokeStyle = '#000000';
			ballComposite.bodies[3].render.lineWidth = 1;
		}
		if (block_ary[3] == 4){
			note1.textContent = "0";
		}
		if (block_ary[3] == 2){
			note2.textContent = "0";
		}
		if (block_ary[3] == 8){
			note3.textContent = "0";
		}
		if (block_ary[3] == 16){
			note4.textContent = "0";
		}

	}
	//obj5のあたり判定
	if (under_obj5 == null) return;
	let split_under_obj5 = under_obj5.textContent.split('/');
	if (Number(sonerPos.textContent) == Math.floor(Number(split_under_obj5[3])))
	{
		console.log("obj_5_collision!");
		if (block_ary[4] == 4){
			ballComposite.bodies[4].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[4] == 2){
			ballComposite.bodies[4].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[4] == 8){
			ballComposite.bodies[4].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[4] == 16){
			ballComposite.bodies[4].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[4].render.fillStyle = '#ffffff';
			ballComposite.bodies[4].render.strokeStyle = '#000000';
			ballComposite.bodies[4].render.lineWidth = 1;
		}
		if (block_ary[4] == 4){
			note1.textContent = "0";
		}
		if (block_ary[4] == 2){
			note2.textContent = "0";
		}
		if (block_ary[4] == 8){
			note3.textContent = "0";
		}
		if (block_ary[4] == 16){
			note4.textContent = "0";
		}
	}
	//obj6のあたり判定
	if (under_obj6 == null) return;
	let split_under_obj6 = under_obj6.textContent.split('/');
	if (Number(sonerPos.textContent) == Math.floor(Number(split_under_obj6[3])))
	{
		console.log("obj_6_collision!");
		if (block_ary[5] == 4){
			ballComposite.bodies[5].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[5] == 2){
			ballComposite.bodies[5].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[5] == 8){
			ballComposite.bodies[5].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[5] == 16){
			ballComposite.bodies[5].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[5].render.fillStyle = '#ffffff';
			ballComposite.bodies[5].render.strokeStyle = '#000000';
			ballComposite.bodies[5].render.lineWidth = 1;
		}
		if (block_ary[5] == 4){
			note1.textContent = "0";
		}
		if (block_ary[5] == 2){
			note2.textContent = "0";
		}
		if (block_ary[5] == 8){
			note3.textContent = "0";
		}
		if (block_ary[5] == 16){
			note4.textContent = "0";
		}
	}
	//obj7のあたり判定
	if (under_obj7 == null) return;
	let split_under_obj7 = under_obj7.textContent.split('/');
	//console.log(split_under_obj7);
	if (Number(sonerPos.textContent) == Math.floor(Number(split_under_obj7[3])))
	{
		console.log("obj_7_collision!");
		if (block_ary[6] == 4){
			ballComposite.bodies[6].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[6] == 2){
			ballComposite.bodies[6].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[6] == 8){
			ballComposite.bodies[6].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[6] == 16){
			ballComposite.bodies[6].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[6].render.fillStyle = '#ffffff';
			ballComposite.bodies[6].render.strokeStyle = '#000000';
			ballComposite.bodies[6].render.lineWidth = 1;
		}
		if (block_ary[6] == 4){
			note1.textContent = "0";
		}
		if (block_ary[6] == 2){
			note2.textContent = "0";
		}
		if (block_ary[6] == 8){
			note3.textContent = "0";
		}
		if (block_ary[6] == 16){
			note4.textContent = "0";
		}
	}
	//obj8のあたり判定
	if (under_obj8 == null) return;
	let split_under_obj8 = under_obj8.textContent.split('/');
	if (Number(sonerPos.textContent) == Math.floor(Number(split_under_obj8[3])))
	{
		console.log("obj_8_collision!");
		if (block_ary[7] == 4){
			ballComposite.bodies[7].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[7] == 2){
			ballComposite.bodies[7].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[7] == 8){
			ballComposite.bodies[7].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[7] == 16){
			ballComposite.bodies[7].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[7].render.fillStyle = '#ffffff';
			ballComposite.bodies[7].render.strokeStyle = '#000000';
			ballComposite.bodies[7].render.lineWidth = 1;
		}
		if (block_ary[7] == 4){
			note1.textContent = "0";
		}
		if (block_ary[7] == 2){
			note2.textContent = "0";
		}
		if (block_ary[7] == 8){
			note3.textContent = "0";
		}
		if (block_ary[7] == 16){
			note4.textContent = "0";
		}
	}
	//obj9のあたり判定
	if (under_obj9 == null) return;
	let split_under_obj9 = under_obj9.textContent.split('/');
	if (Number(sonerPos.textContent) == Math.floor(Number(split_under_obj9[3])))
	{
		console.log("obj_9_collision!");
		if (block_ary[8] == 4){
			ballComposite.bodies[8].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[8] == 2){
			ballComposite.bodies[8].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[8] == 8){
			ballComposite.bodies[8].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[8] == 16){
			ballComposite.bodies[8].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[8].render.fillStyle = '#ffffff';
			ballComposite.bodies[8].render.strokeStyle = '#000000';
			ballComposite.bodies[8].render.lineWidth = 1;
		}
		if (block_ary[8] == 4){
			note1.textContent = "0";
		}
		if (block_ary[8] == 2){
			note2.textContent = "0";
		}
		if (block_ary[8] == 8){
			note3.textContent = "0";
		}
		if (block_ary[8] == 16){
			note4.textContent = "0";
		}
	}
	//obj10のあたり判定
	if (under_obj10 == null) return;
	let split_under_obj10 = under_obj10.textContent.split('/');
	if (Number(sonerPos.textContent) == Math.floor(Number(split_under_obj10[3])))
	{
		console.log("obj_10_collision!");
		if (block_ary[9] == 4){
			ballComposite.bodies[9].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[9] == 2){
			ballComposite.bodies[9].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[9] == 8){
			ballComposite.bodies[9].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[9] == 16){
			ballComposite.bodies[9].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[9].render.fillStyle = '#ffffff';
			ballComposite.bodies[9].render.strokeStyle = '#000000';
			ballComposite.bodies[9].render.lineWidth = 1;
		}
		if (block_ary[9] == 4){
			note1.textContent = "0";
		}
		if (block_ary[9] == 2){
			note2.textContent = "0";
		}
		if (block_ary[9] == 8){
			note3.textContent = "0";
		}
		if (block_ary[9] == 16){
			note4.textContent = "0";
		}
	}
	//obj11のあたり判定
	if (under_obj11 == null) return;
	let split_under_obj11 = under_obj11.textContent.split('/');
	if (Number(sonerPos.textContent) == Number(split_under_obj11[3]))
	{
		console.log("obj_11_collision!");
		if (block_ary[10] == 4){
			ballComposite.bodies[10].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[10] == 2){
			ballComposite.bodies[10].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[10] == 8){
			ballComposite.bodies[10].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[10] == 16){
			ballComposite.bodies[10].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[10].render.fillStyle = '#ffffff';
			ballComposite.bodies[10].render.strokeStyle = '#000000';
			ballComposite.bodies[10].render.lineWidth = 1;
		}
		if (block_ary[10] == 4){
			note1.textContent = "0";
		}
		if (block_ary[10] == 2){
			note2.textContent = "0";
		}
		if (block_ary[10] == 8){
			note3.textContent = "0";
		}
		if (block_ary[10] == 16){
			note4.textContent = "0";
		}
	}
	//obj12のあたり判定
	if (under_obj12 == null) return;
	let split_under_obj12 = under_obj12.textContent.split('/');
	if (Number(sonerPos.textContent) == Number(split_under_obj12[3]))
	{
		console.log("obj_12_collision!");
		if (block_ary[11] == 4){
			ballComposite.bodies[11].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[11] == 2){
			ballComposite.bodies[11].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[11] == 8){
			ballComposite.bodies[11].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[11] == 16){
			ballComposite.bodies[11].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[11].render.fillStyle = '#ffffff';
			ballComposite.bodies[11].render.strokeStyle = '#000000';
			ballComposite.bodies[11].render.lineWidth = 1;
		}
		if (block_ary[11] == 4){
			note1.textContent = "0";
		}
		if (block_ary[11] == 2){
			note2.textContent = "0";
		}
		if (block_ary[11] == 8){
			note3.textContent = "0";
		}
		if (block_ary[11] == 16){
			note4.textContent = "0";
		}
	}
	//obj13のあたり判定
	if (under_obj13 == null) return;
	let split_under_obj13 = under_obj13.textContent.split('/');
	if (Number(sonerPos.textContent) == Number(split_under_obj13[3]))
	{
		console.log("obj_13_collision!");
		if (block_ary[12] == 4){
			ballComposite.bodies[12].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[12] == 2){
			ballComposite.bodies[12].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[12] == 8){
			ballComposite.bodies[12].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[12] == 16){
			ballComposite.bodies[12].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[12].render.fillStyle = '#ffffff';
			ballComposite.bodies[12].render.strokeStyle = '#000000';
			ballComposite.bodies[12].render.lineWidth = 1;
		}
		if (block_ary[12] == 4){
			note1.textContent = "0";
		}
		if (block_ary[12] == 2){
			note2.textContent = "0";
		}
		if (block_ary[12] == 8){
			note3.textContent = "0";
		}
		if (block_ary[12] == 16){
			note4.textContent = "0";
		}
	}
	//obj14のあたり判定
	if (under_obj14 == null) return;
	let split_under_obj14 = under_obj14.textContent.split('/');
	if (Number(sonerPos.textContent) == Number(split_under_obj14[3]))
	{
		console.log("obj_14_collision!");
		if (block_ary[13] == 4){
			ballComposite.bodies[13].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[13] == 2){
			ballComposite.bodies[13].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[13] == 8){
			ballComposite.bodies[13].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[13] == 16){
			ballComposite.bodies[13].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[13].render.fillStyle = '#ffffff';
			ballComposite.bodies[13].render.strokeStyle = '#000000';
			ballComposite.bodies[13].render.lineWidth = 1;
		}
		if (block_ary[13] == 4){
			note1.textContent = "0";
		}
		if (block_ary[13] == 2){
			note2.textContent = "0";
		}
		if (block_ary[13] == 8){
			note3.textContent = "0";
		}
		if (block_ary[13] == 16){
			note4.textContent = "0";
		}
	}
	//obj15のあたり判定
	if (under_obj15 == null) return;
	let split_under_obj15 = under_obj15.textContent.split('/');
	if (Number(sonerPos.textContent) == Number(split_under_obj15[3]))
	{
		console.log("obj_15_collision!");
		if (block_ary[14] == 4){
			ballComposite.bodies[14].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[14] == 2){
			ballComposite.bodies[14].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[14] == 8){
			ballComposite.bodies[14].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[14] == 16){
			ballComposite.bodies[14].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[14].render.fillStyle = '#ffffff';
			ballComposite.bodies[14].render.strokeStyle = '#000000';
			ballComposite.bodies[14].render.lineWidth = 1;
		}
		if (block_ary[14] == 4){
			note1.textContent = "0";
		}
		if (block_ary[14] == 2){
			note2.textContent = "0";
		}
		if (block_ary[14] == 8){
			note3.textContent = "0";
		}
		if (block_ary[14] == 16){
			note4.textContent = "0";
		}
	}
	//obj16のあたり判定
	if (under_obj16 == null) return;
	let split_under_obj16 = under_obj16.textContent.split('/');
	if (Number(sonerPos.textContent) == Number(split_under_obj16[3]))
	{
		console.log("obj_16_collision!");
		if (block_ary[15] == 4){
			ballComposite.bodies[15].render.fillStyle = '#ff7f50';
			note1.textContent = "1";
			return;
		}
		if (block_ary[15] == 2){
			ballComposite.bodies[15].render.fillStyle = '#c489ff';
			note2.textContent = "1";
			return;
		}
		if (block_ary[15] == 8){
			ballComposite.bodies[15].render.fillStyle = '#84ffc1';
			note3.textContent = "1";
			return;
		}
		if (block_ary[15] == 16){
			ballComposite.bodies[15].render.fillStyle = '#ffff8e';
			note4.textContent = "1";
			return;
		}
	}else{
		if (Number(sonerPos.textContent) == 660) {
			ballComposite.bodies[15].render.fillStyle = '#ffffff';
			ballComposite.bodies[15].render.strokeStyle = '#000000';
			ballComposite.bodies[15].render.lineWidth = 1;
		}
		if (block_ary[15] == 4){
			note1.textContent = "0";
		}
		if (block_ary[15] == 2){
			note2.textContent = "0";
		}
		if (block_ary[15] == 8){
			note3.textContent = "0";
		}
		if (block_ary[15] == 16){
			note4.textContent = "0";
		}
	}
}

function lock_objAng(){
	//console.log(ballComposite.bodies.length);
    for (var i = 0; i < ballComposite.bodies.length; i++) {
		//console.lof(i);
        Matter.Body.setAngularVelocity(ballComposite.bodies[i], 0)
    }
	// for (var j = 0; j < dummyComposite.bodies.length; j++) {
	// 	Matter.Body.setAngularVelocity(dummyComposite.bodies[j], 0)
	// }
}

//マウス操作 -canvasがpcでスクロール可能にする(スマホは非対応)
mouseConstraint.mouse.element.removeEventListener(
	"mousewheel",
	mouseConstraint.mouse.mousewheel
);
mouseConstraint.mouse.element.removeEventListener(
	"DOMMouseScroll",
	mouseConstraint.mouse.mousewheel
);

//常に呼び出されている関数
window.addEventListener('load', function () {
	//setInterval("makeFillObj()", 10);
	//setInterval("ckeckCollision(masterCount)", 100);
	//setInterval("moveLine(linePos)", 1000);
setInterval("lock_objAng()", 10);
	setInterval("getObjPosAng()", 100);
setInterval("get_collision()", 5);
});
