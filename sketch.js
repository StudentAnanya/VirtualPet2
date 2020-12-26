//Create variables here
var dog,dogImg,happyDog;
var database;
var foodS,foodStock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;

function preload()
{
dogImg = loadImage("images/dogImg.png");
happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  database= firebase.database();
  createCanvas(800,600);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(650,320,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  feed = createButton("Feed the Dog");
  feed.position(820,85);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(920,85);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);

  foodObj.display();

  feedTime = database.ref('FeedTime');
  feedTime.on("value",function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(20);
  if(lastFed>=12){
    text("LastFed : "+ lastFed%12 + "PM", 100,50);
  }else if(lastFed===0){
    text("Last Fed : 12 Am",100,50);
  }else{
    text("Last Fed : "+ lastFed + "AM",100,50);
  }

  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}