
var CustomizationMenuIndicator = cc.Layer.extend({
	_state:null,
    _rect:null,
	ITEM_GRABBED:0,
	ITEM_UNGRABBED:1,
	indicators:{},
	fixedIndicators:[],
	textures:[],
	_grabbedItem: null,
	_grabbedItemPos:null,
	
	rect:function () {
        return cc.rect(-this._rect.size.width / 2, -this._rect.size.height / 2, this._rect.size.width, this._rect.size.height);
    },
	
    ctor:function (){
		var x = 650; var y = 650;
		this._state = this.ITEM_UNGRABBED;
		var textures = [hero_rs.c_item4, hero_rs.c_item5]// unselected, selected
		for(var i=0; i < textures.length; i++){	
			this.textures[i] = cc.TextureCache.getInstance().addImage(textures[i]); 
		}
		for(var i=0; i < 3; i++){
			this.fixedIndicators[i] = cc.Sprite.createWithTexture(this.textures[0])
			this.fixedIndicators[i].setPosition(cc.p(x, y - i*80))
			this.addChild(this.fixedIndicators[i])
		}
        this._rect = cc.rect(0, 0, this.textures[0].width, this.textures[0].height);
    },
	init:function(){

	},
	
	onTouchBegan:function (touch, event) {
        if (this._state != this.ITEM_UNGRABBED) return false;
        if (!this.containsTouchLocation(touch)) return false;
        this._state = this.ITEM_GRABBED;
		this._grabbedItem.setZOrder(5);
		this._grabbedItemPos = this._grabbedItem.getPosition();
        return true;
    },
    onTouchMoved:function (touch, event) {
        var touchPoint = touch.getLocation();
        this._grabbedItem.setPosition(cc.p(touchPoint.x, touchPoint.y));
    },
    onTouchEnded:function (touch, event) {
        this._state = this.ITEM_UNGRABBED;
		this._grabbedItem.setPosition(this._grabbedItemPos)
		this._grabbedItem.setZOrder(0);
		this._grabbedItem = null;
		this._grabbedItemPos = null;
    },
	
	onEnter:function () {
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);
        this._super();
    },
    onExit:function () {
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
        this._super();
    },
	containsTouchLocation:function (touch) {
        var getPoint = touch.getLocation();
		for(var i in this.indicators){
			var myRect = this.rect();
			myRect.origin.x += this.indicators[i].getPosition().x;
			myRect.origin.y += this.indicators[i].getPosition().y;
			if(cc.Rect.CCRectContainsPoint(myRect, getPoint)){
				this._grabbedItem = this.indicators[i];
				return this._grabbedItem;
			}
		}
		return null
	},
	selectItem:function(num){
		var pos = this.fixedIndicators[num].getPosition();
		var sprite = cc.Sprite.createWithTexture(this.textures[1]);
		sprite.setPosition(pos)
		sprite.setTag(num)
		this.addChild(sprite)
		this.indicators[num] = sprite
		test = this.indicators
	},
	deSelectItem:function(num){
		this.removeChildByTag(num)
		delete this.indicators[num]
	}
});