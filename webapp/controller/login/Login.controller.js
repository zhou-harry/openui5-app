sap.ui.define([
	"harry/controller/BaseController",
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/ui/Device',
	'harry/format/formatter'
], function (Controller, jQuery, JSONModel, MessageToast, Device, Formatter) {
	"use strict";

	return Controller.extend("harry.controller.login.Login", {

		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf harry.controller.Login
		 */
		onInit: function () {
			// this.getRouter().getRoute("index").attachMatched(
			// 	this.onRouteMatched, this);

			var oViewModel = new JSONModel({
				isPhone: Device.system.phone
			});
			this.setModel(oViewModel, "view");

			Device.media.attachHandler(function (oDevice) {
				this.getModel("view").setProperty("/isPhone",
					oDevice.name === "Phone");
			}.bind(this));

			this.initData();

			// attach handlers for validation errors
			sap.ui.getCore().attachValidationError(this.handleValidationError);
			sap.ui.getCore().attachValidationSuccess(this.handleValidationSuccess);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf harry.controller.Login
		 */
//	onBeforeRendering: function() {
//
//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf harry.controller.Login
		 */
//	onAfterRendering: function() {
//
//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf harry.controller.Login
		 */
//	onExit: function() {
//
//	},
		initData: function () {
			this.getView().setModel(new JSONModel({
				userId: "",
				password: ""
			}), "user");
		},

		handleValidationError: function (evt) {
			var control = evt.getParameter("element");
			if (control && control.setValueState) {
				control.setValueState("Error");
			}
		},

		handleValidationSuccess: function (evt) {
			var control = evt.getParameter("element");
			if (control && control.setValueState) {
				control.setValueState("None");
			}
		},
		handleSubmit: function (evt) {
			// collect input controls
			var view = this.getView();
			var inputs = [
				view.byId("nameInput"), view.byId("passwordInput")
			];
			var valid = true;
			jQuery.each(inputs, function (i, input) {
				if (!input.getValue()) {
					input.setValueState("Error");
					valid = false;
				}
			});
			// submit
			if (valid) {
				var btn = evt.getSource();
				btn.setBusy(true);

				this.jsonUtil().loadData(this, "home/login", function (oData, model) {
					btn.setBusy(false);
					if (oData.statusCode == "200") {
						this.destroyMessage();
						this.getRouter().getTargets().display("main", {
							fromTarget: "login",
							data: oData.data
						});
						this.initData();
					} else {
						this.showMessage(oData.message);
					}
				}.bind(this), function (oData) {
					btn.setBusy(false);
					if ("timeout" == oData.message) {
						MessageToast.show("登录超时,请检查网络或稍后再试.");
					} else {
						var response = JSON.parse(oData.responseText);
						MessageToast.show("登录失败: [" + response.message + "]");
					}
				}.bind(this), view.getModel("user").getJSON());

			}
		},
		destroyMessage: function () {
			var oMs = sap.ui.getCore().byId("msgStrip");
			if (oMs) {
				oMs.destroy();
			}
		},
		showMessage: function (msg) {
			this.destroyMessage();
			var oVC = this.getView().byId("contentBox"),
				oMsgStrip = new sap.m.MessageStrip("msgStrip", {
				text: msg,
				showCloseButton: true,
				showIcon: true,
				type: "Error"
			});
			var curWwwPath = window.document.location.href + "#Help";
			var oMsgLink = new sap.m.Link("msgLink", {
				text: "忘记密码",
				target: "_self",
				href: curWwwPath
			});
			oMsgStrip.setLink(oMsgLink);
			oVC.insertItem(oMsgStrip, 1);
		}
	})
});
