function GiftBox() {
    GiftBox.superclass.constructor.call(this);
    this.position = new cc.Point(400, 400);
    this.rotation = 25;
    this.addChild(new cc.Sprite({
        file: "images/giftbox.png"
    }));
    
    this.iceSprite = new cc.Sprite({
        file: "images/ice.png"
    });
}

GiftBox.inherit(PhysicsNode, {
    type: "giftbox",
    slowMotion: false,
    slowMotionTime: 0,
    maxSlowMotionTime: 3,
    
    startSlowMotion: function() {
        this.addChild(this.iceSprite);
        this.slowMotion = true;
    },
    
    update: function(dt) {
        GiftBox.superclass.update.call(this, dt);
        if (this.slowMotion) {
            this.slowMotionTime += dt;
            this.body.SetLinearVelocity(new b2Vec2(0,0));
            this.body.SetAngularVelocity(0);
            if (this.slowMotionTime >= this.maxSlowMotionTime) {
                this.slowMotionTime = 0;
                this.slowMotion = false;
                this.removeChild(this.iceSprite);
            }
        }
    },
    
    setupPhysics: function(world) {
        this.createPhysics(world, {boundingBoxOffsetY:100, boundingBox: new cc.Size(50, 50), density: 0.5});
    },
    
    onFreeze: function() {
        Application.instance.destroyGiftbox(this);
        Audiomanager.instance.play("die");
    }
});
