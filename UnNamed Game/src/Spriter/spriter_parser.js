
/**
 * a SAX Parser
 * @class
 * @extends cc.Class
 */
SpriterParser = cc.Class.extend(/** @lends cc.SAXParser# */{
    xmlDoc:null,
    parser:null,
	data:null,
    xmlList:[],
    plist:[],

    /**
     * parse a xml from a string (xmlhttpObj.responseText)
     * @param {String} textxml plist xml contents
     * @return {Array} plist object array
     */
    parse:function (textxml) {
        var textxml = this.getList(textxml);
        // get a reference to the requested corresponding xml file
        if (window.DOMParser) {
            this.parser = new DOMParser();
            this.xmlDoc = this.parser.parseFromString(textxml, "text/xml");
        } else // Internet Explorer (untested!)
        {
            this.xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            this.xmlDoc.async = "false";
            this.xmlDoc.loadXML(textxml);
        }
        if (this.xmlDoc == null) {
            cc.log("xml " + this.xmlDoc + " not found!");
        }
        var spriter = this.xmlDoc.documentElement;
		
		/*Real parsing of the spriter SCML starts here */
		if (spriter.tagName != 'spriter_data') {
           throw "Not a spriter_data file"
        }
        // Get first real node
		var data = {
			folder: [],
			entity: {},
		};
		var folders = spriter.getElementsByTagName('folder')
        for (var i = 0;i < folders.length; i++) {
			var array = [];
			var res = folders[i].getAttribute('res')
			var files = folders[i].getElementsByTagName('file')
			for (var j = 0;j < files.length; j++) {
				var fileData = {};
				//fileData.name = files[j].getAttribute('name')
				fileData.name = 'c_'+res+j;
				fileData.width = parseInt(files[j].getAttribute('width'))
				fileData.height = parseInt(files[j].getAttribute('height'))
				array[j] = fileData
			}
			data.folder[i] = array
		}
		var animations = spriter.getElementsByTagName('entity')[0].getElementsByTagName('animation')
		for (var i = 0;i < animations.length; i++) {
			var animation = animations[i]
			/* parse Mainline tag*/
			var mainline = []
			var mainlineKeys = animation.getElementsByTagName('mainline')[0].getElementsByTagName('key')
			for (var j = 0;j < mainlineKeys.length; j++) {
				var curKey = mainlineKeys[j];
				var objRefs = curKey.getElementsByTagName('object_ref')
				var array =[]
				for (var k = 0;k < objRefs.length; k++){
					var temp = objRefs[k]
					array[k] = {
						timeline: this._getValue(temp, 'timeline','int'),
						key: this._getValue(temp, 'key','int'),
						z_index: this._getValue(temp, 'z_index','int'),
					}
				}
				mainline[j] = {
					time: this._getValue(curKey,'time', 'int'),
					object_ref: array
				}
			}
			/* parse Timeline tag*/
			var timeline = []
			var timelines = animation.getElementsByTagName('timeline')
			for (var j = 0;j < timelines.length; j++) {
				var keys = timelines[j].getElementsByTagName('key')
				var array=[]
				for (var k = 0;k < keys.length; k++){
					var key = keys[k]
					var spin = key.getAttribute('spin')
					var obj = key.getElementsByTagName('object')[0]
					array[k] = {
						time: this._getValue(key, 'time', 'int'),
						spin: (spin === null ? 1 : parseInt(spin) ),
						object: {
							folder:this._getValue(obj,'folder','int'),
							file:this._getValue(obj,'file','int'),
							x:this._getValue(obj,'x','float'),
							y:this._getValue(obj,'y','float'),
							//default coordinates of pivot is (0,1) as the default in spriter is top left corner which is (0,1) in Cocos
							pivot_x:this._getValue(obj,'pivot_x','float'), 
							pivot_y:this._getValue(obj,'pivot_y','pivot_y'),
							angle:this._getValue(obj,'angle','float')
						}
					}
				}
				timeline[j] = array
			}
			data.entity[animation.getAttribute('name')] = {
				length : parseInt(animation.getAttribute('length')),
				looping : ( animation.getAttribute('looping') === 'true' ? true : false ) ,
				mainline : mainline,
				timeline : timeline
			}
		}
		return data;
    },
	_getValue:function(node, attr, type){
		var value = node.getAttribute(attr);
		var val = null;
		switch(type){
			case 'int':val = (value !== null? parseInt(value) : 0); break;
			case 'float':val = (value !== null? parseFloat(value) : 0.0); break;
			case 'string':val = (value !== null? value : ""); break;
			case 'bool':val = (value !== null? ( value === 'true' ? true : false ) : false); break;
			case 'pivot_y':val = (value !== null? parseFloat(value) : 1.0); break; //special case
		}
		return val;
	},
	
	/**
     * Preload plist file
     * @param {String} filePath
     */
    preloadSpriter:function (filePath) {
        if (window.XMLHttpRequest) {
            // for IE7+, Firefox, Chrome, Opera, Safari brower
            var xmlhttp = new XMLHttpRequest();
            // is xml file?
            if (xmlhttp.overrideMimeType)
                xmlhttp.overrideMimeType('text/xml');
        } else {
            // for IE6, IE5 brower
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (xmlhttp != null) {
            // load xml
            xmlhttp.open("GET", filePath, false);
            xmlhttp.send(null);
            this.xmlList[filePath] = xmlhttp.responseText;
            cc.Loader.shareLoader().onResLoaded();
        } else {
            alert("Your browser does not support XMLHTTP.");
        }
    },
    /**
     * get value by key from xmlList
     * @param {String} key
     * @return {String} xml content
     */
    getList:function (key) {
        if (this.xmlList != null) {
            return this.xmlList[key];
        } else {
            return null;
        }
    }
});

/**
 * get a singleton Spriter parser
 * @function
 * @return {cc.SAXParser}
 */
SpriterParser.shareParser = function () {
    if (!cc.spriterParser) {
        cc.spriterParser = new SpriterParser();
    }
    return cc.spriterParser;
};
