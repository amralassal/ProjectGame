//cc.dumpConfig();

var GameMenu = cc.Layer.extend({
    gameMenu:[],
	ctor:function(){
        this._super()
		var s = cc.Director.getInstance().getWinSize();
		var self = this;
		for(var i=1; i < 6; i++){
			this.gameMenu[i] = cc.MenuItemImage.create( hero_rs['m_'+i], hero_rs['m_'+i], this, this._applyB(i) );
		}
		
		this.menu = cc.Menu.create(this.gameMenu[1], this.gameMenu[2], this.gameMenu[3], this.gameMenu[4], this.gameMenu[5]);
		this.menu.alignItemsHorizontally();
		this.menu.setPosition(cc.p(s.width / 2, s.height - 20))
		this.addChild(this.menu);
	},
    init:function () {
    },
	_applyB : function(num){
		return this['b'+num];
	}, 
    b1:function (pSender) {
		if(cc.Director.getInstance().getRunningScene() instanceof MainAppScene){
		}else{
			var scene = new MainAppScene()
			cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
		}
	},
    b2:function (pSender) {
		if(cc.Director.getInstance().getRunningScene() instanceof CustmizationToolScene){
		}else{
			var scene = new CustmizationToolScene()
			cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
		}
    },
});

