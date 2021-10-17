export const isAssignmentMessage = (customType: string): boolean => customType === 'assignment';

export const isMaterialMessage = (customType: string): boolean => customType === 'material';

export const assignmentCtaToWeb = (cta:string):string=> {
    const listOfSerials = cta.split("&");
    const workspaceSerial = listOfSerials[1].split("=")[1];
    const classroomSerial = listOfSerials[2].split("=")[1];
    const assignmentSerial = listOfSerials[3].split("=")[1];
    const url = `https://kelas.ruangguru.com/workspace/${workspaceSerial}/classroom/${classroomSerial}/assignment/detail/${assignmentSerial}`;
    
    return url;
};


export const convertAssignmentDueUTCtoLocale = (dueAt:string):string => {
    
    const localeDate = new Date(dueAt).toLocaleString();
    console.log(dueAt, localeDate);

    return localeDate;
}
