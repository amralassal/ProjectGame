<<<<<<< HEAD
var Effect = cc.Sprite.extend({
    tmpWidth:0,
    tmpHeight:0,
	hash: null,
	hero: null,
	dmgHero: null,
    ctor:function (effectName, hero, dmgHero) {
        this._super();
		this.hero = hero
		this.dmgHero = dmgHero
		this.hash = gameEffects[effectName]
		this.setPosition( this.hero.sprite.getPosition() )
        var pFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.hash.spriteName + "_1.png");
        this.initWithSpriteFrame(pFrame);
		this.runAction( cc.FlipX.create(!this.hero.sprFlipX) )
        //this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    },
	
	playEffect: function(){
		switch(this.hash.type){
			case 1: this.playNormalEffect();break;
			case 2: this.playProjectileEffect() ;break;
		}
		this.playSound()
	},
	
	playNormalEffect: function(){
		this.setPosition( this.dmgHero.sprite.getPosition() )
		var animation = cc.AnimationCache.getInstance().getAnimation(this.hash.name);
		this.runAction(cc.Sequence.create(
			cc.Animate.create(animation, false),
			cc.CallFunc.create(this, this.destroy)
        ));
		this.runAction(cc.CallFunc.create(this, function(){
			this.dmgHero.blink();
		}))
	},
	playProjectileEffect: function(){
		var animation = cc.AnimationCache.getInstance().getAnimation(this.hash.name);
		this.runAction(
			cc.RepeatForever.create( cc.Animate.create(animation, false) )
		);
		this.runAction(cc.Sequence.create(
			cc.MoveTo.create(1, this.dmgHero.sprite.getPosition() ),
			cc.CallFunc.create(this, function(){
				var a = new Effect(this.hash.afterEffect, this.hero, this.dmgHero);
				this.getParent().addChild(a);
				a.playEffect()
				this.destroy()
			})
		));
	},
	playSound : function(){
		cc.AudioEngine.getInstance().playEffect(hero_rs[gameSounds[this.hash.sound].path], false);
	},
    destroy:function () {
        this.removeFromParentAndCleanup(true);
    },
});

Effect.sharedEffect = function (effectName) {
	var hash = gameEffects[effectName]
    cc.SpriteFrameCache.getInstance().addSpriteFrames(hero_rs[hash.resource]);
    var animFrames = [];
    var str = "";
	var frames = hash.frames + 1;
    for (var i = 1; i < frames; i++) {
        str = hash.spriteName + "_" + i + ".png";
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
        animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, hash.time);
	animation.setLoops(hash.loops)
    cc.AnimationCache.getInstance().addAnimation(animation, hash.name);
};
=======
var Effect = cc.Sprite.extend({
    tmpWidth:0,
    tmpHeight:0,
	hash: null,
	hero: null,
	dmgHero: null,
    ctor:function (effectName, hero, dmgHero) {
        this._super();
		this.hero = hero
		this.dmgHero = dmgHero
		this.hash = gameEffects[effectName]
		this.setPosition( this.hero.sprite.getPosition() )
        var pFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(this.hash.spriteName + "_1.png");
        this.initWithSpriteFrame(pFrame);
		this.runAction( cc.FlipX.create(!this.hero.sprFlipX) )
        //this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    },
	
	playEffect: function(){
		switch(this.hash.type){
			case 1: this.playNormalEffect();break;
			case 2: this.playProjectileEffect() ;break;
		}
		this.playSound()
	},
	
	playNormalEffect: function(){
		this.setPosition( this.dmgHero.sprite.getPosition() )
		var animation = cc.AnimationCache.getInstance().getAnimation(this.hash.name);
		this.runAction(cc.Sequence.create(
			cc.Animate.create(animation, false),
			cc.CallFunc.create(this, this.destroy)
        ));
		this.runAction(cc.CallFunc.create(this, function(){
			this.dmgHero.blink();
		}))
	},
	playProjectileEffect: function(){
		var animation = cc.AnimationCache.getInstance().getAnimation(this.hash.name);
		this.runAction(
			cc.RepeatForever.create( cc.Animate.create(animation, false) )
		);
		this.runAction(cc.Sequence.create(
			cc.MoveTo.create(1, this.dmgHero.sprite.getPosition() ),
			cc.CallFunc.create(this, function(){
				var a = new Effect(this.hash.afterEffect, this.hero, this.dmgHero);
				this.getParent().addChild(a);
				a.playEffect()
				this.destroy()
			})
		));
	},
	playSound : function(){
		cc.AudioEngine.getInstance().playEffect(hero_rs[gameSounds[this.hash.sound].path], false);
	},
    destroy:function () {
        this.removeFromParentAndCleanup(true);
    },
});

Effect.sharedEffect = function (effectName) {
	var hash = gameEffects[effectName]
    cc.SpriteFrameCache.getInstance().addSpriteFrames(hero_rs[hash.resource]);
    var animFrames = [];
    var str = "";
	var frames = hash.frames + 1;
    for (var i = 1; i < frames; i++) {
        str = hash.spriteName + "_" + i + ".png";
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
        animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, hash.time);
	animation.setLoops(hash.loops)
    cc.AnimationCache.getInstance().addAnimation(animation, hash.name);
};
>>>>>>> Spriter
