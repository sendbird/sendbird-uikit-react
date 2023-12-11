import { GroupChannel, Member } from '@sendbird/chat/groupChannel';

export async function fetchMembersFromChannel(
  currentUserId: string,
  channel: GroupChannel,
  maxSuggestionCount: number,
  searchString: string,
): Promise<Member[]> {
  return channel.members
    .sort((a, b) => a.nickname?.localeCompare(b.nickname))
    .filter(
      (member) => member.nickname?.toLowerCase().startsWith(searchString.toLowerCase())
        && member.userId !== currentUserId
        && member.isActive,
    ).slice(0, maxSuggestionCount);
}

export async function fetchMembersFromQuery(
  currentUserId: string,
  channel: GroupChannel,
  maxSuggestionCount: number,
  searchString: string,
): Promise<Member[]> {
  const query = channel.createMemberListQuery({
    limit: maxSuggestionCount + 1, // because current user could be included
    nicknameStartsWithFilter: searchString,
  });
  return query.next()
    .then((memberList) => {
      return memberList
        .filter((member) => currentUserId !== member?.userId)
        .slice(0, maxSuggestionCount);
    });
}
