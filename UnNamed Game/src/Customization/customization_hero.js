var CustomizationHero = cc.Layer.extend({
	_rect:null,
	textures:[],
	sprites:[],
	time:null,
	hp:0,
	heroPowers:null,
	
	rect:function () {
        return cc.rect(-this._rect.size.width / 2, -this._rect.size.height / 2, this._rect.size.width, this._rect.size.height);
    },
	
    ctor:function(){
        this._super();
		var x = [205, 229, 296, 181, 158, 95, 0, 77, 84, 146, 58, 18, 0]
		var y = [213, 192, 175, 6, 114, 109, 0, 98, 199, 276, 277, 232,  155]
		this.textures['1'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_arm6' ]);
		this.textures['2'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_arm2' ]);
		this.textures['3'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_arm4' ]);
		this.textures['4'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_leg2' ]);
		this.textures['5'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_leg0' ]);
		this.textures['6'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_leg3' ]);
		this.textures['7'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_leg1' ]);
		this.textures['8'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_leg4' ]);
		this.textures['9'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_torso0' ]);
		this.textures['10'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_head1' ]);
		this.textures['11'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_arm5' ]);
		this.textures['12'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_arm1' ]);
		this.textures['13'] = cc.TextureCache.getInstance().addImage(hero_rs[ 'c_arm3' ]);
		//-----------------------------------------------------------------------
		
		for( var i=1; i < 14; i++){
			var sp = cc.Sprite.createWithTexture( this.textures[ i ] );
			sp.setAnchorPoint( cc.p(0, 0) )
			sp.setPosition( cc.p( x[i-1] +200, y[i-1] +300) )
			this.sprites[i] = sp
			this.addChild(sp)
		}
		
		//this._rect = cc.rect(0, 0, heroTexture.width, heroTexture.height);
		this.scheduleUpdate()
		this.init()
		
    },
	init: function(){
	},
	equip: function(texture, num){
		this.sprites[num].setTexture(texture)
	},
	unequip: function(num){
		this.sprites[num].setTexture(this.textures[num])
	},
    update:function(dt){
		//this.setRotation(this._currentRotation);
		//var bE = this._transitionMove(4, 2500);
		//this.setPosition( cc.p( this.shiftX + bE, this.shiftY-bE ) );
		//this.setContentSize( cc.size( this.width-bE, this.height+bE ) );
		//this._rect.size.width = this.width-bE
		//this._rect.size.height = this.height+bE
		//console.log( this._rect.size.width , this._rect.size.height = this.height+bE)
		//ctx.drawImage(this.image, 0, 0, this.frameWidth, this.frameHeight, this.shiftX+bE, this.shiftY-bE, this.frameWidth-bE, this.frameHeight+bE);
    },
	onEnter:function () {
        //cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);
        this._super();
    },
    onExit:function () {
        //cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
        //this._super();
    },
	containsTouchLocation:function (touch) {
        var getPoint = touch.getLocation();
        var myRect = this.rect();
        myRect.origin.x += this.sprite.getPosition().x;
        myRect.origin.y += this.sprite.getPosition().y;
		
        return cc.Rect.CCRectContainsPoint(myRect, getPoint);//this.convertTouchToNodeSpaceAR(touch));
    },
	onTouchBegan:function (touch, event) {
        //if (this._state != PADDLE_STATE_UNGRABBED) return false;
        //if (this.containsTouchLocation(touch)) console.log(this.imgName);
        //this._state = PADDLE_STATE_GRABBED;
        return true;
    },
	onTouchMoved:function (touch, event) {
        // If it weren't for the TouchDispatcher, you would need to keep a reference
        // to the touch from touchBegan and check that the current touch is the same
        // as that one.
        // Actually, it would be even more complicated since in the Cocos dispatcher
        // you get CCSets instead of 1 UITouch, so you'd need to loop through the set
        // in each touchXXX method.
        /*
		cc.Assert(this._state == PADDLE_STATE_GRABBED, "Paddle - Unexpected state!");

        var touchPoint = touch.getLocation();
        //touchPoint = cc.Director.getInstance().convertToGL( touchPoint );

        this.setPosition(cc.p(touchPoint.x, this.getPosition().y));
		*/
    },
    onTouchEnded:function (touch, event) {
		/*
        cc.Assert(this._state == PADDLE_STATE_GRABBED, "Paddle - Unexpected state!");
        this._state = PADDLE_STATE_UNGRABBED;
		*/
	},
});