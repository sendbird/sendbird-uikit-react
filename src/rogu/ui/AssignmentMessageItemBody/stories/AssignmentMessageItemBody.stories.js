import React from 'react';
import AssignmentMessageItemBody from '../index.tsx';

const mockMessage = (process) => {
  const obj = {
    message: 'go to this link sendbird.com it will be usefull to you!!',
    data: '{\"serial\":\"ASN-IHB4XI1KY1HWRWPO\",\"title\":\"Pilihan Ganda Template\",\"description\":\"Pilihan Ganda Template\",\"dueAt\":\"\",\"creatorSerial\":\"JILLYU9G79PUXOHK\",\"cta\":\"ruangguru://ruangkelas?page=assignment_detail\\u0026workspace_serial=LMS-WS-YPJJS4QTPQU89LR1\\u0026classroom_serial=LMS-CR-ARHSS4XK3RP1R0HQ\\u0026assignment_serial=ASN-IHB4XI1KY1HWRWPO\",\"ctaWeb\":\"https://kelas.sirogu.com/workspace/LMS-WS-YPJJS4QTPQU89LR1/classroom/LMS-CR-ARHSS4XK3RP1R0HQ/assignment/detail/ASN-IHB4XI1KY1HWRWPO\"}',
    sender: {
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
      nickname: 'Hoonying',
    },
    createdAt: 2000000,
    customType: 'assignment',
    data: "{\"serial\":\"ASN-F8ES2S32KFTAR5S6\",\"title\":\"Pilihan Ganda Template with deadline\",\"description\":\"Pilihan Ganda Template\",\"dueAt\":\"2022-01-01T13:20:00Z\",\"creatorSerial\":\"JILLYU9G79PUXOHK\",\"cta\":\"ruangguru://ruangkelas?page=assignment_detail\\u0026workspace_serial=LMS-WS-YPJJS4QTPQU89LR1\\u0026classroom_serial=LMS-CR-ARHSS4XK3RP1R0HQ\\u0026assignment_serial=ASN-F8ES2S32KFTAR5S6\",\"ctaWeb\":\"https://kelas.sirogu.com/workspace/LMS-WS-YPJJS4QTPQU89LR1/classroom/LMS-CR-ARHSS4XK3RP1R0HQ/assignment/detail/ASN-F8ES2S32KFTAR5S6\"}"
  };
  if (process && typeof process === 'function') {
    return process(obj)
  }
  return obj;
};

export default { title: 'ruangkelas / UI Components/AssignmentMessageItemBody' };

export const withText = () => (
  <>
    <AssignmentMessageItemBody message={mockMessage()} isByMe />
    <br />
    <br />
    <AssignmentMessageItemBody message={mockMessage()} isByMe={false} />
  </>
);
