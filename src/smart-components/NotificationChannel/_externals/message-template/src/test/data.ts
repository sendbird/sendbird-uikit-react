import { ComponentType } from '../types/components';
import { ActionType } from '../types/properties';
import { AlignValue, FontWeight, Layout, MediaContentMode } from '../types/styles';
import type { Template } from '../types/template';

export const sample_1: Template = {
  version: 1,
  body: {
    items: [
      {
        type: ComponentType.Image,
        action: { type: ActionType.Web, data: 'https://docs.sendbird.com' },
        height: { type: 'fixed', value: 236 },
        imageUrl: 'https://cdn.pixabay.com/photo/2022/10/12/10/45/bird-7516219_1280.jpg',
        imageStyle: { contentMode: MediaContentMode.AspectFill },
      },
      {
        type: ComponentType.Box,
        viewStyle: { padding: { top: 12, bottom: 12, left: 12, right: 12 } },
        layout: Layout.Column,
        items: [
          {
            type: ComponentType.Box,
            align: { horizontal: AlignValue.Left, vertical: AlignValue.Center },
            layout: Layout.Row,
            items: [
              {
                type: ComponentType.Text,
                text: 'H2 Title text',
                maxTextLines: 1,
                textStyle: {
                  size: 16,
                  color: '#e10000',
                  weight: FontWeight.Bold,
                },
              },
              {
                type: ComponentType.ImageButton,
                action: { type: ActionType.UIKit, data: 'uikit://delete' },
                width: { type: 'fixed', value: 20 },
                height: { type: 'fixed', value: 20 },
                imageUrl: 'https://file-ap-1.sendbird.com/5b5379aa73fd460da22ffaf9a61d0d7f.png',
                imageStyle: { contentMode: MediaContentMode.AspectFit },
              },
            ],
          },
          {
            type: ComponentType.Text,
            viewStyle: { padding: { top: 6, bottom: 12, left: 0, right: 0 } },
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aui',
            textStyle: { size: 14, color: '#e10000' },
          },
          {
            type: ComponentType.TextButton,
            action: { type: ActionType.Web, data: 'https://www.daum.net' },
            text: 'Button 3',
            textStyle: { size: 14, color: '#742ddd', weight: FontWeight.Bold },
          },
        ],
      },
    ],
  },
};

export const sample_2: Template = {
  'version': 1,
  'body': {
    'items': [
      {
        'type': ComponentType.Image,
        'action': { 'type': ActionType.Web, 'data': 'https://www.naver.com/' },
        'height': { 'type': 'fixed', 'value': 136 },
        'imageUrl': 'https://cdn.pixabay.com/photo/2022/10/12/10/45/bird-7516219_1280.jpg',
        'imageStyle': { 'contentMode': MediaContentMode.AspectFill },
      },
      {
        'type': ComponentType.Box,
        'viewStyle': { 'padding': { 'top': 12, 'bottom': 12, 'left': 12, 'right': 12 } },
        'layout': Layout.Column,
        'items': [
          {
            'type': ComponentType.Box,
            'align': { 'horizontal': AlignValue.Left, 'vertical': AlignValue.Center },
            'layout': Layout.Row,
            'items': [
              {
                'type': ComponentType.Text,
                'text': 'H2 Title text',
                'maxTextLines': 1,
                'textStyle': { 'size': 16, 'weight': FontWeight.Bold },
              },
              {
                'type': ComponentType.ImageButton,
                'action': { 'type': ActionType.UIKit, 'data': 'uikit://delete' },
                'width': { 'type': 'fixed', 'value': 20 },
                'height': { 'type': 'fixed', 'value': 20 },
                'imageUrl': 'https://file-ap-1.sendbird.com/5b5379aa73fd460da22ffaf9a61d0d7f.png',
                'imageStyle': { 'contentMode': MediaContentMode.AspectFit },
              },
            ],
          },
          {
            'type': ComponentType.Text,
            'viewStyle': { 'padding': { 'top': 6, 'bottom': 12, 'left': 0, 'right': 0 } },
            'text':
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aui',
            'textStyle': { 'size': 14 },
          },
          {
            'type': ComponentType.Box,
            'align': { 'horizontal': AlignValue.Left, 'vertical': AlignValue.Center },
            'layout': Layout.Row,
            'items': [
              {
                'type': ComponentType.TextButton,
                'action': { 'type': ActionType.Web, 'data': 'https://www.daum.net' },
                'viewStyle': { 'margin': { 'top': 0, 'bottom': 0, 'left': 0, 'right': 4 } },
                'text': 'Button 3',
                'textStyle': { 'size': 14, 'weight': FontWeight.Bold },
              },
              {
                'type': ComponentType.TextButton,
                'action': { 'type': ActionType.Web, 'data': 'https://www.daum.net' },
                'viewStyle': { 'margin': { 'top': 0, 'bottom': 0, 'left': 4, 'right': 0 } },
                'text': 'Button 3',
                'textStyle': { 'size': 14, 'weight': FontWeight.Bold },
              },
            ],
          },
        ],
      },
    ],
  },
};

