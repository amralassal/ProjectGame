var Hero = cc.Layer.extend({
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
	
    ctor:function(imgName, point, flipX, heroPowers){
        this._super();
		var heroTexture = cc.TextureCache.getInstance().addImage(hero_rs['h_m' + imgName]);
        this.sprite = cc.Sprite.createWithTexture(heroTexture);
		this.addChild(this.sprite)
        //this.initWithFile("res/img/" + imgName + ".png")
		
		this._rect = cc.rect(0, 0, heroTexture.width, heroTexture.height);
		this.heroPowers = heroPowers
		this.imgName = imgName
		this.sprite.setPosition( point )
		this.sprFlipX = flipX;
		this.sprite.runAction( cc.FlipX.create(flipX) ) 
		this.init()
		
		this.hpLabel = cc.LabelTTF.create(this.hp + '', "Arial", 28);
		var tintRed = cc.TintBy.create(0, 0, -255, -255);
		this.hpLabel.runAction(tintRed);
        this.hpLabel.setPosition(cc.p(point.x,point.y + 20 +heroTexture.height/2));
		this.loadHpStamina(point, heroTexture)
		//this.addChild(this.hpLabel);
    },
	init: function(){
		this.hp = 600
	},
	loadHpStamina: function(point, heroTexture){
		var texture = cc.TextureCache.getInstance().addImage(hero_rs['hp']);
        this.hpBar = cc.Sprite.createWithTexture(texture);
		//this.hpBar.setTextureRect( cc.rect(0,0, texture.width,texture.height) )
		this.hpBar.setPosition(cc.p(point.x,point.y + 22 +heroTexture.height/2));
		this.addChild(this.hpBar)
        
		texture = cc.TextureCache.getInstance().addImage(hero_rs['stamina']);
        this.stamina = cc.Sprite.createWithTexture(texture);
		this.stamina.setPosition(cc.p(point.x,point.y + 10 +heroTexture.height/2));
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
		//this.blink()
		/*var a = new Explosion();
        a.setPosition(this.sprite.getPosition());
        this.getParent().addChild(a);
		*/
		this._updateHpBar( this.newHp/600 )
		//this.schedule(this._updateHp, 1 / (this.oldHp-this.newHp) )
	},
	_newHp:0,
	_oldHp:0,
	_updateHp:function (dt) {
        //this.time += dt;
		if(this.oldHp > this.newHp){
			this.oldHp--;
			this.hpLabel.setString( this.oldHp );
		}else{
			this.unschedule(this._updateHp)
			if(this.newHp == 0){ 
				this.die() //trigger dying effect
			}
			return;
		}
		/*
        var s1 = this.time.toFixed(2)
        //label1.setString(string1);
		console.log(s1)

        var s2 = parseInt(this.time).toString();
        this.hpLabel.setString(s1);*/
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
	_transitionMove : function(amplitude, period){
		var date = new Date();
		var time = date.getTime();
		var amplitude = amplitude || 40;
		var period = period || 1400; // in ms
		var nextY = amplitude * Math.sin(time * 2 * Math.PI / period);
		return nextY
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
	normal : function(){
		var normal = cc.TintTo.create(0, 255, 255, 255);
		this.sprite.runAction(normal);
	},
	dark : function(){
		//var dark = cc.TintBy.create(1, -155, -155 -155);
		var dark = cc.TintTo.create(1, 73, 73, 73);
		this.sprite.runAction(dark);
	},
    handleKey:function(e)
    {
		test = cc
        if(e === cc.KEY.left)
            this._currentRotation--;
        else if(e === cc.KEY.right)
            this._currentRotation++;

        if(this._currentRotation < 0) this._currentRotation = 360;
        if(this._currentRotation > 360) this._currentRotation = 0;
    },
    handleTouch:function(touchLocation)
    {
        if(touchLocation.x < 300)
            this._currentRotation = 0;
        else
            this._currentRotation = 180;
    },
    handleTouchMove:function(touchLocation){
        // Gross use of hardcoded width,height params.
        var angle = Math.atan2(touchLocation.x-300,touchLocation.y-300);

        angle = angle * (180/Math.PI);
        this._currentRotation = angle;
    }
});