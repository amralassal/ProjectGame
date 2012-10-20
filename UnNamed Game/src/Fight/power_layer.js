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
		this.removeChildByTag(1)
		this.hero = hero
		var powers = this.hero.type.powers
		var item1 = cc.MenuItemImage.create(eval('hero_rs.h_p1'), eval('hero_rs.h_p1'), this, function(){this.power(powers[0])});
		var item2 = cc.MenuItemImage.create(eval('hero_rs.h_p2'), eval('hero_rs.h_p2'), this, function(){this.power(powers[0])});
		var item3 = cc.MenuItemImage.create(eval('hero_rs.h_p3'), eval('hero_rs.h_p3'), this, function(){this.power(powers[0])});
		var menu = cc.Menu.create(item1, item2, item3);
		menu.setTag(1)
		
		this.addChild(menu);
		menu.alignItemsHorizontally();
		menu.setPosition(cc.p(600,150))
		this.powerSelected = -1
		//cc.DOM.convert(item1, item2, item3);
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
	power:function(name){
		this.powerSelected = name;
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