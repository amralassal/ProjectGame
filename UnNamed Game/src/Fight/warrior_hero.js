var WarriorHero = cc.Layer.extend({
    _currentRotation:0,
	sprFlipX: false,
	sprite:null,
	hpLabel:null,
	_rect:null,
	time:null,
	hp:0,
	hpBar:null,
	heroPowers:null,
	
	rect:function () {
        return cc.rect(-this._rect.size.width / 2, -this._rect.size.height / 2, this._rect.size.width, this._rect.size.height);
    },
	
    ctor:function(point, flipX, heroPowers){
        this._super();
		this.hero = new SpriterAnimation();
		this.addChild(this.hero)
		//this._rect = cc.rect(0, 0, heroTexture.width, heroTexture.height);
		this.heroPowers = heroPowers
		this.hero.setPosition( point )
		//this.sprFlipX = flipX;
		//this.sprite.runAction( cc.FlipX.create(flipX) ) 
		this.loadHpStamina(point)
		this.init()
		//this.addChild(this.hpLabel);
    },
	init: function(){
		this.hp = 600
		this.hero.start()
		//this.hero.startAnimation("Stance")
		//this.hero.startAnimation("Dash")
		//this.hero.startAnimation("Attack")
		//this.hero.startAnimation("Back")
	},
	loadHpStamina: function(point, heroTexture){
		var texture = cc.TextureCache.getInstance().addImage(hero_rs['hp']);
        this.hpBar = cc.Sprite.createWithTexture(texture);
		//this.hpBar.setTextureRect( cc.rect(0,0, texture.width,texture.height) )
		this.hpBar.setPosition(cc.p(point.x,point.y + 22 + 400));
		this.addChild(this.hpBar)
        
		texture = cc.TextureCache.getInstance().addImage(hero_rs['stamina']);
        this.stamina = cc.Sprite.createWithTexture(texture);
		this.stamina.setPosition(cc.p(point.x,point.y + 10 + 400));
		this.addChild(this.stamina)
	},
	_updateHpBar: function(ratio){
		this.hpBar.setTextureRect( cc.rect(0,0, ratio * 200, 10) )
		/*texture.width*/ /*texture.height*/
	},
	_updateStaminaBar: function(ratio){
		this.stamina.setTextureRect( cc.rect(0,0, ratio * 200, 10) )
	},
	attackedBy: function(dmg){
		this.oldHp = this.hp
		this.hp-= dmg;
		this.newHp = this.hp
		if(this.newHp < 1){
			this.newHp = 0; // so that hp doesn't count negatively
			this.die()
		}
		this._updateHpBar( this.newHp/600 )
	},
	
    update:function(dt){
    },
	onEnter:function () {
        //cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);
        this._super();
    },
    onExit:function () {
        //cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
        //this._super();
    },
	destroy:function () {
        this.removeFromParentAndCleanup(true);
    },
	containsTouchLocation:function (touch) {
        var getPoint = touch.getLocation();
        var myRect = this.rect();
        myRect.origin.x += this.sprite.getPosition().x;
        myRect.origin.y += this.sprite.getPosition().y;
		
        return cc.Rect.CCRectContainsPoint(myRect, getPoint);//this.convertTouchToNodeSpaceAR(touch));
    },
	die : function(){
		this.sprite.runAction( cc.TintBy.create(1, 0, -255, -255) );
		this.sprite.runAction(cc.Sequence.create(
			cc.FadeOut.create(1.0),
			cc.CallFunc.create(this, this.destroy)
        ));
		cc.AudioEngine.getInstance().playEffect(hero_rs.s_6, false);
	},
	blink : function(){
		this.sprite.runAction( cc.Blink.create(1, 5) )
	},
});