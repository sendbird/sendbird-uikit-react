'use strict';

var _tslib = require('../../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var index = require('../../chunks/bundle-Uw6P-cM9.js');
var hooks_useModal = require('../../hooks/useModal.js');
require('../../chunks/bundle-KkCwxjVN.js');
var ui_Button = require('../../ui/Button.js');
var LocalizationContext = require('../../chunks/bundle-WKa05h0_.js');
var ui_Modal = require('../../chunks/bundle-6hGNMML2.js');
var compressImages = require('../../chunks/bundle-a5LHhP6m.js');
require('../../withSendbird.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-jCTpndN0.js');
require('react-dom');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-kftX5Dbs.js');

var useHandleUploadFiles = function (_a, _b) {
    var sendFileMessage = _a.sendFileMessage, sendMultipleFilesMessage = _a.sendMultipleFilesMessage, quoteMessage = _a.quoteMessage;
    var logger = _b.logger;
    var stringSet = LocalizationContext.useLocalization().stringSet;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var imageCompression = config.imageCompression;
    var uikitUploadSizeLimit = config === null || config === void 0 ? void 0 : config.uikitUploadSizeLimit;
    var uikitMultipleFilesMessageLimit = config === null || config === void 0 ? void 0 : config.uikitMultipleFilesMessageLimit;
    var openModal = hooks_useModal.useGlobalModalContext().openModal;
    return React.useCallback(function (files) { return _tslib.__awaiter(void 0, void 0, void 0, function () {
        var ONE_MiB, compressedFiles, sendingFiles, file, imageFiles_1, otherFiles_1;
        return _tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (files.length === 0) {
                        logger.warning('Channel|useHandleUploadFiles: given file list is empty.', { files: files });
                        return [2 /*return*/];
                    }
                    if (files.length > uikitMultipleFilesMessageLimit) {
                        logger.info("Channel|useHandleUploadFiles: Cannot upload files more than ".concat(uikitMultipleFilesMessageLimit));
                        openModal({
                            modalProps: {
                                titleText: stringSet.FILE_UPLOAD_NOTIFICATION__COUNT_LIMIT.replace('%d', "".concat(uikitUploadSizeLimit)),
                                hideFooter: true,
                            },
                            childElement: function (_a) {
                                var closeModal = _a.closeModal;
                                return (React.createElement(ui_Modal.ModalFooter, { type: ui_Button.ButtonTypes.PRIMARY, submitText: stringSet.BUTTON__OK, hideCancelButton: true, onCancel: closeModal, onSubmit: closeModal }));
                            },
                        });
                        return [2 /*return*/];
                    }
                    // Validate file sizes
                    if (files.some(function (file) { return file.size > uikitUploadSizeLimit; })) {
                        // The default value of uikitUploadSizeLimit is 26MB
                        logger.info("Channel|useHandleUploadFiles: Cannot upload file size exceeding ".concat(uikitUploadSizeLimit));
                        ONE_MiB = 1024 * 1024;
                        openModal({
                            modalProps: {
                                titleText: stringSet.FILE_UPLOAD_NOTIFICATION__SIZE_LIMIT.replace('%d', "".concat(Math.floor(uikitUploadSizeLimit / ONE_MiB))),
                                hideFooter: true,
                            },
                            childElement: function (_a) {
                                var closeModal = _a.closeModal;
                                return (React.createElement(ui_Modal.ModalFooter, { type: ui_Button.ButtonTypes.PRIMARY, submitText: stringSet.BUTTON__OK, hideCancelButton: true, onCancel: closeModal, onSubmit: closeModal }));
                            },
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, compressImages.compressImages({
                            files: files,
                            imageCompression: imageCompression,
                            logger: logger,
                        })];
                case 1:
                    compressedFiles = (_a.sent()).compressedFiles;
                    sendingFiles = compressedFiles;
                    // Send File Message
                    if (sendingFiles.length === 1) {
                        logger.info('Channel|useHandleUploadFiles: sending one file.');
                        file = sendingFiles[0];
                        return [2 /*return*/, sendFileMessage({ file: file, parentMessageId: quoteMessage === null || quoteMessage === void 0 ? void 0 : quoteMessage.messageId })];
                    }
                    else if (sendingFiles.length > 1) {
                        logger.info('Channel|useHandleUploadFiles: sending multiple files.');
                        imageFiles_1 = [];
                        otherFiles_1 = [];
                        sendingFiles.forEach(function (file) {
                            if (index.isImage(file.type)) {
                                imageFiles_1.push(file);
                            }
                            else {
                                otherFiles_1.push(file);
                            }
                        });
                        return [2 /*return*/, otherFiles_1.reduce(function (previousPromise, item) {
                                return previousPromise.then(function () {
                                    return sendFileMessage({ file: item, parentMessageId: quoteMessage === null || quoteMessage === void 0 ? void 0 : quoteMessage.messageId });
                                });
                            }, (function () {
                                if (imageFiles_1.length === 0) {
                                    return Promise.resolve();
                                }
                                else if (imageFiles_1.length === 1) {
                                    return sendFileMessage({ file: imageFiles_1[0] });
                                }
                                else {
                                    return sendMultipleFilesMessage({
                                        fileInfoList: imageFiles_1.map(function (file) { return ({
                                            file: file,
                                            fileName: file.name,
                                            fileSize: file.size,
                                            mimeType: file.type,
                                        }); }),
                                        parentMessageId: quoteMessage === null || quoteMessage === void 0 ? void 0 : quoteMessage.messageId,
                                    });
                                }
                            })())];
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [sendFileMessage, sendMultipleFilesMessage, quoteMessage]);
};

exports.useHandleUploadFiles = useHandleUploadFiles;
//# sourceMappingURL=useHandleUploadFiles.js.map
