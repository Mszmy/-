

var main=document.getElementById('main');

//决定是否显示画布小格子，true则显示，false则不显示
var showcanvas = true;

//------------创建地图------------------------
/*
* atom:原子
* xnum:横向原子的数量
* ynum:纵向原子的数量
*/
function Map(atom,xnum,ynum) {
  this.atom=atom;//20x20
  this.xnum=xnum;
  this.ynum=ynum;

  this.canvas=null;

  //  -------------创建画布的方法-------------------
  this.create=function () {
    this.canvas=document.createElement('div');
    this.canvas.style.cssText='position:relative;top:40px;border:1px solid #808080;background:#eee;';

    //画布宽度
    this.canvas.style.width=this.atom * this.xnum +'px';
    //画布高度
    this.canvas.style.height=this.atom * this.ynum +'px';


    //将画布追加到div后
    main.appendChild(this.canvas);

    if(showcanvas){
      //循环显示出所有的画布小格子
      for(var i=0;i<xnum;i++){
        for(var j=0;j<ynum;j++){
          var a=document.createElement('div');
          a.style.cssText='border:1px solid #808080';
          a.style.width=this.atom +'px';
          a.style.height=this.atom +'px';
          a.style.background='#D3D3D3';
          this.canvas.appendChild(a);
          a.style.position='absolute';
          a.style.left=i * this.atom+'px';
          a.style.top=j * this.atom+'px';
        }
      }
    }
  }
}


//------------创建食物------------------------
function Food(map) {
  //食物的宽高都应与地图的原子一样大
  this.width=map.atom;
  this.height=map.atom;

  //随机产生背景颜色
  this.bgcolor='rgb('+Math.floor(Math.random()*200)+','+Math.floor(Math.random()*200)+','+Math.floor(Math.random()*200)+')';

  this.x=Math.floor(Math.random()*map.xnum);
  this.y=Math.floor(Math.random()*map.ynum);

  //食物的标记------设计食物的样式
  this.flag=document.createElement('div');
  this.flag.style.width=this.width+'px';
  this.flag.style.height=this.height+'px';

  this.flag.style.background=this.bgcolor;
  this.flag.style.borderRadius='50%';
  this.flag.style.position='absolute';
  this.flag.style.left=this.x *this.width+'px';
  this.flag.style.top=this.y *this.height+'px';

  map.canvas.appendChild(this.flag);
}


//--------------创建蛇------------------------
function Snake(map) {
//  设置蛇的基本属性
  this.width=map.atom;
  this.height=map.atom;

//  默认行走的方向
  this.direction='right';

  this.body=[
    {x:2,y:0},//蛇头
    {x:1,y:0},//蛇体
    {x:0,y:0}//蛇尾
  ];


//  ---------------显示蛇--------------------
  this.display = function () {
    for(var i=0;i<this.body.length;i++){
      if(this.body[i].x !=null){
        var s =document.createElement('div');

        this.body[i].flag=s;

      //  设置蛇的样式
        s.style.width=this.width+'px';
        s.style.height=this.height+'px';
        s.style.borderRadius='50%';
        //设置随机背景颜色s
        s.style.background='rgb('+Math.floor(Math.random()*200)+','+Math.floor(Math.random()*200)+','+Math.floor(Math.random()*200)+')';

        s.style.position='absolute';
        s.style.left=this.body[i].x * this.width+'px';
        s.style.top=this.body[i].y * this.height+'px';

        map.canvas.appendChild(s);
      }
    }
  }

  //-----------------让蛇移动------------------
  this.run=function () {
    /*
     0{x:2,y:0},//蛇头
     1{x:1,y:0},//蛇体
     2{x:0,y:0},//蛇尾
     */
     //body的长度为3，就是将1的值赋给2.....
     for(var i=this.body.length-1;i>0;i--){
        this.body[i].x = this.body[i-1].x;
        this.body[i].y = this.body[i-1].y;
     }

    /*
  * 第一次循环后
  * 0{x:2,y:0},
   1{x:1,y:0},
   2{x:1,y:0},

  *第二次循环后
  *  0{x:2,y:0},
   1{x:2,y:0},
   2{x:1,y:0},
  */
    //执行到0时，让其加1
    // this.body[0].y +=1;
    /*第二次循环后
    *  0{x:3,y:0},
       1{x:2,y:0},
       2{x:1,y:0},
     */

     //设置移动方向
     switch(this.direction){
       case 'left':this.body[i].x-=1;break;
       case 'right':this.body[i].x+=1;break;
       case 'up':this.body[i].y-=1;break;
       case 'down':this.body[i].y+=1;break;
     }

    //判断是否吃到食物
    if(this.body[0].x==food.x && this.body[0].y ==food.y){
    //  吃到食物后，蛇的长度应变一节
      this.body.push({x:null,y:null,flag:null});

      //吃到食物后，食物消失，并且要随机产生新的食物
      map.canvas.removeChild(food.flag);
      food =new Food(map);

    }

    //判断有没有出界，也就是有没有撞壁
    if(this.body[0].x<0 || this.body[0].x >map.xnum-1||this.body[0].y<0 || this.body[0].y>map.ynum-1){
      clearInterval(timer);
      alert('撞墙了');

    //  重新开始游戏
      restart(map,this);
      return false;

    }

    //判断是否和自己相撞
    for(var i=4;i<this.body.length;i++){
      if(this.body[0].x==this.body[i].x && this.body[0].y==this.body[i].y){
        clearInterval(timer);
        alert('撞到自己了');

        //  重新开始游戏
        restart(map,this);
        return false;
      }
    }


    //删除所有的，重新画
    for(var i=0; i<this.body.length; i++){
      if(this.body[i].flag != null) {
        //当吃到食物， flag是null, 且不能删除
        map.canvas.removeChild(this.body[i].flag);
      }
    }
    this.display();
  }
}

