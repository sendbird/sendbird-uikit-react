import { MessageTemplateData } from '../../../../ui/TemplateMessageItemBody/types';

export const PersonalTemplatesDataForTesting: MessageTemplateData[] = [
  {
    key: 'low-balance-alert',
    variables: {
      'account.image': {
        url: 'https://ddtyj01cn62am.cloudfront.net/notifications/chat-example-balance-reminder-account.png',
        width: 120,
        height: 120,
      },
      'account.name': 'Salary account',
      'account.balance': '$12',
    },
  },
  {
    key: 'fitness-promo',
    variables: {
      image: {
        url: 'https://ddtyj01cn62am.cloudfront.net/notifications/chat-example-promotion-fitness.jpg',
        width: 984,
        height: 543,
      },
      productName: 'Sendbird Fitness',
      'button1.title': 'Lean more',
    },
  },
  {
    key: 'march-promo',
    variables: {
      customer_name: 'John',
      discount_percentage: '50%',
    },
  },
  {
    key: 'socar-car-item',
  },
];
