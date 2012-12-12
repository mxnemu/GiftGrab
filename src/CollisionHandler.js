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

function CollisionHandler() {
}

CollisionHandler.inherit(b2ContactListener, {
    BeginContact: function(contact, manifold) {
        var objectA = contact.GetFixtureA().GetBody().GetUserData();
        var objectB = contact.GetFixtureB().GetBody().GetUserData();
        
        // example collision, check for other collisions by coping this if block
        if (objectA && objectB) {
            if (objectA.type == "giftbox" && objectB.type == "seesaw") {
                this.boxGroundCollision(objectA, objectB);
            } else if(objectB.type == "giftbox" && objectA.type == "seesaw") {
                this.boxGroundCollision(objectB, objectA);
            }
            
            else if (objectA.type == "giftbox" && objectB.type == "gift") {
                this.boxGiftCollision(objectA, objectB);
            } else if(objectB.type == "giftbox" && objectA.type == "gift") {
                this.boxGiftCollision(objectB, objectA);
            }
        }
        
    },
    
    EndContact: function(contact, manifold) {
        var objectA = contact.GetFixtureA().GetBody().GetUserData();
        var objectB = contact.GetFixtureB().GetBody().GetUserData();
        
        // example collision, check for other collisions by coping this if block
        if (objectA && objectB) {
            // freeze
            if (objectA.type == "worldborder") {
                this.freeze(objectB);
            } 
            else if (objectB.type == "worldborder") {
                this.freeze(objectA);
            }
        } 
    },
    
    // custom functions to handle the collision of 2 objects
    boxGroundCollision: function(box, ground) {
        Audiomanager.instance.play("hit");
    },
    
    boxGiftCollision: function(box, gift) {
        gift.destroyed = true;
        Application.instance.onGiftPickup(gift)
    },
    
    freeze: function(object) {
        if (object.onFreeze) {
            object.onFreeze();
        }
        if (object.destroyOnFreeze) {
            object.destroyed = true;
        }
    },
    
    boxBumperCollision: function(giftbox, bumper) {
        Application.instance.onPhysicsUpdatedCallbacks.push(function() {
            Application.instance.rainGifts();
        });
    }
});
