'use strict';

var index$1 = require('./bundle-Uw6P-cM9.js');
var index = require('./bundle-tNuJSOqI.js');

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
//# sourceMappingURL=bundle-gOYUXAiI.js.map
