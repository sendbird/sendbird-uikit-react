import { b as isFileMessage, c as isMultipleFilesMessage } from './bundle-Jwc7mleJ.js';
import { K } from './bundle-AN6QCsUL.js';

function getMessageFirstFileType(message) {
    return K(message)
        .when(isFileMessage, function () {
        var _a;
        return (_a = message === null || message === void 0 ? void 0 : message.type) !== null && _a !== void 0 ? _a : '';
    })
        .when(isMultipleFilesMessage, function () {
        var _a, _b;
        return (_b = (_a = getFirstFileInfo(message)) === null || _a === void 0 ? void 0 : _a.mimeType) !== null && _b !== void 0 ? _b : '';
    })
        .otherwise(function () {
        return '';
    });
}
function getFirstFileInfo(message) {
    var fileInfoList = message.fileInfoList;
    return fileInfoList.length > 0 ? fileInfoList[0] : null;
}
function getMessageFirstFileName(message) {
    return K(message)
        .when(isFileMessage, function () {
        var _a;
        return (_a = message === null || message === void 0 ? void 0 : message.name) !== null && _a !== void 0 ? _a : '';
    })
        .when(isMultipleFilesMessage, function () {
        var _a, _b;
        return (_b = (_a = getFirstFileInfo(message)) === null || _a === void 0 ? void 0 : _a.fileName) !== null && _b !== void 0 ? _b : '';
    })
        .otherwise(function () {
        return '';
    });
}
function getMessageFirstFileUrl(message) {
    return K(message)
        .when(isFileMessage, function () {
        var _a;
        return (_a = message === null || message === void 0 ? void 0 : message.url) !== null && _a !== void 0 ? _a : '';
    })
        .when(isMultipleFilesMessage, function () {
        var _a, _b;
        return (_b = (_a = getFirstFileInfo(message)) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '';
    })
        .otherwise(function () {
        return '';
    });
}
function getMessageFirstFileThumbnails(message) {
    return K(message)
        .when(isFileMessage, function () {
        return message.thumbnails;
    })
        .when(isMultipleFilesMessage, function () {
        var _a, _b;
        return (_b = (_a = getFirstFileInfo(message)) === null || _a === void 0 ? void 0 : _a.thumbnails) !== null && _b !== void 0 ? _b : [];
    })
        .otherwise(function () {
        return [];
    });
}
function getMessageFirstFileThumbnailUrl(message) {
    var thumbnails = getMessageFirstFileThumbnails(message);
    return (thumbnails && thumbnails.length > 0) ? thumbnails[0].url : '';
}

export { getMessageFirstFileType as a, getMessageFirstFileName as b, getMessageFirstFileThumbnailUrl as c, getMessageFirstFileUrl as g };
//# sourceMappingURL=bundle-NGtuBFFS.js.map
