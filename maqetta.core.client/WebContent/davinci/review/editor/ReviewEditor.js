define([
    "dojo/_base/declare",
    "davinci/ui/ModelEditor",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "davinci/review/editor/Context",
	"davinci/Runtime"
], function(declare, ModelEditor, BorderContainer, ContentPane, Context, Runtime) {
	
return declare("davinci.review.editor.ReviewEditor", ModelEditor, {

	isReadOnly: true,

	constructor: function(element) {
		this._bc = new dijit.layout.BorderContainer({}, element);
		this.domNode = this._bc.domNode;
		this._designCP = new dijit.layout.ContentPane({region:'center'});
		this._bc.addChild(this._designCP);

		this._bc.startup();
		this._bc.resize();
		this.isReadOnly = true;
		dojo.subscribe("/davinci/review/resourceChanged", this, function(arg1,arg2,arg3) {
			if (arg2!="open"&&arg2!="closed" || !this.resourceFile) {
				return;
			}
			var version = this.resourceFile.parent;
			if (version.timeStamp == arg3.timeStamp) {
				var node = davinci.review.model.resource.root.findFile(version.timeStamp,
						this.resourceFile.name);
				this.resourceFile = node;
			}

		});
	},

	supports : function(something) {
		return something=="states";
	},

	focus : function() {
	},


	getContext : function() {
		return this.context;
	},

	setContent : function(filename, content) {
		this.fileName = filename;
		this.basePath = new davinci.model.Path(filename);
		// URL will always be http://localhost:8080/davinci/review without / at the end at present
		var locationPath = new davinci.model.Path(davinci.Workbench.location());
		locationPath = locationPath.removeLastSegments().append("review"); // delete /maqetta
		var baseUrl;

		var designerName = Runtime.commenting_designerName || dojo.byId('davinci_user').innerHTML;
		// Compose a URL like http://localhost:8080/davinci/review/user/heguyi/ws/workspace/.review/snapshot/20100101/folder1/sample1.html
		baseUrl = locationPath.append("user").append(designerName)
		.append("ws").append("workspace").append(filename).toString();

		this.context = new Context({
			containerNode: this._designCP.domNode,
			baseURL : baseUrl,
			fileName : this.fileName,
			resourceFile: this.resourceFile,
			containerEditor:this
		});

		this.title = dojo.doc.title;
		this.context.setSource();
	},

	destroy : function() {
		this.inherited(arguments);
	},

	onResize: function() {

	}

});
});
