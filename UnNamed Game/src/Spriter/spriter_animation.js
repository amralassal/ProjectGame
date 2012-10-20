var SpriterAnimation = cc.Layer.extend({
	animation : null,
	selectedAnimation: null,
	mainline: null,
	timeline: null,
	folder: null,
	sprites: [],
	textures: [],
	animations:[],
	animationState:[], // 0 heroPlace, 1 heroPlace to enemyPlace, 2 enemyPlace, 3 enemyPlace to heroPlace
	standardAnimation:[],
	newAnimation: false, // to stop the already working animation and to start a new one
	numAnim: 0,
	_pos:null, // calcuate the position for every animation frame
	posX: 0,
	posY: 0,
	endPosX:0,
	endPosY:0,
	looping: true,
    ctor:function(res){
        this._super();
		//this.animation = cc.spriterParser.parse(hero_rs.a_1)
		this.animation = cc.spriterParser.parse(hero_rs[res])
		this._loadTextures()
		//this.startAnimation('Idle')
		//this.startAnimation('Posture')
		//this.startAnimation('First Animation')
    },
	setInitPosition:function(p){
		this.setStartPosition(p)
		this.setEndPosition(p)
	},
	setStartPosition:function(point){
		this.posX = point.x
		this.posY = point.y
	},
	setEndPosition:function(point){
		this.endPosX = point.x
		this.endPosY = point.y
	},
	setStandardAnimation:function(animationArray){
		for(var i=0; i<animationArray.length; i++){this.standardAnimation[i] = animationArray[i]}
	},
	start: function(animationArray, looping){
		this._initAnimation(animationArray, looping)
		this.startAnimation(this.animations[0])
	},
	startAllOver: function(animationArray, looping){
		this._initAnimation(animationArray, looping)
		this.newAnimation = true
	},
	_initAnimation:function(animationArray, looping){
		this.looping = looping
		this.animations = []
		this.numAnim = 0;
		for(var i=0; i<animationArray[0].length; i++){
			this.animations[i] = animationArray[0][i]
			this.animationState[i] = animationArray[1][i]
		}
	},
	startAnimation:function(name){
		this.selectedAnimation = this.animation.entity[name]
		this.mainline = this.selectedAnimation.mainline
		this.timeline = this.selectedAnimation.timeline
		this.folder = this.animation.folder
		this._setPos()
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
		this._drawKey(0)
		this._animate(0)
	},
	destroyAnimation:function(){
		this.removeAllChildrenWithCleanup(true)
	},
	_animate:function(num){
		if(this.newAnimation){
			this.newAnimation = false
			this.destroyAnimation()
			this.numAnim = 0
			this.startAnimation(this.animations[0])
			return;
		}
		if(num === this.mainline.length-1){
			//Draw last key & wait for the length of the animation to finish
			var deltaTime = ( this.selectedAnimation.length - this.mainline[num].time) /1000
			this.runAction(cc.Sequence.create(
				cc.CallFunc.create(this, function(){
					this._drawKey(num)
				}),
				cc.DelayTime.create(deltaTime),
				cc.CallFunc.create(this, function(){
					this.numAnim++
					this.destroyAnimation()
					if(this.numAnim < this.animations.length){
						this.startAnimation( this.animations[this.numAnim] )
					}else if(this.looping){
						this.numAnim = 0;
						this.startAnimation( this.animations[0] )
					}else{
						this.start( this.standardAnimation, true)
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
		var p = this._pos(this.mainline[k].time)
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
			sp.setPosition( cc.p( p.x + obj.x,p.y + obj.y) )
			sp.setRotation( obj.angle * -1)
		}
	},
	_moveToNextKey:function(nKey){
		var array = this.mainline[nKey].object_ref
		var p = this._pos(this.mainline[nKey].time)
		var deltaTime = 0
		for( var i=0; i < array.length; i++){
			var node = array[i]
			var prekey = this.timeline[node.timeline][nKey -1]
			var key = this.timeline[node.timeline][nKey]
			var obj = key.object
			var preobj = prekey.object
			deltaTime = ( key.time - prekey.time ) /1000 //time in milliseconds
			this.sprites[i].runAction(
				cc.MoveTo.create(deltaTime, cc.p(p.x + obj.x,p.y + obj.y) )
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
	_setPos:function(){
		var func;
		var tt = this.mainline[ this.mainline.length-1 ].time;// total time of the last key
		switch(this.animationState[this.numAnim]){
			case 0: func = function(){return {x:this.posX, y:this.posY}};break;
			case 1: func = function(t){return{x:this.posX+(this.endPosX-this.posX)*t/tt, y:this.posY+(this.endPosY-this.posY)*t/tt}};break;
			case 2: func = function(){return {x:this.endPosX, y:this.endPosY}};break;
			case 3: func = function(t){return {x:this.endPosX+(this.posX-this.endPosX)*t/tt, y:this.endPosY+(this.posY-this.endPosY)*t/tt}};break;
		}
		this._pos = func
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