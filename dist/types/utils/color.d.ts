import './color.scss';
export declare enum Colors {
    ONBACKGROUND_1 = "ONBACKGROUND_1",
    ONBACKGROUND_2 = "ONBACKGROUND_2",
    ONBACKGROUND_3 = "ONBACKGROUND_3",
    ONBACKGROUND_4 = "ONBACKGROUND_4",
    ONCONTENT_1 = "ONCONTENT_1",
    ONCONTENT_2 = "ONCONTENT_2",
    PRIMARY = "PRIMARY",
    ERROR = "ERROR"
}
export declare const changeColorToClassName: (color: Colors) => string;
