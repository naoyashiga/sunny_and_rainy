var INTENSITY = 300;
function ParticleSystem(ctx,width,height,intensity){
	this.drops = [];
	this.intensity = intensity;

	this.addDrop = function(){
		this.drops.push(new Drop(ctx,width,height));
	}

	while(intensity--){
		this.addDrop();
	}
	//マウスの移動量で雨量を変える
	this.changeIntensity = function(mouseY){
		var heightRatio = mouseY / height;
		var currentIntensity = this.intensity * heightRatio;
		
		for(var i = 0,drop;drop = this.drops[i];i++){

			if(i <= currentIntensity){
				drop.alpha = 1;
			}else{
				drop.alpha = 0;
			}

		}

	}
	this.getGradient = function(mouseY){
		//グラデーションの領域
		var grad = ctx.createLinearGradient(0,0,0,height);
		//y座標の位置
		var yRatio = mouseY / height; 
		var blue = 255 * yRatio | 0;
		var green = 211 * yRatio | 0;

		blue = 255 - blue;
		green = 211 - green;

		var c = 255 - (255 * yRatio | 0);
		//console.log(yRatio + " " + blue);
		//グラデーションの始点と終点
		grad.addColorStop(0,"rgb(0,"+green+","+blue+")");
		//grad.addColorStop(yRatio,"rgb(0,202,249)");
		//grad.addColorStop(1.0,"rgb(255,255,255)");
		grad.addColorStop(1.0,"rgb("+c+","+c+","+c+")");

		//グラデーション
		this.grad = grad;
	}
	this.render = function(){
		ctx.save();
		if(this.grad){
			ctx.fillStyle = this.grad;
		}else{
			ctx.fillStyle = "#000";
		}
		ctx.fillRect(0,0,width,height);

		for(var i = 0,drop;drop = this.drops[i];i++){
			drop.render();
			/*
			ctx.fillStyle = drop.color;
			ctx.beginPath();
			ctx.arc(drop.x,drop.y,drop.radius,0,Math.PI * 2); ctx.fill();
			*/
		}
		ctx.restore();
	}
	this.update = function(){
		for(var i = 0,drop;drop = this.drops[i];i++){
			drop.x += drop.vx;
			drop.y += drop.vy;
			//画面の外
			if(drop.y > height){
				this.drops.splice(i--,1);
				this.addDrop();
			}
			
		}
	}
	this.wind = function(w){
		for(var i = 0,drop;drop = this.drops[i];i++){
			drop.vx = w;
		}
	}

	

}
function init(){
	var canvas = document.getElementById("c");

	//canvas check
	if(!canvas || !canvas.getContext){
		return false;
	}

	var ctx = canvas.getContext("2d");
	//canvas size
	var width = canvas.width = window.innerWidth;
	var height = canvas.height = window.innerHeight;


	var particleSystem = new ParticleSystem(ctx,width,height,INTENSITY);
	var mouseY = 0;

	function draw(){
		requestAnimationFrame(draw);
		particleSystem.update();

		particleSystem.changeIntensity(mouseY);
		particleSystem.render();
	}

	draw();
	//マウス移動
	document.onmousemove = function(e){
		//console.log(e);
		mouseY = e.y;
		particleSystem.getGradient(e.y);

		var windRatio = (e.x - window.innerWidth / 2) / (window.innerWidth / 2) * 5;
		particleSystem.wind(windRatio);
	}
}

function Drop(ctx,width,height){
	this.x = Math.random() * width;
	this.y = -Math.random() * height;
	this.vx = 0;
	this.vy = getRandomNum(5,15);
	this.color = "#fff";
	this.alpha = 1;
	this.render = function(){
		ctx.globalAlpha = this.alpha;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.vy / 8,this.vy);
	};
}

function getRandomNum(min,max){
	return (Math.random() * (max - min) + min);
}
init();
