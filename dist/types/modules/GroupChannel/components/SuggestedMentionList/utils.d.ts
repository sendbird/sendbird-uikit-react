import { GroupChannel, Member } from '@sendbird/chat/groupChannel';
export declare function fetchMembersFromChannel(currentUserId: string, channel: GroupChannel, maxSuggestionCount: number, searchString: string): Promise<Member[]>;
export declare function fetchMembersFromQuery(currentUserId: string, channel: GroupChannel, maxSuggestionCount: number, searchString: string): Promise<Member[]>;
