var Fight = cc.LayerColor.extend({
	_jetSprite: null,
	heroes:[],
	rightHeroes:{},
	leftHeroes:{},
	fightTurns:[],
	powerLayer:null,
	selectedHero:null,
	
    init:function()
    {
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
		this.setTouchEnabled(true);
        //this.setKeyboardEnabled(true);
        this.setPosition(new cc.Point(0, -20));
		var x = [200, 400, 200, 1000, 800, 1000]
		var y = [200, 400, 600, 200, 400, 600]
		for(var i=0; i < 6; i++){
			var powers = {}
			powers.p1 = i*3
			powers.p2 = i*3+1
			powers.p3 = i*3+2
			var hero = new Hero(i+1+'', cc.p(x[i], y[i]), i<3 ? true : false, powers );
			this.addChild( hero );
			this.heroes.push( hero )
			this.fightTurns.push( hero )
			if( i < 3){
				this.rightHeroes[i] = hero
			}else{
				this.leftHeroes[i] = hero
			}
		}
        //this._jetSprite.scheduleUpdate();
        this.schedule(this.update);
		this.powerLayer = new PowerLayer();
		this.addChild(this.powerLayer)
        this.whoseTurnIsIt()
		//this.addChild(layer1);
        return true;
		/*
		var jetSprite = cc.Sprite.create("res/img/1.png");
        jetSprite.setPosition(cc.p(size.width / 2, size.height / 2));
        layer1.addChild(jetSprite);
		//this.sprite.setScale(0.5);
        //this.sprite.setRotation(180);
        
        var helloLabel = cc.LabelTTF.create("Hello world", "Arial", 30);
        helloLabel.setPosition(new cc.Point(s.width/2,s.height/2));
        helloLabel.setColor(new cc.Color3B(255,0,0));
        var rotationAmount = 0;
        var scale = 1;
        helloLabel.schedule(function()
            {
                this.setRotation(rotationAmount++);
                if(rotationAmount > 360)
                    rotationAmount = 0;
                this.setScale(scale);
                scale+= 0.05;
                if(scale > 10)
                    scale =1;
            });

        layer1.addChild(helloLabel);
		*/
    },
	whoseTurnIsIt : function(){
		var hero = this.fightTurns.shift();
		this.startFight( hero );
		this.fightTurns.push( hero );
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
					this.simulateFight(this.powerLayer.powerSelected, this.heroes[i])
				}
			}
		}
		console.log('touch')
    },
	
	simulateFight: function(powerNum, dmgHero){
		var damage = eval('HeroPower.p'+powerNum).attack
		//this.hero.attack();
		this.simulateAttack(powerNum, dmgHero)
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
