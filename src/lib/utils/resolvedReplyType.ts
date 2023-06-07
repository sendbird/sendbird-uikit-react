import { ReplyType as UpperCaseReplyType } from '../../types';

type LowerCaseReplyType = Lowercase<UpperCaseReplyType>;

export default function getCaseResolvedReplyType(replyType: UpperCaseReplyType | LowerCaseReplyType): {
  lowerCase: LowerCaseReplyType;
  upperCase: UpperCaseReplyType;
} {

  return {
    lowerCase: <LowerCaseReplyType>replyType.toLowerCase(),
    upperCase: <UpperCaseReplyType>replyType.toUpperCase(),
  };
}
