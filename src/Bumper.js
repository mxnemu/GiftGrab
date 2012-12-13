function Bumper(imageName) {
    Bumper.superclass.constructor.call(this);
    this.sprite = new cc.Sprite({
        file: "images/bumper.png"
    })
    this.addChild(this.sprite);
    this.contentSize = this.sprite.contentSize;
}

Bumper.inherit(PhysicsNode, {
    type: "bumper",
    
    setupPhysics: function(world) {
        this.createPhysics(world, {isStatic:true, restitution: 1.5});
    }
});
