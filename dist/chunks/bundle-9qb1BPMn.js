import { c as isMultipleFilesMessage } from './bundle-Jwc7mleJ.js';
import { K } from './bundle-AN6QCsUL.js';

function getModalDeleteMessageTitle(stringSet, message) {
    return K(message)
        .when(isMultipleFilesMessage, function () {
        var filesCount = message.fileInfoList.length;
        return "Do you want to delete all ".concat(filesCount, " photos?");
    })
        .otherwise(function () {
        return stringSet.MODAL__DELETE_MESSAGE__TITLE;
    });
}

export { getModalDeleteMessageTitle as g };
//# sourceMappingURL=bundle-9qb1BPMn.js.map
