var Background = cc.Layer.extend({
	bg:null,
	movingBg:[],
	size:null,
	position:null,

    ctor:function(bg, movingBg){
        this._super();
		var tex = cc.TextureCache.getInstance().addImage(hero_rs['bg_' + bg]);
		this.bg = cc.Sprite.createWithTexture(tex);
		this.bg.setAnchorPoint(cc.p(0,0))
		this.position = cc.p(200,100)
		this.bg.setPosition(this.position)
		this.size = this.bg.getContentSize()
		this.addChild(this.bg)
		if(movingBg){
			this.initMovingBg(movingBg)
		}
    },
	initMovingBg:function(movingBg){
		for(var i=0; i < movingBg.length; i++){
			this.movingBg[i] = cc.Sprite.createWithTexture( cc.TextureCache.getInstance().addImage(hero_rs['bg_'+movingBg[i]]) );
			this.movingBg[i].setScale(1.5,1.5)
		}
		this.moveBg()
	},
	moveBg:function(){
		var bg = this.movingBg[0];
		bg.setAnchorPoint(cc.p(0,1))
		bg.setPosition(cc.p(this.position.x + this.size.width, this.position.y + this.size.height))
		this.addChild(bg)
		bg.runAction(cc.Sequence.create(
			cc.MoveTo.create(60, cc.p(this.position.x - bg.getContentSize().width, this.position.y + this.size.height) ),
			cc.CallFunc.create(this, function(){
				this.removeChild(bg)
			})
		));
		
	},
	
	init: function(){
	},
	destroy:function () {
        this.removeFromParentAndCleanup(true);
    },
});