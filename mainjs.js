$(document).ready(function(){
	shipCount = 0;
	fallingSpeed = 5
	shipAppearFrame = 200
	bulletSpeed = 100
	score = 0
	m_val="";
	shootDelay = 800;
	canShoot = true;
	limitshipfallheight = (85/100)*$(document).height();
	
	startGame();
	
	
	
});

function startGame(){
	$(window).mousemove(function(event){
		enableshooterturn(event);
	});
	enableshooting();
	ships();
}
function endGame(){
	
}
function ships(){
	var randTime = Math.floor((Math.random()*10)+1)*shipAppearFrame;
	var to = setTimeout(createShip,randTime);
}

function createShip(){
	var ship_x_pos = Math.floor((Math.random()*10)+1)*100;
	
	shipCount+=1;
	var shipid = shipCount+'_ship';
	$('body').append('<div id="'+shipid+'" class="ships"><img src="imgs/1.jpg" height="50" width="50"></div>');
	var $ship = $('#'+shipid);
	$ship.css('left',ship_x_pos);
	
	fallships($ship);	
	ships();
	
}

function fallships($ship){

	var r = setInterval(function(){
		var top = parseInt($ship.css('top'))+fallingSpeed;
		//$('#info').html("x:"+top);
		
		console.log("limitheight: "+limitshipfallheight);
		$ship.css('top',top);
		if($ship.offset().top > limitshipfallheight){
			clearInterval(this);
			$ship.remove();
		}
	},100);
	
}

function enableshooterturn(event){
	var $shooter = $('#shooter');
	var $shooter_cont = $('#shooter_cont');
	 x_pos = event.pageX;
	 y_pos = event.pageY;	
	shooter_angle = get_shooter_angle(x_pos,y_pos,$shooter);
	$shooter_cont.css({"transform":"rotate("+shooter_angle+"deg)"});
	
	//$shooter.html(shooter_angle);
}


function enableshooting(){
	$(document).click(function(){
		if(canShoot){
		var bullet = addBullet();
		shoot(bullet);
		addBullet();
		canShoot = false;
		setTimeout(function(){
			canShoot = true;
		},shootDelay);
		}
	});
}

function shoot(bullet){
	bullet.prop('id','');
	bullet_moving(bullet);
}

function addBullet(){
	if($('#dorm.bullets').length<1){
		$('body').append('<div id="dorm" class="bullets"></div>');
	}
	return $('#dorm.bullets');
}

function bullet_moving($m_bullet){
	var bulletPosition = $m_bullet.offset();
	
	var bullet_dest_x = x_pos - bulletPosition.left;
	var bullet_dest_y = y_pos - bulletPosition.top;
	
	var intvl = setInterval(function(){
		var bo = $m_bullet.offset();
		var lt = bo.left+(bullet_dest_x/bulletSpeed);
		var tp = bo.top+(bullet_dest_y/bulletSpeed);
		
		$m_bullet.css('margin','0px');		
		$m_bullet.css('top',tp);
		$m_bullet.css('left',lt);
		if(bo.top<0 || bo.top>1000 || bo.left< 0 || bo.left>1500){
			$m_bullet.remove();
			clearInterval(intvl);
			addBullet();
			return;
		}
		
		if(bulletHit($m_bullet)){
			clearInterval(intvl);			
			return;
		}
		
	},2);
}


function bulletHit($bullet){
	$('.ships').each(function(){
	var $t = $(this);
		if(Math.abs($t.offset().top - $bullet.offset().top)<50 && Math.abs($t.offset().left - $bullet.offset().left)<50){
			$t.remove();
			$bullet.remove();
			addBullet();
			
			score +=1;
			$('#info').html("Score : "+score);
			return true;
		}		
	});
	return false;
}

function get_shooter_angle(xpos, ypos, $shooter){
	var docHeight = $(document).height();
	var shooterHeight = $shooter.height();
	var shooterPosition = $shooter.offset();
	
	 main_xpos = xpos - shooterPosition.left;
	 main_ypos = shooterPosition.top - ypos;
	var q_xy = main_xpos/main_ypos;
	var angle_in_rad = Math.atan(q_xy);
	var angle_in_deg = angle_in_rad * (180/Math.PI);
	
	if(main_ypos<0){
		angle_in_deg = angle_in_deg + 180;
	}
	return angle_in_deg;
}