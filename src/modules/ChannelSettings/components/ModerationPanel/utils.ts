import {Member, MemberState} from '@sendbird/chat/groupChannel';

export function filterJoinedMembers(members: Member[]): Member[] {
  return members.filter((member: Member) => {
    return member.state === MemberState.JOINED;
  });
}

export function filterCurrentPageMembers(members: Member[], currentPage: number, pageSize: number): Member[] {
  return members.slice(
    pageSize * currentPage,
    pageSize * (currentPage + 1)
  )
}

export function filterUptoCurrentPageMembers(members: Member[], currentPage: number, pageSize: number): Member[] {
  return members.slice(
    0,
    pageSize * (currentPage + 1)
  )
}