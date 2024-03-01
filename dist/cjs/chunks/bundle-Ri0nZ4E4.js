'use strict';

var index$1 = require('./bundle-bjSez2lv.js');
var index = require('./bundle-8G36Z6Or.js');

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
//# sourceMappingURL=bundle-Ri0nZ4E4.js.map
