# Message Module

When we first started UIKit, messages were a simple component that was used to display a file/text message.
As we started to build more complex applications, we realized that we needed a more robust way to display messages.
The Message module was created to address this need.

We plan to deprecate other message components in the future(UIKit@v4) and replace them with the Message module.

For now, we will keep the old message components and the new Message module in parallel. And try to add new components to the Message module.

Message
  -> UserMessage
    -> NotificationMessage / TemplateMessage
  -> FileMessage
    -> ThumbnailMessage(image/video)
    -> VoiceMessage
    -> FileMessage(others)
  -> AdminMessage

A UserMessage can have 3 components.
-> Simple Text
-> Mention
-> OGMessage
