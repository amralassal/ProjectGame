var Fight = cc.LayerColor.extend({
	_jetSprite: null,
	heroes:[],
	rightHeroes:{},
	leftHeroes:{},
	fightTurns:[],
	bg:null,
	powerLayer:null,
	selectedHero:null,
	
    init:function()
    {
		Basbosa('SocketClient').socket.connect();
        var size = cc.Director.getInstance().getWinSize();
		var w = size.width;
		var h = size.height;
        this.initWithColor(new cc.Color4B(242, 246, 248, 255), 1400, 800);
        //layer1.setPosition(new cc.Point(s.width/2,s.height/2));
        //layer1.setIsRelativeAnchorPoint(true);
		//Shared functions
		Explosion.sharedExplosion();
		Emma.sharedExplosion();
		for( var i in gameEffects){
			Effect.sharedEffect( i )
		}
		//---------------------------
		//Initialize BackGround
		
		this.bg = new Background('desert_night',['night_cloud']);
		//this.bg = new Background('desert_day');
		this.addChild(this.bg)
		//---------------------------
		this.setTouchEnabled(true);
        //this.setKeyboardEnabled(true);
        this.setPosition(new cc.Point(0, -20));
		var x = [200, 1000, 800, 400]
		var y = [200, 200, 400, 350]
		for(var i=0; i <4 ; i++){
			var powers = {}
			powers.p1 = i*3
			powers.p2 = i*3+1
			powers.p3 = i*3+2
			if(i < 1){
				var hero = new WarriorHero(cc.p(x[i], y[i]), i<2 ? false : true , "dagger");
				this.leftHeroes[i] = hero
			}else{
				var hero = new Hero(4, cc.p(x[i], y[i]),i<3 ? true : false, powers);
				this.rightHeroes[i] = hero
			}
			this.addChild( hero );
			this.heroes.push( hero )
			this.fightTurns.push( hero )
		}
        this.powerLayer = new PowerLayer();
		this.addChild(this.powerLayer)
		this.initBasbosa()
        this.whoseTurnIsIt()
        return true;
    },
	initBasbosa : function(){
		var self = this
		Basbosa('SocketClient').lon('public.fight_result', function(e, msg, next){
			self.simulateFight(msg.hero, msg.powerName, msg.dmgHero)
		});
	},
	whoseTurnIsIt : function(){
		var hero = this.fightTurns.shift();
		this.startFight( hero );
		//this.fightTurns.push( hero );
		this.fightTurns.unshift( hero );
	},
	startFight : function(hero){
		this.hero = hero;
		//this.hero.select();//This hero is now selected
		this.powerLayer.init(hero)
		console.log('Now it is ' + this.hero.imgName + ' turn.')
    },
	onEnter:function () {
        this._super();
    },
    update:function(dt){
    },
    onTouchesEnded:function (pTouch,pEvent){
		if(this.powerLayer.powerSelected != -1){
			for(var i=0; i < this.heroes.length; i++){
				if(pTouch[0] && this.heroes[i].containsTouchLocation(pTouch[0])){
					console.log(this.heroes[i].imgName)
					Basbosa('j').ltrigger('ui.public.fight', {
						hero : 0,
						dmgHero : 1,
						powerName : this.powerLayer.powerSelected
					});
					this.simulateFight(0, this.powerLayer.powerSelected, 1)
				}
			}
		}
		console.log('touch')
    },
	
	simulateFight: function(heroNum, powerName, dmgHeroNum){
		var damage = 100 //eval('HeroPower.p1').attack
		//this.hero.attack();
		//this.simulateAttack(powerNum, dmgHero)
		var hero = this.heroes[heroNum]
		var dmgHero = this.heroes[dmgHeroNum]
		hero.activatePower(powerName, dmgHero.sprite.getPosition())
		dmgHero.attackedBy(damage)
		this.whoseTurnIsIt()
	},
	
	simulateAttack: function(powerNum, dmgHero){
		var effectName = "";
		if(powerNum % 3 == 1){
			effectName = 'fire'
		}else if(powerNum % 3 == 2){
			effectName = 'ice'
		}else{
			effectName = 'shock'
		}
		var a = new Effect(effectName, this.hero, dmgHero);
        this.addChild(a);
		a.playEffect()
	},
	
    onTouchesMoved:function(pTouch,pEvent){
        //this._jetSprite.handleTouchMove( pTouch[0].getLocation() );
    },
    onKeyUp:function(e){

    },
    onKeyDown :function(e){
        this._jetSprite.handleKey(e);
    }

});

var MainAppScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new Fight();
        layer.init();
        this.addChild(layer);
		this.addChild(new GameMenu())
    }
})