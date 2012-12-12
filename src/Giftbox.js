function GiftBox() {
    GiftBox.superclass.constructor.call(this);
    this.position = new cc.Point(400, 400);
    this.rotation = 25;
    this.addChild(new cc.Sprite({
        file: "images/giftbox.png"
    }));
}

GiftBox.inherit(PhysicsNode, {
    type: "giftbox",
    
    setupPhysics: function(world) {
        this.createPhysics(world, {boundingBoxOffsetY:100, boundingBox: new cc.Size(50, 50)});
    },
    
    onFreeze: function() {
        Application.instance.destroyGiftbox(this);
        Audiomanager.instance.play("die");
    }
});
