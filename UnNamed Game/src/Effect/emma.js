var Emma = cc.Sprite.extend({
    tmpWidth:0,
    tmpHeight:0,
    ctor:function (flipX) {
        this._super();
        this.tmpWidth = this.getContentSize().width;
        this.tmpHeight = this.getContentSize().height;

        var pFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame("01.png");
        this.initWithSpriteFrame(pFrame);

        var animation = cc.AnimationCache.getInstance().getAnimation("emma");
        this.runAction(cc.Sequence.create(
			cc.FlipX.create(flipX),
            cc.Animate.create(animation, false),
            cc.CallFunc.create(this, this.destroy)
        ));
        //this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    },
    destroy:function () {
        this.getParent().removeChild(this,true);
    }
});

Emma.sharedExplosion = function () {
    cc.SpriteFrameCache.getInstance().addSpriteFrames(hero_rs.p_2);
    var animFrames = [];
    var str = "";
    for (var i = 1; i < 7; i++) {
        str = (i < 10 ? ("0" + i) : i) + ".png";
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(str);
        animFrames.push(frame);
    }
    var animation = cc.Animation.create(animFrames, 0.1);
    cc.AnimationCache.getInstance().addAnimation(animation, "emma");
};
