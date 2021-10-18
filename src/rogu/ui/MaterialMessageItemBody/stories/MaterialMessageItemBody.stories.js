import React from 'react';
import MaterialMessageItemBody from '../index.tsx';

export default { title: 'ruangkelas / UI Components/MaterialMessageItemBody' };

const mockMessage = (process) => {
  const obj = {
    message: 'go to this link sendbird.com it will be usefull to you!!',
    data: '{\"serial\":\"ASN-IHB4XI1KY1HWRWPO\",\"title\":\"Pilihan Ganda Template\",\"description\":\"Pilihan Ganda Template\",\"dueAt\":\"\",\"creatorSerial\":\"JILLYU9G79PUXOHK\",\"cta\":\"ruangguru://ruangkelas?page=assignment_detail\\u0026workspace_serial=LMS-WS-YPJJS4QTPQU89LR1\\u0026classroom_serial=LMS-CR-ARHSS4XK3RP1R0HQ\\u0026assignment_serial=ASN-IHB4XI1KY1HWRWPO\",\"ctaWeb\":\"https://kelas.sirogu.com/workspace/LMS-WS-YPJJS4QTPQU89LR1/classroom/LMS-CR-ARHSS4XK3RP1R0HQ/assignment/detail/ASN-IHB4XI1KY1HWRWPO\"}',
    sender: {
      profileUrl: 'https://static.sendbird.com/sample/profiles/profile_12_512px.png',
      nickname: 'Hoonying',
    },
    createdAt: 2000000,
    customType: 'material',
    data: "{\"serial\":\"SUBTOPI-2N28ZO17\",\"title\":\"Materi Google\",\"creatorSerial\":\"JILLYU9G79PUXOHK\",\"description\":\"\",\"cta\":\"ruangguru://ruangkelas?page=material_detail\\u0026workspace_serial=LMS-WS-YPJJS4QTPQU89LR1\\u0026classroom_serial=LMS-CR-ARHSS4XK3RP1R0HQ\\u0026material_serial=SUBTOPI-2N28ZO17\",\"ctaWeb\":\"https://kelas.sirogu.com/workspace/LMS-WS-YPJJS4QTPQU89LR1/classroom/LMS-CR-ARHSS4XK3RP1R0HQ/material/detail/SUBTOPI-2N28ZO17\"}"
  };
  if (process && typeof process === 'function') {
    return process(obj)
  }
  return obj;
};

export const withText = () => (
  <div>
    <MaterialMessageItemBody message={mockMessage()} isByMe />
    <br />
    <br />
    <MaterialMessageItemBody message={mockMessage()} isByMe={false} />
  </div>
);
