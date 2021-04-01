import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Icon, { IconTypes, IconColors } from '../Icon';
import Loader from '../Loader';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Label, { LabelColors, LabelTypography } from '../Label';
import _PlaceHolderTypes from './type';

export const PlaceHolderTypes = _PlaceHolderTypes;

export default function PlaceHolder({
  className,
  type,
  retryToConnect,
  searchInString,
}) {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className={[
      ...(Array.isArray(className) ? className : [className]),
      'sendbird-place-holder',
    ].join(' ')}
    >
      {
        type === PlaceHolderTypes.LOADING && (
          <Loader
            width="48px"
            height="48px"
          >
            <Icon
              type={IconTypes.SPINNER}
              fillColor={IconColors.PRIMARY}
              width="48px"
              height="48px"
            />
          </Loader>
        )
      }
      {
        (
          type === PlaceHolderTypes.NO_CHANNELS
          || type === PlaceHolderTypes.NO_MESSAGES
          || type === PlaceHolderTypes.WRONG
        ) && (
          <div className="sendbird-place-holder__body">
            {
              type === PlaceHolderTypes.NO_CHANNELS && (
                <Icon
                  className="sendbird-place-holder__body__icon"
                  type={IconTypes.CHAT}
                  fillColor={IconColors.ON_BACKGROUND_3}
                  width="64px"
                  height="64px"
                />
              )
            }
            {
              type === PlaceHolderTypes.WRONG && (
                <Icon
                  className="sendbird-place-holder__body__icon"
                  type={IconTypes.ERROR}
                  fillColor={IconColors.ON_BACKGROUND_3}
                  width="64px"
                  height="64px"
                />
              )
            }
            {
              type === PlaceHolderTypes.NO_MESSAGES && (
                <Icon
                  className="sendbird-place-holder__body__icon"
                  type={IconTypes.MESSAGE}
                  fillColor={IconColors.ON_BACKGROUND_3}
                  width="64px"
                  height="64px"
                />
              )
            }
            <Label
              className="sendbird-place-holder__body__text"
              type={LabelTypography.BODY_1}
              color={LabelColors.ONBACKGROUND_2}
            >
              {
                type === PlaceHolderTypes.NO_CHANNELS && (
                  stringSet.PLACE_HOLDER__NO_CHANNEL
                )
              }
              {
                type === PlaceHolderTypes.WRONG && (
                  stringSet.PLACE_HOLDER__WRONG
                )
              }
              {
                type === PlaceHolderTypes.NO_MESSAGES && (
                  stringSet.PLACE_HOLDER__NO_MESSAGES
                )
              }
            </Label>
            {
              retryToConnect && (
                <div
                  className="sendbird-place-holder__body__reconnect"
                  role="button"
                  onClick={retryToConnect}
                  onKeyPress={retryToConnect}
                  tabIndex={0}
                >
                  <Icon
                    className="sendbird-place-holder__body__reconnect__icon"
                    type={IconTypes.REFRESH}
                    fillColor={IconColors.PRIMARY}
                    width="20px"
                    height="20px"
                  />
                  <Label
                    className="sendbird-place-holder__body__reconnect__text"
                    type={LabelTypography.BUTTON_1}
                    color={LabelColors.PRIMARY}
                  >
                    {stringSet.PLACE_HOLDER__RETRY_TO_CONNECT}
                  </Label>
                </div>
              )
            }
          </div>
        )
      }
      {
        (
          type === PlaceHolderTypes.NO_RESULTS
          || type === PlaceHolderTypes.SEARCH_IN
          || type === PlaceHolderTypes.SEARCHING
        ) && (
          <div className="sendbird-place-holder__body--align-top">
            {
              type === PlaceHolderTypes.SEARCH_IN && (
                <div className="sendbird-place-holder__body--align-top__text">
                  <Label
                    className="sendbird-place-holder__body--align-top__text__search-in"
                    type={LabelTypography.BUTTON_2}
                    color={LabelColors.ONBACKGROUND_2}
                  >
                    {stringSet.SEARCH_IN}
                  </Label>
                  <Label
                    className="sendbird-place-holder__body--align-top__text__channel-name"
                    type={LabelTypography.BUTTON_2}
                    color={LabelColors.PRIMARY}
                  >
                    {`'${searchInString}`}
                  </Label>
                  <Label
                    className="sendbird-place-holder__body--align-top__text__quote"
                    type={LabelTypography.BUTTON_2}
                    color={LabelColors.PRIMARY}
                  >
                    {'\''}
                  </Label>
                </div>
              )
            }
            {
              type === PlaceHolderTypes.SEARCHING && (
                <Label
                  className="sendbird-place-hlder__body--align-top__searching"
                  type={LabelTypography.BODY_1}
                  color={LabelColors.ONBACKGROUND_2}
                >
                  {stringSet.SEARCHING}
                </Label>
              )
            }
            {
              type === PlaceHolderTypes.NO_RESULTS && (
                <Label
                  className="sendbird-place-hlder__body--align-top__no-result"
                  type={LabelTypography.BODY_1}
                  color={LabelColors.ONBACKGROUND_2}
                >
                  {stringSet.NO_SEARCHED_MESSAGE}
                </Label>
              )
            }
          </div>
        )
      }
    </div>
  );
}

PlaceHolder.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  type: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(PlaceHolderTypes)),
    PropTypes.string,
  ]).isRequired,
  retryToConnect: PropTypes.func,
  searchInString: PropTypes.string,
};

PlaceHolder.defaultProps = {
  className: '',
  retryToConnect: null,
  searchInString: '',
};
