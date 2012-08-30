var Customization = cc.LayerColor.extend({
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
		var csHero = new CustomizationHero();
		this.addChild(csHero)
		
		var csMenu = new CustomizationMenu(csHero);
		this.addChild(csMenu)
		
		this.setTouchEnabled(true);
        this.setPosition(new cc.Point(0,0));
        this.schedule(this.update);
        return true;
    },
	onEnter:function () {
        this._super();
    },
    update:function(dt){
    },
    onTouchesEnded:function (pTouch,pEvent){
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

var CustmizationToolScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new Customization();
        layer.init();
        this.addChild(layer);
    }
})