function Gift(imageName) {
    Gift.superclass.constructor.call(this);
    this.position = new cc.Point(250, 250);
    this.rotation = -25;
    imageName = imageName || "images/candybon.png";
    this.sprite = new cc.Sprite({
        file: imageName
    })
    this.addChild(this.sprite);
    this.contentSize = new cc.Size(this.sprite.contentSize.width/2,this.sprite.contentSize.height/2);
}

Gift.inherit(PhysicsNode, {
    type: "gift",
    
    setupPhysics: function(world) {
        this.createPhysics(world, {isStatic:true, isSensor: true});
    },
    
    onPickup: function() {
        var fc = new FloatingScore(this.score);
        fc.position = new cc.Point(this.position.x, this.position.y);
        Application.instance.updateObjects.push(fc);
        Application.instance.addChild(fc);
    
        if (this.score < 50) {
            Audiomanager.instance.play("pickup");
        } else {
            Audiomanager.instance.play("pickup2");
        }
    }
});
