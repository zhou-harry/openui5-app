sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"harry/util/JSONModelUtil"
	],
	function (Controller, JSONModelUtil) {
		"use strict";

		var BaseController = Controller.extend("harry.controller.BaseController", {
			_gInterval: "",
			_success: "200",

			checkSession: function (fnSession) {
				var lastTime = new Date().getTime();
				var timeOut = 30 * 60 * 1000; // 设置超时时间： 30分钟

				$(function () {
					/* 鼠标移动事件 */
					$(document).mouseover(function () {
						lastTime = new Date().getTime(); // 更新操作时间

					});
				});

				this._gInterval = jQuery.sap.intervalCall(3000, this, function () {
					if (new Date().getTime() - lastTime > timeOut) { // 判断是否超时
						fnSession(this._gInterval);
					}
				}.bind(this));
			},

			/**
			 * 返回到前一界面 // call the parent's onNavBack
			 * BaseController.prototype.onNavBack.apply(this, arguments);
			 */
			onNavBack: function () {
				var oHistory = sap.ui.core.routing.History.getInstance();
				var oPrevHash = oHistory.getPreviousHash();
				if (oPrevHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("home", {}, true);
				}
			},
			/**
			 * Convenience method for accessing the router.
			 *
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter: function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
			/**
			 * 取集合中的当前数据
			 */
			currentData: function (oEvent, name) {
				var context = oEvent.getSource().getBindingContext(name);
				var oData = context.getModel().getProperty(context.getPath());
				return oData;
			},
			/**
			 * Convenience method for getting the view model by name.
			 *
			 * @public
			 * @param {string}
			 *            [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function(sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 *
			 * @public
			 * @param {sap.ui.model.Model}
			 *            oModel the model instance
			 * @param {string}
			 *            sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function(oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			jsonUtil : function() {
				return new JSONModelUtil();
			},

		})
		return BaseController;
	});
