sap.ui.define([
	'harry/controller/BaseController',
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/ui/Device'], function (
	BaseController, jQuery, Fragment, Controller, JSONModel,
	MessageToast, Device) {

	"use strict";

	var Main = BaseController.extend("harry.controller.main.Main", {

		_bExpanded: true,
		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 *
		 * @memberOf app.controller.Main
		 */
		onInit: function () {

			this.getRouter().getTarget("main").attachDisplay(
				this.handleAttachDisplay, this);

			this.getView().addStyleClass(
				this.getOwnerComponent().getContentDensityClass());

			// if the app starts on desktop devices with small or meduim screen
			// size, collaps the sid navigation
			if (Device.resize.width <= 1024) {
				this.onSideNavButtonPress();
			}
			Device.media.attachHandler(function (oDevice) {
				if ((oDevice.name === "Tablet" && this._bExpanded)
					|| oDevice.name === "Desktop") {
					this.onSideNavButtonPress();
					this._bExpanded = (oDevice.name === "Desktop");
				}
			}.bind(this));
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the
		 * controller's View is re-rendered (NOT before the first rendering!
		 * onInit() is used for that one!).
		 *
		 * @memberOf app.controller.Main
		 */
		// onBeforeRendering: function() {
		//
		// },
		/**
		 * Called when the View has been rendered (so its HTML is part of the
		 * document). Post-rendering manipulations of the HTML could be done
		 * here. This hook is the same one that SAPUI5 controls get after being
		 * rendered.
		 *
		 * @memberOf app.controller.Main
		 */
		// onAfterRendering: function() {
		//
		// },
		/**
		 * Called when the Controller is destroyed. Use this one to free
		 * resources and finalize activities.
		 *
		 * @memberOf app.controller.Main
		 */
		// onExit: function() {
		//
		// },
		onSideNavButtonPress: function () {
			var oToolPage = this.byId("app");
			var bSideExpanded = oToolPage.getSideExpanded();
			this._setToggleButtonTooltip(bSideExpanded);
			oToolPage.setSideExpanded(!bSideExpanded);
		},

		/**
		 * AttachDisplay
		 */
		handleAttachDisplay: function (oEvent) {
			this._oData = oEvent.getParameter("data");
			if (this._oData !== undefined) {
				//检查前端用户会话是否存在
				this._user = this.getView().getModel("user");
				if (this._user == undefined) {
					//检查后端会话是否存在
					this._initUserInfo();
					this._user = this.getView().getModel("user");
				}
				//判断会话同步后会话是否存在
				if (this._user == undefined) {
					this.getRouter().getTargets().display("login");
					return;
				}
				//加载左侧导航菜单
				this._initSideContent();

				jQuery.sap.clearIntervalCall(this._gInterval);
				this.checkSession(this.fnSession.bind(this));

				if (this._oData.fromTarget == "login") {
					// 默认页面
					this.getRouter().getTargets().display("home");
				}
			}
		},
		/**
		 * session 过期后执行操作
		 */
		fnSession: function (interval) {
			this.onLockScreen();
		},
		/**
		 * 设置导航菜单状态
		 */
		_setToggleButtonTooltip: function (bSideExpanded) {
			var oToggleButton = this.byId('sideNavigationToggleButton');
			if (bSideExpanded) {
				oToggleButton.setTooltip('Large Size Navigation');
			} else {
				oToggleButton.setTooltip('Small Size Navigation');
			}
		},
		/**
		 * 动态菜单加载
		 */
		_initSideContent: function () {
			this.jsonUtil().loadData(this, "menu/initSide?parentKey=SIDE", function (oData, model) {
				if (oData.statusCode == this._success) {
					this.getView().setModel(new JSONModel(oData.data), "side");
				} else {
					MessageToast.show(oData.message);
				}
			}.bind(this), function (oData) {
				MessageToast.show("获取菜单失败!");
			}.bind(this));
		},
		/**
		 * 加载用户信息
		 */
		_initUserInfo: function () {
			this.jsonUtil().loadData(this, "user/getInfo", function (oData, model) {
				if (oData.statusCode == this._success) {
					if (null != oData.data) {
						oData.data.preview = this.jsonUtil().getPath() + oData.data.userId + "/" + oData.data.icon;
					}
					this.getView().setModel(new JSONModel(oData.data), "user");
				} else {
					MessageToast.show(oData.message);
				}
			}.bind(this), function (oData) {
				if ("timeout" == oData.message) {
					MessageToast.show("访问超时,请检查网络或稍后再试.");
				} else {
					this.getRouter().navTo("login");
				}
			}.bind(this), null, false, "GET");
		},
		/**
		 * 左侧导航单击事件
		 */
		onItemSelect: function (oEvent) {
			var oItem = oEvent.getParameter('item');
			var sKey = oItem.getKey();

			var arr = sKey.split("#");
			var key = arr[0], valid = "true" === arr[1], sideExpanded = "true" === arr[2];
			// if you click on home, settings or statistics button, call the
			// navTo function
			if (valid) {
				// if the device is phone, collaps the navigation side of the
				// app to give more space
				if (Device.system.phone) {
					this.onSideNavButtonPress();
				}
				var oToolPage = this.byId("app");
				this._setToggleButtonTooltip(true);
				oToolPage.setSideExpanded(sideExpanded);

				this.getRouter().getTargets().display(key);
			} else {
				MessageToast.show(sKey);
			}
		},
		/**
		 * User Press
		 */
		onUserNamePress: function (oEvent) {
			var oButton = oEvent.getSource();
			// create action sheet only once
			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment("harry.fragment.main.UserActionSheet", this);
				this.getView().addDependent(this._actionSheet);
			}
			this._actionSheet.openBy(oButton);
		},
	})
	return Main;
});
