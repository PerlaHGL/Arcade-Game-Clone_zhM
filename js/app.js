// 这是我们的玩家要躲避的敌人
  //=============
   //敌人
  //=============
var Enemy = function() {
    this.init();
    this.sprite = 'images/enemy-bug.png';  // 加载敌人的图片
};

//初始化敌人坐标和移动，Math.random() 函数随机获取所需的位置与速度
Enemy.prototype.init = function(){
    this.moving = Math.floor((Math.random()*400)+100);  //随机获取移动速度
    this.x = -100;  //敌人起始横坐标
    this.y = [60, 145, 230][Math.floor(Math.random() * 3)];  //随机获取纵坐标
};

// 更新敌人的位置，参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 判断敌人当前移动位置是否超过画布，超过了，则回到初始位置
    if (this.x >500){
        this.init();
    }
    // 给每一次的移动都乘以 dt 参数
    this.x += this.moving * dt;
};

// 画出敌人
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

  //============
    //石头
  //============
var Rock = function(){
    this.init();
    this.sprite = 'images/Rock.png';
};

//石头坐标随机获取
Rock.prototype.init = function(){
    this.x = Math.floor(Math.random()* 5)* 101;
    this.y = [60, 140, 230][Math.floor(Math.random() * 3)];
};

//绘制石头
Rock.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

  //=============
   //玩家
  //=============

// 实现玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
    this.init();
    this.score = 0;
    this.lives = 3; //玩家生命
    this.level = 1; //玩家等级
    this.sprite = 'images/char-princess-girl.png';
};

//玩家坐标初始化
Player.prototype.init = function(){
    this.x = 100;
    this.y = 400;
};

//如果玩家胜利,关卡升级，再次初始坐标位置
//调用checkCollisions()检测碰撞发生
Player.prototype.update = function() {
    if (this.success()){
        this.levelPass(); //游戏关卡升级
        this.init();
        this.score += 10;
    }
    this.checkCollisions();
};

//绘制出玩家
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.playerBase(); // 画出生命值、分数、等级信息
};

//玩家通关升级并增加难度
Player.prototype.levelPass = function(){
    this.level ++;
    allEnemies.push(new Enemy());  //敌人数量增加
    rock.push(new Rock());   //每升一级，增加一石头
};

//加载玩家的头像
/*Player.prototype.imageSprite = function(){
        var headPortrait = [
        'images/char-boy.png',
        'images/char-pink-girl.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-princess-girl.png'];
        for (var i = 0; i < headPortrait.length; i++) {
            ctx.drawImage(Resources.get(headPortrait[i]), 4*i, 20);
        }
}; */

//1.键盘输入判断，当玩家不超出边界范围，则移动相应格数
//2.检测玩家当前移动位置方向，调用checkRock()函数检测石头存在，有石头则不可在该方向移动
Player.prototype.handleInput = function(keycode) {
    var verl = 100;
    var hori = 83;
        switch(keycode){
            case 'left':
            var x =this.x - verl;
            if (this.x > 50 && !this.checkRock(x, this.y))
                this.x = x;
            break;
            case 'right':
            var x =this.x + verl;
            if (this.x < 400 && !this.checkRock(x, this.y))
                this.x = x;
            break;
            case 'up':
            var y = this.y - hori;
            if (this.y > 50 && !this.checkRock(this.x, y))
                this.y = y;
            break;
            case 'down':
            var y = this.y + hori;
            if (this.y < 400 && !this.checkRock(this.x, y))
                this.y = y;
            break;
            case 'enter':
            if (player.isFail())
                start();
    }
};

//此处玩家移动时遇石头，需绕过石头方可继续，
//使用some()方法检测玩家移动位置与石头对象位置
//.some 参考https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some
Player.prototype.checkRock = function(x, y){
    function isRock(rock){
        if (Math.abs(rock.x - x) < 50 && Math.abs(rock.y - y) < 50) {
        return true;}
    };
    return rock.some(isRock);
};

//绘制生命值、等级、分数
Player.prototype.playerBase = function() {
    ctx.drawImage(Resources.get('images/Heart.png'), 435, 540,30,51);
    ctx.font = "20pt Impact";
    ctx.fillStyle = "#000";
    ctx.fillText(' ' + this.lives, 470,577);  //显示当前生命值
    ctx.fillStyle = "yellow";  //显示当前分数
    ctx.fillText('Score: ' + this.score, 210,577);
    ctx.fillStyle = "red";
    ctx.fillText('Level: ' + this.level, 20,577);  //显示当前等级
}

//判断游戏胜利或失败
Player.prototype.isFail = function(){
    if (this.lives === 0 || (player.score >= 50 && player.level >5))
        return true;
};

//游戏通关判断
Player.prototype.success = function(){
    return this.y < 30;
};

//绘制文本信息
Player.prototype.drawTxt = function(a,b){
        ctx.font = '23pt Impact';
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(80,200,350,200);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'red';
        ctx.fillText(a,135,280);
        ctx.font = "18pt Arial";
        ctx.fillStyle = '#fff';
        ctx.fillText(b,135,330);
};

//1）以玩家判断，以判断碰撞是否发生，当碰撞发生，则玩家需重新开始游戏
//玩家左右上下，在玩家移动时，都有可碰撞可能，根据碰撞盒算法可以得出碰撞
//处理：碰撞后，游戏重新开始、生命值更新
Player.prototype.checkCollisions = function(){
    for (var i = 0; i < allEnemies.length; i++) {
        if (this.collision(this,allEnemies[i])){
            this.init();
            this.lives--;
        }
    }
};

//2）通过移动判断，敌人与玩家发生碰撞，以碰撞盒算法可以得出碰撞
//使用Math.abs计算绝对值（上下左右）
Player.prototype.collision = function(p,a){
    /*if (p.x < (a.x + 50) &&
           (p.x + 50) > a.x &&
            p.y < (a.y + 40) &&
            (p.y + 40) > a.y)  */
    if (Math.abs(p.x - a.x) < 50 && Math.abs(p.y - a.y) < 50){
        return  true;
    }
};

  //=========
  //start   //游戏开始
  //=========
var player; //玩家

var allEnemies; // 敌人

var rock;

var start = function(){

    // 把玩家对象放进一个叫 player 的变量里面
    player = new Player();

    //实例化对象
    //把所有敌人的对象都放进一个叫 allEnemies 的数组里面（for赋给）
    allEnemies = [];
    for (var i = 0; i < 3; i++) {
        var enemies = new Enemy();
        allEnemies.push(enemies);
    }
    rock = [];
};

start();

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'  //以作为游戏结束后，可重新开始
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