export const sample_3: Template = {
  'version': 1,
  'body': {
    'items': [
      {
        'type': ComponentType.Box,
        'viewStyle': { 'backgroundColor': '#ffffff', 'borderWidth': 1, 'borderColor': '#eeeeee', 'radius': 16 },
        'layout': Layout.Column,
        'items': [
          {
            'type': ComponentType.Image,
            'height': { 'type': 'fixed', 'value': 200 },
            'imageUrl':
              'https://img.freepik.com/free-vector/cartoon-happy-hours-background_52683-81243.jpg?w=2000&t=st=1666689198~exp=1666689798~hmac=23109d44ba03deee7aee069cbeebfcb48fa27f85e53c1cafc5d5d7345f1a2041',
            'imageStyle': { 'contentMode': MediaContentMode.AspectFill },
          },
          {
            'type': ComponentType.Box,
            'viewStyle': { 'padding': { 'top': 15, 'bottom': 15, 'left': 15, 'right': 15 } },
            'layout': Layout.Column,
            'items': [
              {
                'type': ComponentType.Text,
                'text': "Don't miss these deals today",
                'maxTextLines': 1,
                'textStyle': { 'size': 20, 'color': '#e10000', 'weight': FontWeight.Bold },
              },
              {
                'type': ComponentType.Text,
                'viewStyle': { 'margin': { 'top': 5, 'bottom': 0, 'left': 0, 'right': 0 } },
                'text': 'Pay with Maya and get cashback!',
                'maxTextLines': 1,
                'textStyle': { 'size': 14, 'color': '#e10000' },
              },
              {
                'type': ComponentType.Box,
                'align': { 'horizontal': AlignValue.Left, 'vertical': AlignValue.Center },
                'viewStyle': { 'margin': { 'top': 10, 'bottom': 0, 'left': 0, 'right': 0 } },
                'layout': Layout.Row,
                'items': [
                  {
                    'type': ComponentType.Image,
                    'width': { 'type': 'fixed', 'value': 50 },
                    'height': { 'type': 'fixed', 'value': 50 },
                    'viewStyle': {
                      'backgroundColor': '#ffffff',
                      'borderWidth': 1,
                      'borderColor': '#eeeeee',
                      'radius': 25,
                    },
                    'imageUrl':
                      'https://yt3.ggpht.com/ytc/AMLnZu8Kg89ymE7qt5bsS9vMqi9h2aHiN6m9ID-IgxR6-Q=s900-c-k-c0x00ffffff-no-rj',
                    'imageStyle': { 'contentMode': MediaContentMode.AspectFill },
                  },
                  {
                    'type': ComponentType.Box,
                    'align': { 'horizontal': AlignValue.Left, 'vertical': AlignValue.Center },
                    'viewStyle': { 'margin': { 'top': 0, 'bottom': 0, 'left': 15, 'right': 0 } },
                    'layout': Layout.Column,
                    'items': [
                      {
                        'type': ComponentType.Text,
                        'text': 'Meralco',
                        'maxTextLines': 1,
                        'textStyle': { 'size': 16, 'color': '#e10000', 'weight': FontWeight.Bold },
                      },
                      {
                        'type': ComponentType.Text,
                        'viewStyle': { 'margin': { 'top': 3, 'bottom': 0, 'left': 0, 'right': 0 } },
                        'text': '30% cashback, P300 min spend',
                        'maxTextLines': 1,
                        'textStyle': { 'size': 12, 'color': '#610000', 'weight': FontWeight.Bold },
                      },
                    ],
                  },
                ],
              },
              {
                'type': ComponentType.Box,
                'align': { 'horizontal': AlignValue.Left, 'vertical': AlignValue.Center },
                'viewStyle': { 'margin': { 'top': 10, 'bottom': 0, 'left': 0, 'right': 0 } },
                'layout': Layout.Row,
                'items': [
                  {
                    'type': ComponentType.Image,
                    'width': { 'type': 'fixed', 'value': 50 },
                    'height': { 'type': 'fixed', 'value': 50 },
                    'viewStyle': {
                      'backgroundColor': '#ffffff',
                      'borderWidth': 1,
                      'borderColor': '#eeeeee',
                      'radius': 25,
                    },
                    'imageUrl': 'https://1000logos.net/wp-content/uploads/2021/12/Globe-Telecom-logo.png',
                    'imageStyle': { 'contentMode': MediaContentMode.AspectFill },
                  },
                  {
                    'type': ComponentType.Box,
                    'align': { 'horizontal': AlignValue.Left, 'vertical': AlignValue.Center },
                    'viewStyle': { 'margin': { 'top': 0, 'bottom': 0, 'left': 15, 'right': 0 } },
                    'layout': Layout.Column,
                    'items': [
                      {
                        'type': ComponentType.Text,
                        'text': 'Globe',
                        'maxTextLines': 1,
                        'textStyle': { 'size': 16, 'color': '#e10000', 'weight': FontWeight.Bold },
                      },
                      {
                        'type': ComponentType.Text,
                        'viewStyle': { 'margin': { 'top': 3, 'bottom': 0, 'left': 0, 'right': 0 } },
                        'text': '30% cashback, P300 min spend',
                        'maxTextLines': 1,
                        'textStyle': { 'size': 12, 'color': '#610000', 'weight': FontWeight.Bold },
                      },
                    ],
                  },
                ],
              },
              {
                'type': ComponentType.Box,
                'align': { 'horizontal': AlignValue.Left, 'vertical': AlignValue.Center },
                'viewStyle': { 'margin': { 'top': 10, 'bottom': 0, 'left': 0, 'right': 0 } },
                'layout': Layout.Row,
                'items': [
                  {
                    'type': ComponentType.Image,
                    'width': { 'type': 'fixed', 'value': 50 },
                    'height': { 'type': 'fixed', 'value': 50 },
                    'viewStyle': {
                      'backgroundColor': '#ffffff',
                      'borderWidth': 1,
                      'borderColor': '#eeeeee',
                      'radius': 25,
                    },
                    'imageUrl':
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Cignal.svg/640px-Cignal.svg.png',
                    'imageStyle': { 'contentMode': MediaContentMode.AspectFill },
                  },
                  {
                    'type': ComponentType.Box,
                    'align': { 'horizontal': AlignValue.Left, 'vertical': AlignValue.Center },
                    'viewStyle': { 'margin': { 'top': 0, 'bottom': 0, 'left': 15, 'right': 0 } },
                    'layout': Layout.Column,
                    'items': [
                      {
                        'type': ComponentType.Text,
                        'text': 'Cignal',
                        'maxTextLines': 1,
                        'textStyle': { 'size': 16, 'color': '#e10000', 'weight': FontWeight.Bold },
                      },
                      {
                        'type': ComponentType.Text,
                        'viewStyle': { 'margin': { 'top': 3, 'bottom': 0, 'left': 0, 'right': 0 } },
                        'text': '30% cashback, P300 min spend',
                        'maxTextLines': 1,
                        'textStyle': { 'size': 12, 'color': '#610000', 'weight': FontWeight.Bold },
                      },
                    ],
                  },
                ],
              },
              {
                'type': ComponentType.Box,
                'align': { 'horizontal': AlignValue.Left, 'vertical': AlignValue.Center },
                'viewStyle': { 'margin': { 'top': 10, 'bottom': 0, 'left': 0, 'right': 0 } },
                'layout': Layout.Row,
                'items': [
                  {
                    'type': ComponentType.TextButton,
                    'action': { 'type': ActionType.Web, 'data': 'https://www.daum.net' },
                    'viewStyle': {
                      'backgroundColor': '#e0e0e0',
                      'radius': 16,
                      'margin': { 'top': 0, 'bottom': 0, 'left': 0, 'right': 4 },
                      'padding': { 'top': 12, 'bottom': 12, 'left': 12, 'right': 12 },
                    },
                    'text': 'Learn more',
                    'textStyle': { 'size': 15, 'color': '#e10000', 'weight': FontWeight.Bold },
                  },
                  {
                    'type': ComponentType.TextButton,
                    'action': { 'type': ActionType.Web, 'data': 'https://www.daum.net' },
                    'viewStyle': {
                      'backgroundColor': '#e10000',
                      'radius': 16,
                      'margin': { 'top': 0, 'bottom': 0, 'left': 4, 'right': 0 },
                      'padding': { 'top': 12, 'bottom': 12, 'left': 12, 'right': 12 },
                    },
                    'text': 'Pay now',
                    'textStyle': { 'size': 15, 'color': '#ffffff', 'weight': FontWeight.Bold },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
