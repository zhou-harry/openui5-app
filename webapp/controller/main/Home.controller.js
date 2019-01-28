sap.ui.define([
	'harry/controller/BaseController',
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/ui/Device',
	'sap/m/Dialog'], function (
	BaseController, jQuery, Fragment, Controller, JSONModel,
	MessageToast, Device, Dialog) {

	"use strict";

	var Home = BaseController.extend("harry.controller.main.Home", {

		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before it
		 * is displayed, to bind event handlers and do other one-time
		 * initialization.
		 *
		 * @memberOf app.controller.main.Home
		 */
		// onInit: function() {
		//
		// },
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the
		 * controller's View is re-rendered (NOT before the first rendering!
		 * onInit() is used for that one!).
		 *
		 * @memberOf app.controller.main.Home
		 */
		// onBeforeRendering: function() {
		//
		// },
		/**
		 * Called when the View has been rendered (so its HTML is part of the
		 * document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 *
		 * @memberOf app.controller.main.Home
		 */
		// onAfterRendering: function() {
		//
		// },
		/**
		 * Called when the Controller is destroyed. Use this one to free resources
		 * and finalize activities.
		 *
		 * @memberOf app.controller.main.Home
		 */
		// onExit: function() {
		//
		// }
	})
	return Home;
});
