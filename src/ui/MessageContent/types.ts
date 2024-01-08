export enum SbFeedbackStatus {
  /** Feedback is unavailable for this message. This is the default value for base message. */
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  /** Feedback can be set for this message, but nothing has been submitted yet. */
  NO_FEEDBACK = 'NO_FEEDBACK',
  /** Feedback can be set for this message, and something has been submitted. */
  SUBMITTED = 'SUBMITTED',
}
