function Magnet(giftbox) {
    Magnet.superclass.constructor.call(this);
    this.giftbox = giftbox;
    this.position = new cc.Point(400, 250);
    this.sprite = new cc.Sprite({
        file: "images/magnet.png"
    });
    this.contentSize = new cc.Size(this.sprite.contentSize.width,this.sprite.contentSize.height);
    this.addChild(this.sprite);
}

Magnet.inherit(PhysicsNode, {
    type:"magnet",
    lifetime: 0,
    maxLifetime: 5,
    
    update: function(dt) {
        Magnet.superclass.update.call(this,dt);
        this.lifetime += dt;
        if (this.lifetime >= this.maxLifetime) {
            this.destroyed = true;
        }
    },
    
    setupPhysics: function(world) {
        this.createPhysics(world, {isStatic:true, isSensor: true});
        
        var md = new b2MouseJointDef();
        md.bodyA = this.body;
        md.bodyB = this.giftbox.body;
        md.target.Set(this.giftbox.body.GetPosition().x, this.giftbox.body.GetPosition().y);
        md.collideConnected = true;
        md.maxForce = 50.0 * this.giftbox.body.GetMass();
        this.mouseJoint = world.CreateJoint(md)
        this.mouseJoint.SetTarget(new b2Vec2(this.body.GetPosition().x, this.body.GetPosition().y));
    }
});
