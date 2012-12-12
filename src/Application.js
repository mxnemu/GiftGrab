/////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2012 Nehmulos
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
// claim that you wrote the original software. If you use this software
// in a product, an acknowledgment in the product documentation would be
// appreciated but is not required.
//
// 2. Altered source versions must be plainly marked as such, and must not be
// misrepresented as being the original software.
//
// 3. This notice may not be removed or altered from any source
// distribution.
/////////////////////////////////////////////////////////////////////////////

function Application () {
    Application.superclass.constructor.apply(this, arguments);
    
    this.isKeyboardEnabled = true;
    this.isMouseEnabled = true;

    var s = cc.Director.sharedDirector.winSize
    
    var debugCanvas = document.createElement("canvas");
    $("#cocos2d-demo").append(debugCanvas);
    $(debugCanvas).addClass("debugcanvas")
    
    debugCanvas.width = $(debugCanvas).parent().width();
    debugCanvas.height = $(debugCanvas).parent().height();
    
    this.world = new b2World(new b2Vec2(0, -10), true);
    this.world.SetContactListener(new CollisionHandler());
    
    this.backgroundSprite = new cc.Sprite({
        file: "images/brickwall.png"
    });
    this.backgroundSprite.anchorPoint =new cc.Point(0,0);
    this.addChild(this.backgroundSprite);
    
    
    this.score = 0;
    this.scoreLabel = new cc.Label({string: "Score: 0"});
    this.scoreLabel.position = new cc.Point(s.width - 100,20)
    this.addChild(this.scoreLabel);
    
    this.giftsCollected = 0;
    this.giftsLabel = new cc.Label({string: "Gifts: 0"});
    this.giftsLabel.position = new cc.Point(s.width - 200,20)
    this.addChild(this.giftsLabel);
    
    this.giftBoxesDropped = 0;
    this.droppedLabel = new cc.Label({string: "Dropped: 0"});
    this.droppedLabel.position = new cc.Point(s.width - 320,20)
    this.addChild(this.droppedLabel);    
    
    this.worldborder = new PhysicsNode();
    this.worldborder.type = "worldborder";
    this.worldborder.position = new cc.Point(s.width/2, s.height);
    this.worldborder.createPhysics(this.world, {boundingBox: new cc.Size(s.width+100, s.height*2), isSensor:true, isStatic:true})
    
    //setup debug draw
    if (window.G.debug) {
        var debugDraw = new b2DebugDraw()
            debugDraw.SetSprite(debugCanvas.getContext("2d"))
            debugDraw.SetDrawScale(PhysicsNode.physicsScale)
            debugDraw.SetFillAlpha(0.5)
            debugDraw.SetLineThickness(1.0)
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
        this.world.SetDebugDraw(debugDraw);
    }
}

