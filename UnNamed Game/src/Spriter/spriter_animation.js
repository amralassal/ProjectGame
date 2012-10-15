var SpriterAnimation = cc.Layer.extend({
	animation : null,
	selectedAnimation: null,
	mainline: null,
	timeline: null,
	folder: null,
	sprites: [],
	textures: [],
	posX: 200,
	posY: 200,
	looping: true,
    ctor:function(animation){
        this._super();
		//this.animation = cc.spriterParser.parse(hero_rs.a_1)
		this.animation = cc.spriterParser.parse(hero_rs.c_dagger_spriter)
		this._loadTextures()
		//this.startAnimation('Idle')
		//this.startAnimation('Posture')
		//this.startAnimation('First Animation')
    },
	setPosition:function(point){
		this.posX = point.x
		this.posY = point.y
	},
	startAnimation:function(name){
		this.selectedAnimation = this.animation.entity[name]
		this.mainline = this.selectedAnimation.mainline
		this.timeline = this.selectedAnimation.timeline
		this.folder = this.animation.folder
		//draw the first key
		var array = this.mainline[0].object_ref
		for(var i=0 ;i<array.length;i++){
			var node = array[i]
			var key = this.timeline[node.timeline][node.key]
			var obj = key.object
			var tex = this.textures[obj.folder][obj.file]
			this.sprites[i] = cc.Sprite.createWithTexture(tex);
			this.addChild(this.sprites[i])
		}
		this._animate(0)
	},
	_animate:function(num){
		if(num === this.mainline.length-1){
			//Draw last key & wait for the length of the animation to finish
			var deltaTime = ( this.selectedAnimation.length - this.mainline[num].time) /1000
			this.runAction(cc.Sequence.create(
				cc.CallFunc.create(this, function(){
					this._drawKey(num)
					//this._moveToNextKey(0, num, deltaTime) //if u want that last key moves to the first key
				}),
				cc.DelayTime.create(deltaTime),
				cc.CallFunc.create(this, function(){
					if(this.looping){
						return this._animate(0)
					}				
				})
			));
		}else{
			var deltaTime = (this.mainline[num+1].time - this.mainline[num].time) /1000
			this.runAction(cc.Sequence.create(
				cc.CallFunc.create(this, function(){
					this._drawKey(num)
					this._moveToNextKey(num+1) 
				}),
				cc.DelayTime.create(deltaTime),
				cc.CallFunc.create(this, function(){
					this._animate(num+1)
				})
			));
		}
	},
	_drawKey:function(k){
		var array = this.mainline[k].object_ref	
		for( var i=0; i < array.length; i++){
			var node = array[i]
			var key = this.timeline[node.timeline][node.key]
			var obj = key.object
			var tex = this.textures[obj.folder][obj.file]
			var sp = this.sprites[i];
			if(sp.getTexture() !== tex){
				sp.initWithTexture(tex)
			}
			sp.setAnchorPoint( cc.p(obj.pivot_x,obj.pivot_y) )
			sp.setPosition( cc.p( this.posX + obj.x,this.posY + obj.y) )
			sp.setRotation( obj.angle * -1)
		}
	},
	_moveToNextKey:function(nKey,lKey,time){
		var array = this.mainline[nKey].object_ref
		var lastKey = ( lKey ? lKey: nKey -1 )
		var deltaTime = 0;
		for( var i=0; i < array.length; i++){
			var node = array[i]
			var prekey = this.timeline[node.timeline][lastKey]
			var key = this.timeline[node.timeline][nKey]
			var obj = key.object
			var preobj = prekey.object
			deltaTime = ( time ? time : ( key.time - prekey.time ) /1000 )//time in milliseconds
			this.sprites[i].runAction(
				cc.MoveTo.create(deltaTime, cc.p(this.posX+obj.x, this.posY+obj.y) )
			)
			var diff = obj.angle - preobj.angle
			if(diff == 0){
			}else{
				var spin = prekey.spin
				if(diff > 0 && spin == -1){
					diff-= 360
				}else if(diff <0 && spin == 1){
					diff+=360
				}
				this.sprites[i].runAction(
				//cc.RotateTo.create(deltaTime, obj.angle * -1 )
					cc.RotateBy.create(deltaTime, diff * -1 )
				)
			}
		}
	},
	_loadTextures:function(){
		var folders = this.animation.folder
		var len = folders.length
		for(var i=0; i<len; i++){
			var array = folders[i]
			var len2 = array.length
			var texArray = []
			for(var j=0; j<len2; j++){
				texArray[j] = cc.TextureCache.getInstance().addImage(hero_rs[ array[j].name ]);
			}
			this.textures[i] = texArray
		}
	},
	init: function(){
	},

    update:function(dt){
    },

});