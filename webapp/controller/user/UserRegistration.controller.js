sap.ui.define([
	'harry/controller/BaseController',
	'harry/format/formatter',
	'sap/m/MessageToast',
	'sap/ui/model/json/JSONModel'
], function (BaseController, Formatter, MessageToast, JSONModel) {

	"use strict";

	var UserRegistration = BaseController.extend("harry.controller.user.UserRegistration", {
		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf app.controller.user.UserRegistration
		 */
		onInit: function () {
			this.getRouter().getTarget("userRegistration").attachDisplay(this.handleAttachRegistration, this);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf app.controller.user.UserRegistration
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf app.controller.user.UserRegistration
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf app.controller.user.UserRegistration
		 */
		//	onExit: function() {
		//
		//	}
		handleAttachRegistration: function (oEvent) {
			var _oData = oEvent.getParameter("data");
			this.getView().setModel(new JSONModel({
				path: this.jsonUtil().getPath() + "user/uploadUsers"
			}), "f");
		},
		handleTypeMissmatch: function (oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function (key, value) {
				aFileTypes[key] = "*." + value;
			});
			var sSupportedFileTypes = aFileTypes.join(", ");
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") + " is not supported. Choose one of the following types: " + sSupportedFileTypes);
		},

		handleSizeExceed: function (oEvent) {
			var max = oEvent.getSource().getMaximumFileSize();
			MessageToast.show("请上传不超过（" + max + "M）的文件.");
		},
		/**
		 * 附件上传完成回调
		 */
		handleUploadComplete: function (oEvent) {
			var sResponse = oEvent.getParameter("responseRaw");
			var status = oEvent.getParameter("status");
			if (sResponse) {
				if (this._success == status) {
					oEvent.getSource().setValue("");
					this.getView().setModel(new JSONModel($.parseJSON(sResponse).data), "infos");
				} else {
					MessageToast.show(data.message);
				}
			}
		},
		onSubmit: function (oEvent) {
			var oModel = this.getView().getModel("infos");
			if (oModel==undefined){
				MessageToast.show("无数据导入");
				return;
			}
			var oPage = this.byId("regid");
			oPage.setBusy(true);
			this.jsonUtil().loadData(this, "home/bulkRegistration", function (oData, model) {
				if (oData.statusCode == this._success) {
					MessageToast.show("成功!");
				} else {
					MessageToast.show(oData.message);
				}
				oPage.setBusy(false);
			}.bind(this), function (oData) {
				MessageToast.show("系统异常!");
				oPage.setBusy(false);
			}.bind(this), oModel.getJSON());
		}
	})
	return UserRegistration;
});
