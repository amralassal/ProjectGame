
/**
 * a SAX Parser
 * @class
 * @extends cc.Class
 */
SpriterParser = cc.Class.extend(/** @lends cc.SAXParser# */{
    xmlDoc:null,
    parser:null,
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
        var plist = this.xmlDoc.documentElement;
        if (plist.tagName != 'plist') {
           throw "Not a plist file"
        }
        // Get first real node
        var node = null;
        for (var i = 0, len = plist.childNodes.length; i < len; i++) {
            node = plist.childNodes[i];
            if (node.nodeType == 1) {
                break
            }
        }
        this.plist = this._parseNode(node);
        return this.plist;
    },

    _parseNode:function (node) {
        var data = null;
        switch (node.tagName) {
            case 'dict':
                data = this._parseDict(node);
                break;
            case 'array':
                data = this._parseArray(node);
                break;
            case 'string':
                // FIXME - This needs to handle Firefox's 4KB nodeValue limit
                data = node.firstChild.nodeValue;
                break;
            case 'false':
                data = false;
                break;
            case 'true':
                data = true;
                break;
            case 'real':
                data = parseFloat(node.firstChild.nodeValue);
                break;
            case 'integer':
                data = parseInt(node.firstChild.nodeValue, 10);
                break;
        }

        return data;
    },

    _parseArray:function (node) {
        var data = [];
        for (var i = 0, len = node.childNodes.length; i < len; i++) {
            var child = node.childNodes[i];
            if (child.nodeType != 1) {
                continue;
            }
            data.push(this._parseNode(child));
        }
        return data;
    },

    _parseDict:function (node) {
        var data = {};

        var key = null;
        for (var i = 0, len = node.childNodes.length; i < len; i++) {
            var child = node.childNodes[i];
            if (child.nodeType != 1) {
                continue;
            }

            // Grab the key, next noe should be the value
            if (child.tagName == 'key') {
                key = child.firstChild.nodeValue;
            } else {
                // Parse the value node
                data[key] = this._parseNode(child);
            }
        }
        return data;
    },

    /**
     * get filename from filepath
     * @param {String} filePath
     * @return {String}
     */
    getName:function (filePath) {
        var startPos = filePath.lastIndexOf("/", filePath.length) + 1;
        var endPos = filePath.lastIndexOf(".", filePath.length);
        return filePath.substring(startPos, endPos);
    },

    /**
     * get file extension name from filepath
     * @param {String} filePath
     * @return {String}
     */
    getExt:function (filePath) {
        var startPos = filePath.lastIndexOf(".", filePath.length) + 1;
        return filePath.substring(startPos, filePath.length);
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
        cc.spriterParser = new cc.SpriterParser();
    }
    return cc.spriterParser;
};
