'use strict';

var index$1 = require('./bundle-wzulmlgb.js');
var index = require('./bundle-3fb9w4KI.js');

function getModalDeleteMessageTitle(stringSet, message) {
    return index.K(message)
        .when(index$1.isMultipleFilesMessage, function () {
        var filesCount = message.fileInfoList.length;
        return "Do you want to delete all ".concat(filesCount, " photos?");
    })
        .otherwise(function () {
        return stringSet.MODAL__DELETE_MESSAGE__TITLE;
    });
}

exports.getModalDeleteMessageTitle = getModalDeleteMessageTitle;
//# sourceMappingURL=bundle-_t5Ozfpd.js.map
