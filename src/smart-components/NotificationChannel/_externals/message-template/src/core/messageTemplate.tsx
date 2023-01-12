import React from 'react';

import { ComponentType, ComponentsUnion } from '../types/components';
import type { Template } from '../types/template';
import { Parser, createParser } from './parser';
import { Renderer, createRenderer } from './renderer';

interface MessageTemplateOptions<ParsedProperties> {
  parser?: Parser<ParsedProperties>;
  renderer?: Renderer<ParsedProperties>;
  Container?: (props: React.PropsWithChildren) => React.ReactElement;
  UnknownMessage?: (props: { item: ComponentsUnion['properties'] }) => React.ReactElement | null;
}

interface MessageTemplateProps {
  templateItems: Template['body']['items'];
}

export const createMessageTemplate = <T,>(opts: MessageTemplateOptions<T>) => {
  const Container = opts.Container || React.Fragment;
  const UnknownMessage = opts.UnknownMessage || (() => null);

  const parser = opts.parser || createParser<T>();
  const renderer = opts.renderer || createRenderer<T>();

  const MessageTemplateBase = (props: MessageTemplateProps) => {
    const renderItems = props.templateItems;

    return (
      <React.Fragment>
        {renderItems.map((item, index) => {
          const props = {
            key: index,
            parsedProperties: parser.parse(item).properties,
          };

          switch (item.type) {
            case ComponentType.Box: {
              return (
                <renderer.box {...item} {...props}>
                  <MessageTemplateBase templateItems={item.items || []} />
                </renderer.box>
              );
            }

            case ComponentType.Text: {
              return <renderer.text {...item} {...props} />;
            }

            case ComponentType.Image: {
              return <renderer.image {...item} {...props} />;
            }

            case ComponentType.TextButton: {
              return <renderer.textButton {...item} {...props} />;
            }

            case ComponentType.ImageButton: {
              return <renderer.imageButton {...item} {...props} />;
            }

            default: {
              // or throw new Error('Cannot parse template item')
              return <UnknownMessage item={item} />;
            }
          }
        })}
      </React.Fragment>
    );
  };

  return {
    MessageTemplate: (props: MessageTemplateProps) => (
      <Container>
        <MessageTemplateBase {...props} />
      </Container>
    ),
    MessageTemplateBase,
  };
};
