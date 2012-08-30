var PowerLayer = cc.Layer.extend({
	hero:null,
	powerSelected:-1,

    ctor:function () {
		var menu = cc.Menu.create();//dumb menu
		menu.setTag(1)
		//this._centeredMenu = menu.getPosition();
        //this._alignedH = true;
        //this.alignMenuH();
    },
	init:function(hero){
		this.hero = hero
		var p = this.hero.heroPowers
		this.removeChildByTag(1)
		
		var item1 = cc.MenuItemImage.create(eval('hero_rs.h_p'+p.p1), eval('hero_rs.h_p'+p.p1), this, function(){this.power1(1)});
		var item2 = cc.MenuItemImage.create(eval('hero_rs.h_p'+p.p2), eval('hero_rs.h_p'+p.p2), this, this.power2);
		var item3 = cc.MenuItemImage.create(eval('hero_rs.h_p'+p.p3), eval('hero_rs.h_p'+p.p3), this, this.power3);
		var menu = cc.Menu.create(item1, item2, item3);
		menu.setTag(1)
		
		this.addChild(menu);
		menu.alignItemsHorizontally();
		menu.setPosition(cc.p(600,150))
		this.powerSelected = -1
	},
	
    alignMenuH:function () {
        for (var i = 0; i < 2; i++) {
            var menu = this.getChildByTag(100 + i);
            menu.setPosition(this._centeredMenu);
            if (i == 0) {
                menu.alignItemsHorizontally();
                var p = menu.getPosition();
                menu.setPosition(cc.pAdd(p, cc.p(0, 30)));
            }
            else {
                menu.alignItemsHorizontallyWithPadding(40);
                var p = menu.getPosition();
                menu.setPosition(cc.pSub(p, cc.p(0, 30)));
            }
        }
    },
    alignMenusV:function () {
        for (var i = 0; i < 2; i++) {
            var menu = this.getChildByTag(100 + i);
            menu.setPosition(this._centeredMenu);
            if (i == 0) {
                menu.alignItemsVertically();
                var p = menu.getPosition();
                menu.setPosition(cc.pAdd(p, cc.p(100, 0)));
            }
            else {
                menu.alignItemsVerticallyWithPadding(40);
                var p = menu.getPosition();
                menu.setPosition(cc.pSub(p, cc.p(100, 0)));
            }
        }
    },
    power1:function (sender) {
		console.log(sender + 'eshta')
		this.powerSelected = 1
    },
	power2:function (sender) {
		this.powerSelected = 2
	},
	power3:function (sender) {
		this.powerSelected = 3
    },
    menuCallbackOpacity:function (sender) {
        var menu = sender.getParent();
        var opacity = menu.getOpacity();
        if (opacity == 128)
            menu.setOpacity(255);
        else
            menu.setOpacity(128);
    },
    menuCallbackAlign:function (sender) {
        this._alignedH = !this._alignedH;
        if (this._alignedH)
            this.alignMenuH();
        else
            this.alignMenusV();
    }
});