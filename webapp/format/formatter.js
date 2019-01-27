sap.ui.define([ "sap/ui/Device" ], function(Device) {
	"use strict";
	return {

		loginImage : function(bIsPhone) {
			var sImageSrc = "";
			if (Device.system.phone === false) {
				sImageSrc = "./images/logo.jpg";
			} else {
				sImageSrc = "./images/logo_small.jpg";
			}
			return sImageSrc;
		},

		loginWidth : function() {
			var value = "100%";
			if (Device.system.phone === false) {
				value = "30%";
			} else {
				value = "85%";
			}
			return value;
		},
		/**
		 * @public
		 * @param {boolean}
		 *            bIsPhone the value to be checked
		 * @returns {string} path to image
		 */
		srcImageValue : function(bIsPhone) {
			var sImageSrc = "";
			if (Device.system.phone === false) {
				sImageSrc = "./images/homeImage.jpg";
			} else {
				sImageSrc = "./images/homeImage_small.jpg";
			}
			return sImageSrc;
		},
		genderText : function(code) {
			if (code === 0) {
				return "未知";
			} else if (code === 1) {
				return "男";
			} else if (code === 2) {
				return "女";
			}
		},
		affectiveText : function(code) {
			if (code === 0) {
				return "保密";
			} else if (code === 1) {
				return "单身";
			} else if (code === 2) {
				return "热恋";
			} else if (code === 3) {
				return "已婚";
			}
		}

	};
});