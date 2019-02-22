sap.ui.define([
	'harry/controller/BaseController',
	'harry/format/formatter',
	"harry/type/BaseType",
	'sap/m/MessageToast',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/ValidateException',
	"sap/m/UploadCollectionParameter",
	"sap/ui/unified/FileUploaderXHRSettings"
], function (BaseController, Formatter, BaseType, MessageToast, JSONModel, ValidateException, UploadCollectionParameter, FileUploaderXHRSettings) {

	"use strict";

	var UserList = BaseController.extend("harry.controller.user.UserList", {

		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls
		 * (if available) are already created. Can be used to modify the
		 * View before it is displayed, to bind event handlers and do other
		 * one-time initialization.
		 *
		 * @memberOf app.controller.user.UserList
		 */
		onInit: function () {

			this.getRouter().getTarget("userListMaster").attachDisplay(this.handleAttachDisplayMaster, this);
			this.getRouter().getTarget("userInfoShow").attachDisplay(this.handleAttachDisplayDetail, this);
			this.getRouter().getTarget("userInfoEdit").attachDisplay(this.handleAttachDisplayEdit, this);

			//查询参数
			this.getView().setModel(new JSONModel({
				name: null,
				mobile: null,
				gender: -1
			}), "Qinfo");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the
		 * controller's View is re-rendered (NOT before the first rendering!
		 * onInit() is used for that one!).
		 *
		 * @memberOf app.controller.user.UserList
		 */
		// onBeforeRendering: function() {
		//
		// },
		/**
		 * Called when the View has been rendered (so its HTML is part of
		 * the document). Post-rendering manipulations of the HTML could be
		 * done here. This hook is the same one that SAPUI5 controls get
		 * after being rendered.
		 *
		 * @memberOf app.controller.user.UserList
		 */
		// onAfterRendering: function() {
		//
		// },
		/**
		 * Called when the Controller is destroyed. Use this one to free
		 * resources and finalize activities.
		 *
		 * @memberOf app.controller.user.UserList
		 */
		// onExit: function() {
		//
		// },
		handleAttachDisplayMaster: function (oEvent) {
			var _oData = oEvent.getParameter("data");

			this._initUserList(null);
		},
		handleAttachDisplayDetail: function (oEvent) {
			var _oData = oEvent.getParameter("data");
			_oData.data.uploadUrl = this.jsonUtil().getPath() + "user/uploadImg";
			this.getView().setModel(new JSONModel(_oData.data), "info");

			this.getView().setModel(new JSONModel({height: $(window).height()}), "v");


			var id = this.getView().getModel("info").getData().userId;
			var city = this.getView().getModel("info").getData().city;
			// 加载照片列表
			this._initImages(id);
			//加载择友标准
			this._initFavorite(id);
			//加载城市
			var iModel = this.getView().getModel("info");
			if (null != iModel) {
				iModel.getData().cityName = this._getCity(city);
			}
			//加载我的标签
			this._getMyTags(id);
		},
		handleAttachDisplayEdit: function (oEvent) {
			var _oData = oEvent.getParameter("data");

			this.getView().setModel(new JSONModel({
				path: this.jsonUtil().getPath() + "file/uploadMultipart"
			}), "f");

			this.getView().setModel(new JSONModel(_oData.data), "info");

			this.getView().setModel(new JSONModel({
				"userId": _oData.data.userId,
				"name": _oData.data.name,
				"icon": _oData.data.icon,
				"sign": _oData.data.sign,
				"birth": _oData.data.birth,
				"id": _oData.data.id,
				"height": _oData.data.height,
				"weight": _oData.data.weight,
				"preview": _oData.data.preview,
				"gender": _oData.data.gender,
				"city": _oData.data.city,
				"affective": _oData.data.affective,
				"fromTarget": _oData.fromTarget
			}), "source");

			//加载城市列表
			this._initCity();
		},
		/**
		 * 加载用户列表
		 */
		_initUserList: function (oEvent) {

			var param = this.getView().getModel("Qinfo").getJSON();

			this.jsonUtil().loadData(this, "user/getInfos", function (oData, model) {
				if (oData.statusCode == this._success) {
					$.each(oData.data, function (index, ele) {
						ele.preview = this.jsonUtil().getPath() + ele.userId + "/" + ele.icon;
					}.bind(this))
					this.getView().setModel(new JSONModel(oData.data), "users");
				} else {
					MessageToast.show(oData.message);
				}
			}.bind(this), function (oData) {
				MessageToast.show("加载用户列表失败!");
			}.bind(this), param, true, "POST");
		},
		/**
		 * 加载照片列表
		 */
		_initImages: function (id) {
			this.jsonUtil().loadData(this, "user/images?userid=" + id, function (oData, model) {
				if (oData.statusCode == this._success) {
					$.each(oData.data, function (index, ele) {
						ele.documentId = jQuery.now().toString(),
							ele.preview = this.jsonUtil().getPath() + ele.userId + "/" + ele.imageUrl;
					}.bind(this))
					this.getView().setModel(new JSONModel(oData.data), "images");
				} else {
					MessageToast.show(oData.message);
				}
			}.bind(this), function (oData) {
				MessageToast.show("加载照片失败!");
			}.bind(this), null, null, "GET");
		},
		/**
		 * 加载择友标准
		 */
		_initFavorite: function (id) {

			this.jsonUtil().loadData(this, "user/getFavorite?userid=" + id, function (oData, model) {
				if (oData.statusCode == this._success) {
					oData.data.cityName = this._getCity(oData.data.city);
					this.getView().setModel(new JSONModel(oData.data), "favo");
				} else {
					MessageToast.show(oData.message);
				}
			}.bind(this), function (oData) {
				MessageToast.show("择友标准加载失败!");
			}.bind(this), null, null, "GET");
		},
		/**
		 * 加载城市列表
		 */
		_initCity: function () {
			this.jsonUtil().loadData(this, "md/cities", function (oData, model) {
				if (oData.statusCode == this._success) {
					this.getView().setModel(new JSONModel(oData.data), "cities");
				} else {
					MessageToast.show(oData.message);
				}
			}.bind(this), function (oData) {
				MessageToast.show("城市数据加载失败!");
			}.bind(this), null, null, "GET");
		},
		/**
		 * 加载城市名称
		 */
		_getCity: function (city) {
			var cityName;
			this.jsonUtil().loadData(this, "md/getCity?code=" + city, function (oData, model) {
				if (oData.statusCode == this._success) {
					if (oData.data != null) {
						cityName = oData.data.name;
					}
				} else {
					MessageToast.show(oData.message);
				}
			}.bind(this), function (oData) {
				MessageToast.show("城市数据加载失败!");
			}.bind(this), null, false, "GET");
			return cityName;
		},
		/**
		 * 加载我的标签
		 */
		_getMyTags: function (id) {
			var cityName;
			this.jsonUtil().loadData(this, "user/getTags?userid=" + id, function (oData, model) {
				if (oData.statusCode == this._success) {
					if (oData.data != null) {
						this.getView().setModel(new JSONModel(oData.data), "mytags");
					}
				} else {
					MessageToast.show(oData.message);
				}
			}.bind(this), function (oData) {
				MessageToast.show("城市数据加载失败!");
			}.bind(this), null, false, "GET");
			return cityName;
		},
		/**
		 * Custom model type for validating an E-Mail address
		 *
		 * @class
		 * @extends sap.ui.model.SimpleType
		 */
		_customEMailType: BaseType.extend("email", {
			formatValue: function (oValue) {
				return oValue;
			},
			parseValue: function (oValue) {
				// parsing step takes place before validating step, value could
				// be altered here
				return oValue;
			},
			validateValue: function (oValue) {
				if (oValue == "") {
					return;
				}
				// The following Regex is NOT a completely correct one and only
				// used for demonstration purposes.
				// RFC 5322 cannot even checked by a Regex and the Regex for RFC
				// 822 is very long and complex.
				var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
				if (!oValue.match(rexMail)) {
					throw new ValidateException("'" + oValue + "' is not a valid email address");
				}
			}
		}),
		/**
		 * 账号信息单击事件
		 */
		handleInfoPress: function (oEvent) {

			var oData = this.currentData(oEvent, "users");

			this.getRouter().getTargets().display("userInfoShow", {
				fromTarget: "userListMaster",
				data: oData
			});
		},
		/**
		 * 编辑信息事件
		 */
		handleInfoEdit: function (oEvent) {

			var oData = this.getView().getModel("info").getData();

			this.getRouter().getTargets().display("userInfoEdit", {
				fromTarget: "userInfoShow",
				data: oData
			});
		},
		/**
		 * 附件上传完成回调
		 */
		/*handleUploadComplete: function (oEvent) {
			var sResponse = oEvent.getParameter("responseRaw");
			var status = oEvent.getParameter("status");
			if (sResponse) {
				var data = $.parseJSON(sResponse);
				if (this._success == status) {
					oEvent.getSource().setValue("");
					var oModel = this.getView().getModel("info");
					oModel.getData()["icon"] = data.data;
					oModel.getData()["preview"] = this.jsonUtil().getPath() + oModel.getData().userId + "/" + data.data;
					oModel.refresh();
				} else {
					MessageToast.show(data.message);
				}
			}
		},
		handleFileChange: function (oEvent) {
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
		},*/
		/**
		 * 保存事件
		 */
		handlePressSave: function (oEvent) {
			// collect input controls
			var oView = this.getView();
			var inputs = [
				oView.byId("name")
			];
			var valid = true;
			jQuery.each(inputs, function (i, input) {
				if ("Error" === input.getValueState()) {
					valid = false;
				} else if (input.getRequired() && !input.getValue()) {
					input.setValueState("Error");
					valid = false;
				}
			});
			if (!valid) {
				return false;
			}
			var oModel = this.getView().getModel("info");

			this.jsonUtil().loadData(this, "user/modify", function (oData, model) {
				if (oData.statusCode == this._success) {
					this.getRouter().getTargets().display("userInfoShow", {
						fromTarget: "userInfoEdit",
						data: oModel.getData()
					});
				} else {
					MessageToast.show(oData.message);
				}
			}.bind(this), function (oData) {
				MessageToast.show("系统异常!");
			}.bind(this), oModel.getJSON());
		},
		/**
		 * 保存取消操作
		 */
		handlePressCancel: function (oEvent) {
			var oView = this.getView();
			var inputs = [
				oView.byId("name")
			];
			jQuery.each(inputs, function (i, input) {
				input.setValueState("None");
			});
			var oModel = this.getView().getModel("source");
			this.getRouter().getTargets().display(oModel.getData().fromTarget, {
				fromTarget: "userInfoEdit",
				data: oModel.getData()
			});
		},
		/**
		 * 修改密码弹窗事件
		 */
		handlePasswordEdit: function (oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("passwordEditorId");
			var iData = oView.getModel("info").getData();
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "harry.fragment.user.PasswordEditor", this);
				oDialog.setModel(new JSONModel({
					userId: iData.userId,
					newPassword: null
				}), "pinfo");
				oView.addDependent(oDialog);
			}
			oDialog.open();
		},
		handleCancelPassword: function (oEvent) {
			this.getView().byId("passwordEditorId").destroy();
		},
		handleConfirmPassword: function (oEvent) {
			var oView = this.getView();
			var oDialog = oView.byId("passwordEditorId");
			// collect input controls
			var inputs = [
				oView.byId("newPassword"),
				oView.byId("confirm")
			];
			var valid = true;
			jQuery.each(inputs, function (i, input) {
				if ("Error" === input.getValueState()) {
					valid = false;
				} else if (input.getRequired() && !input.getValue()) {
					input.setValueState("Error");
					valid = false;
				}
			});
			if (!valid) {
				return false;
			}
			var oModel = oDialog.getModel("pinfo");

			this.jsonUtil().loadData(this, "user/modifyPassword", function (oData, model) {
					oDialog.setBusy(false);
					oDialog.close();
					MessageToast.show("密码修改成功", {
						closeOnBrowserNavigation: false
					});
				}.bind(this), function (oData) {
					MessageToast.show("密码修改失败!");
					oDialog.setBusy(false);
				}.bind(this), oModel.getJSON()
			);
		},
		/**
		 * 确认密码事件
		 */
		handleConfirmChange: function (oEvent) {
			var confirmValue = oEvent.getParameter("value");
			var newValue = this.getView().byId("newPassword").getProperty("value");

			var source = oEvent.getSource();
			if (null == newValue || "" == newValue) {
				source.setValueState("Error");
				source.setValueStateText("请输入新密码!");
				return;
			}
			if (confirmValue == newValue) {
				source.setValueState("None");
			} else {
				source.setValueState("Error");
				source.setValueStateText("确认新密码有误!");
			}
		},
		// 附件======================================================================
		onChange: function (oEvent) {
			var oUploadCollection = oEvent.getSource();
			//设置跨域文件上传
			var fu = oEvent.getSource()._oFileUploader;
			// fu.setUseMultipart(true);
			fu.setXhrSettings(new FileUploaderXHRSettings({
				withCredentials: true
			}))
			// Header Token
			// oUploadCollection.addHeaderParameter(new UploadCollectionParameter({
			// 	name: "x-csrf-token",
			// 	value: "securityTokenFromModel"
			// }));
		},
		/**
		 * 删除附件
		 */
		onFileDeleted: function (oEvent) {
			var _data = this.getView().getModel("images").getData();
			var sPath = oEvent.getSource().sDeletedItemId;
			var index = sPath.substr(sPath.lastIndexOf("-") + 1);
			this.getView().setModel(new JSONModel(_data[index]), "removeImg")
			var vModel = this.getView().getModel("removeImg");
			this.jsonUtil().loadData(this,
				"user/removeImg",
				function (oData, model) {
					if (oData.statusCode == this._success) {
						_data.splice(index, 1);
						this.getView().setModel(new JSONModel(_data), "images");
					} else {
						MessageToast.show(oData.message);
					}
				}.bind(this),
				function (oData) {
					MessageToast.show("照片删除失败!");
				}.bind(this), vModel.getJSON()
			);
		},

		onFilenameLengthExceed: function (oEvent) {
			var max = oEvent.getSource().getMaximumFilenameLength();
			MessageToast.show("照片名超长,请修改照片名称在" + max + "字符以内.");
		},

		onFileSizeExceed: function (oEvent) {
			var max = oEvent.getSource().getMaximumFileSize();
			MessageToast.show("请上传不超过（" + max + "M）的照片.");
		},

		onTypeMissmatch: function (oEvent) {
			MessageToast.show("Event typeMissmatch triggered");
		},

		// Header Setting
		onBeforeUploadStarts: function (oEvent) {
			var userId = this.getView().getModel("info").getData().userId;
			// filaName
			oEvent.getParameters().addHeaderParameter(new UploadCollectionParameter({
				name: "userId",
				value: encodeURI(userId)
			}));
			// filaName
			oEvent.getParameters().addHeaderParameter(new UploadCollectionParameter({
				name: "fileName",
				value: encodeURI(oEvent.getParameter("fileName"))
			}));
			// index
			oEvent.getParameters().addHeaderParameter(new UploadCollectionParameter({
				name: "index",
				value: 10
			}));
		},
		/**
		 * 附件上载完成事件
		 */
		onUploadComplete: function (oEvent) {
			var userId = this.getView().getModel("info").getData().userId;
			this._initImages(userId);
		},
		// 附件操作结束======================================================
		/**
		 * 选择城市
		 */
		onCitySearch: function (oEvent) {
			var item = oEvent.getParameter("suggestionItem");
			if (item) {
				this.getView().getModel("info").getData().city = item.getKey();
			}
		},
		/**
		 * 城市筛选
		 */
		onCitySuggest: function (oEvent) {
			var oSF = oEvent.getSource();
			var value = oEvent.getParameter("suggestValue");
			var filters = [];
			if (value) {
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("code", function (sText) {
							return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),
						new sap.ui.model.Filter("name", function (sDes) {
							return (sDes || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						})
					], false)
				];
			}
			oSF.getBinding("suggestionItems").filter(filters);
			oSF.suggest();
		},
	})
	return UserList;
});