//重新开始游戏
function restart(map,snake) {
  for (var i = 0; i < snake.body.length; i++) {
    map.canvas.removeChild(snake.body[i].flag);
  }

    //  清除掉蛇之后，需要再重新生成一个蛇
    snake.body = [
      {x: 2, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 0}
    ];

    snake.direction = 'right';
    snake.display();

    //  将食物也清除掉,然后再生成一个新食物
    map.canvas.removeChild(food.flag);
    food = new Food(map);
}
  //-----------设置通关级别对象-------------
//每升一级都提升一个速度
  function Level() {
    this.num=1;//第几关
    this.speed=300;//300毫秒，每升一关，原子数量减少20，速度加快
    this.slength=8;//每关的长度判断

    //设置级别
    this.set=function () {
      this.num++;
      if(this.speed <=50){
        //如果当前速度小于50，则最低速度也只能是50毫秒
        this.speed=50;
      }else{
        //速度加快
        this.speed-=50;
      }
      this.slength +=20;

      this.display();

    //  重新开始，加快速度
      start();
    }

    this.display=function () {
      $('#gunm').innerHtml=this.num;
    }
  }

//------------------------------------------------
var level=new Level();
level.display();

//调用Map()设置原子大小20，长方向的原子40格，宽方向原子20格
var map=new Map(20,40,20);

//调用创建画布方法
map.create();

//调用显示食物
var food = new Food(map);

//创建蛇对象,调用display()方法显示蛇
var snake = new Snake(map);
snake.display();

window.onkeydown=function (event) {
  var ev=event ||window.event;
  // console.log(ev.keyCode);

  //键盘控制上下左右移动
  switch(event.keyCode){
    case 38://上
      //避免折返，这样只能拐弯返回
      if(snake.direction!='down'){
        snake.direction='up';
      }
      break;
    case 40://下
      if(snake.direction!='up'){
      snake.direction='down';
      }
      break;
    case 37://左
      if(snake.direction!='right'){
        snake.direction='left';
      }
      break;
    case 39://右
      if(snake.direction!='left'){
        snake.direction='right';
      }
      break;
  }
}

var timer;

function start() {
  //清除定时器，这样可确保正常运行
  clearInterval(timer);
  //定时器
  timer=setInterval(function () {
    //调用蛇运动的方法，让蛇运动起来
    snake.run();
  },level.speed);
}

//----------开始游戏------------------
$('#begin').click(function(){
  start();
});

//  --------------暂停游戏------------------
$('#pause').click(function(){
  //清除定时器，这样可确保正常运行
  clearInterval(timer);
});