Application.inherit(cc.Layer, {
    // fixed update Time
    upadtesPerSecond: 60,
    updateTime: 1/60,
    timePassedWithoutUpdate: 0,
    frameSecondTimer: 0,
    frameUpdateCounter: 0,
    onPhysicsUpdatedCallbacks: [],
    spawnPositions: [],
    lastSpawnPositionIndex: -1,
    giftSprites: ["images/kidney.png", "images/money.png"],
    // non physics objects that need an update
    // I'm too tired to fix this mess with a proper game class
    updateObjects:[], 
    
    // store inputs for realtime requests
    keyDown: function(event) {
        Input.instance.keysDown[event.keyCode] = true;
    },
    
    keyUp: function(event) {
        Input.instance.keysDown[event.keyCode] = false;
    },
    
    destroyGiftbox: function(giftbox) {
        giftbox.destroyed = true;
        this.giftBoxesDropped++;
        this.droppedLabel.string = "Dropped: " + this.giftBoxesDropped;
        var _this = this;
        this.onPhysicsUpdatedCallbacks.push(function() {
            _this.giftbox = new GiftBox();
            _this.giftbox.setupPhysics(_this.world);
            _this.addChild(_this.giftbox);
        });
    },

    spawnGift: function() {
        var newPositionIndex = this.lastSpawnPositionIndex +1;
        if (newPositionIndex >= this.spawnPositions.length) {
            newPositionIndex = 0;
        }
        var gift = new Gift(this.spawnPositions[newPositionIndex].image);
        gift.position = this.spawnPositions[newPositionIndex].position;
        gift.score = this.spawnPositions[newPositionIndex].score;
        this.lastSpawnPositionIndex = newPositionIndex;
        //gift.position = new cc.Point(randomInRange(250, 350), randomInRange(250, 400));
        //gift.poisition = new cc.Point(250, 350);
        //randomInRange(0, this.spawnPositions.length);
        //gift.position = this.spawnPositions[randomInRange(0, this.spawnPositions.length)];
        gift.setupPhysics(this.world);
        this.addChild(gift);
        this.gift = gift;
    },
    
    rainGifts: function() {
        var numberOfGifts = randomInRange(10, 30);
        for (var i=0; i < numberOfGifts; ++i) {
            var spriteName = randomElementInArray(this.giftSprites);
            console.log("saw "+ spriteName)
            var gift = new Gift(spriteName);
            gift.position = new cc.Point(400, 450);
            gift.createPhysics(this.world, {boundingBox: new cc.Size(20,20)});
            gift.body.ApplyImpulse(new b2Vec2(randomInRange(-0.2,0.9), 0), gift.body.GetWorldCenter());
            this.addChild(gift);
        }
    },
    
    onGiftPickup: function(gift) {
        var _this = this;
        
        this.giftsCollected++;
        this.giftsLabel.string = "Gifts: " + this.giftsCollected;
        
        this.score += gift.score;
        this.scoreLabel.string = "Score: " + this.score;
        
        if (gift == this.gift) {
            this.onPhysicsUpdatedCallbacks.push(function() {_this.spawnGift()});
        }
        gift.onPickup();
    },

    // Example setup replace it with your own
    createExampleGame: function() {
        this.spawnPositions.push({position:new cc.Point(250, 250), image:"images/candycane.png", score: 10 });
        this.spawnPositions.push({position:new cc.Point(250, 350), image:"images/money.png", score: 10 });
        this.spawnPositions.push({position:new cc.Point(400, 250), image:"images/candycane.png", score: 10 });
        this.spawnPositions.push({position:new cc.Point(400, 350), image:"images/kidney.png", score: 52 });
        this.spawnPositions.push({position:new cc.Point(300, 350), image:"images/candybon.png", score: 100 });
    
        this.leftBumper = new Bumper();
        this.leftBumper.rotation = 45;
        this.leftBumper.position = new cc.Point(50,450);
        this.leftBumper.setupPhysics(this.world);
        this.addChild(this.leftBumper);
        
        this.rightBumper = new Bumper();
        this.rightBumper.rotation = -45;
        this.rightBumper.position = new cc.Point(750,450); 
        this.rightBumper.setupPhysics(this.world);
        this.addChild(this.rightBumper);
   
    
        this.giftbox = new GiftBox();
        this.giftbox.setupPhysics(this.world);
        this.addChild(this.giftbox);
        
        this.seesaw = new Seesaw();
        this.seesaw.setupPhysics(this.world);
        this.addChild(this.seesaw);
        
        this.spawnGift();
        //this.rainGifts();
        
        $(".instructions").append("use left / right arrow keys to rotate the board");
    },
    
    // Here's the application's mainloop    
    update: function(dt) {
        
        if (this.paused) {
            return;
        }
        
        // limit impact on heavy lag and tab change
        // avoid spiral of death,
        // where calculating 1sec updates takes longer than 1sec
        if (dt > 1.0) {
            dt = 1.0;
        }

        this.frameSecondTimer += dt;
        this.timePassedWithoutUpdate  += dt;
        
        while (this.timePassedWithoutUpdate >= this.updateTime) {
            this.fixedUpdate(this.updateTime);
            this.timePassedWithoutUpdate -= this.updateTime;
            this.frameUpdateCounter++;
        }
        
        /*
        if (this.frameSecondTimer >= 1.0) {
            console.log("updates per second: " + this.frameUpdateCounter);
            this.frameUpdateCounter = 0;
            this.frameSecondTimer -= 1.0;
        }
        */
        
        this.world.DrawDebugData();
    },
    
    fixedUpdate: function(dt) {
        this.world.Step(dt,3, 3);
        this.world.ClearForces();
        
        //this.game.update(dt);
        
        var body = this.world.GetBodyList();
        while(body) {
        
            // update userdata
            var userData = body.GetUserData();
            
            if (userData) {
                if (userData.update) {
                    userData.update(dt);
                }
                if (userData.destroyed) {
                    userData.destroy();
                }
            }
            body = body.GetNext();
        }
        
        for (var i=0; i < this.updateObjects.length; ++i) {
            if (!this.updateObjects[i].destroyed) {
                this.updateObjects[i].update();
            } else {
                this.updateObjects[i].destroy();
                this.updateObjects.splice(i,1);
                --i;
            }
        }

        for (var key in this.onPhysicsUpdatedCallbacks) {
            this.onPhysicsUpdatedCallbacks[key]();
            this.onPhysicsUpdatedCallbacks.splice(0, 1);
        }
    }
})

// this function is executed when the body is loaded
$(function() {

    var director = cc.Director.sharedDirector
    director.backgroundColor = "rgb(200,200,200)"
    director.attachInView(document.getElementById('cocos2d-demo'))
    director.displayFPS = true
    
    // Disable rightclick
    $("canvas").bind("contextmenu", function(e) {
        e.preventDefault();
    });
    
    // I modified lib/cocos2d-beta2.js to make this work
    // this function does not work with the official release!
    function registerResource(path, mimetype, alias) {
        alias = alias || path;
        cc.jah.resources[alias] = {data: path, mimetype: mimetype, remote:true};
        director.preloader().addToQueue(path);
    };
    
    // list your images here
    // they will be loaded with the loadingscreen before your game starts
    registerResource("images/ground.png", "image/png");
    registerResource("images/giftbox.png", "image/png");
    registerResource("images/brickwall.png", "image/png");
    registerResource("images/candybon.png", "image/png");
    registerResource("images/candycane.png", "image/png");
    registerResource("images/bumper.png", "image/png");
    registerResource("images/kidney.png", "image/png");
    registerResource("images/money.png", "image/png");

    // preload audio files
    // TODO integrate audio loading into the preloader
    // implying nameing conventions
    function registerAudio(name) {
        Audiomanager.instance.load({ 
            "ogg": "audio/"+name+".ogg",
            "aac": "audio/conversions/"+name+".aac",
            "wav": "audio/conversions/"+name+".wav",
            
        }, name); 
    }
    
    registerAudio("die");
    registerAudio("start");
    registerAudio("pickup");
    registerAudio("pickup2");
    registerAudio("hit");
    registerAudio("wut");
    registerAudio("music");
    
    Audiomanager.instance.playMusic("music");
    
    // Wait for the director to finish preloading our assets
    cc.addListener(director, 'ready', function (director) {
        var scene = new cc.Scene
        var app = new Application();
        
        Application.instance = app;
        
        scene.addChild(app)
        app.createExampleGame();
        app.scheduleUpdate();

        director.replaceScene(scene)
    });
    director.runPreloadScene();
});
