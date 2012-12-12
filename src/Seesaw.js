function Seesaw() {
    Seesaw.superclass.constructor.call(this);
    this.position = new cc.Point(400, 200);
    
    // set image. It must be listed in the preloader before.
    this.addChild(new cc.Sprite({
        file: "images/ground.png"
    }));
}

Seesaw.inherit(PhysicsNode, {
    type: "seesaw",
    
    setupPhysics: function(world) {
        this.createPhysics(world, {boundingBox: new cc.Size(400, 10)});
        
        var jointDef = new b2RevoluteJointDef();
        jointDef.Initialize(this.body, world.GetGroundBody(), this.body.GetPosition());
        jointDef.MaximalForce = 4000;
        
        this.joint = world.CreateJoint(jointDef);
    },
    
    update: function(dt) {
        Seesaw.superclass.update.call(this);
        
        if (Input.instance.keysDown[37]) { // left arrow   
            this.body.ApplyTorque(250);
        }
        if (Input.instance.keysDown[39]) { // right arrow
            this.body.ApplyTorque(-250);
        }        
    }
});
