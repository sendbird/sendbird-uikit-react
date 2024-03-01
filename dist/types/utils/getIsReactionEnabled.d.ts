/**
 * This function helps consider the every condition
 * related to enabling emoji reaction feature.
 */
export interface IsReactionEnabledProps {
    isBroadcast?: boolean;
    isSuper?: boolean;
    globalLevel?: boolean;
    moduleLevel?: boolean;
}
export declare function getIsReactionEnabled({ isBroadcast, isSuper, globalLevel, moduleLevel, }: IsReactionEnabledProps): boolean;
