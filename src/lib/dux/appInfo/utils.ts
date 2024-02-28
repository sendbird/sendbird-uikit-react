import { ProcessedMessageTemplate } from './initialState';
import { SendbirdMessageTemplate } from '../../../ui/TemplateMessageItemBody/types';

/**
 * Takes JSON parsed template and then returns processed message template for storing it in global state.
 */
export const getProcessedTemplate = (parsedTemplate: SendbirdMessageTemplate): ProcessedMessageTemplate => {
  return {
    uiTemplate: JSON.stringify(parsedTemplate.ui_template.body.items),
    colorVariables: parsedTemplate.color_variables,
  };
};

export const getProcessedTemplates = (
  parsedTemplates: SendbirdMessageTemplate[],
): Record<string, ProcessedMessageTemplate> => {
  const processedTemplates = {};
  parsedTemplates.forEach((template) => {
    processedTemplates[template.key] = getProcessedTemplate(template);
  });
  return processedTemplates;
};
