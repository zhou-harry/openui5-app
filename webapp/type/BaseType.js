sap.ui.define([
	'sap/ui/model/SimpleType',
	'sap/ui/model/ValidateException',
	"sap/ui/model/json/JSONModel",
	], function (SimpleType, ValidateException, JSONModel) {
		"use strict";

		return SimpleType.extend("harry.type.BaseType", {
			
			JsonModel : function() {
				return new JSONModel();
			}
			
		});

	});
