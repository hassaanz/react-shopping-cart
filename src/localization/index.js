/**
 * @flow
 * @module localization
 *
 * @author Oleg Nosov <olegnosov1@gmail.com>
 * @license MIT
 *
 * @description
 * Default localization and API functions
 *
 */

import React from 'react';
import IntlMessageFormat from 'intl-messageformat';

import type {
  Localization,
  LocalizationPattern,
  MultiLocalization,
  GetLocalization,
} from '../types';

/**
 * @memberof localization
 */
export const defaultLocalization: MultiLocalization = {
  en: {
    cart: {
      shoppingCartTitle: {
        text: 'Einkaufswagen',
        component: 'h4',
      },
      productName: {
        text: '{localizedName}',
        component: 'h5',
      },
      quantityLabel: 'Quantität:',
      priceLabel: 'Preis:',
      priceValue: '{price, number, CUR}',
      totalLabel: 'Summe:',
      totalValue: '{total, number, CUR}',
      remove: 'Löschen',
      productPropertyLabel: '{localizedName}:',
      productPropertyValue: '{localizedValue}',
    },
    checkoutButton: {
      checkoutTotal:
        'Auschecken (Summe {total, number, CUR})',
    },
    product: {
      price: {
        text: '',
        component: 'span',
      },
      quantityLabel: 'Quantität:',
      propertyLabel: '{localizedName}:',
      addToCart: 'In den Einkaufswagen',
    },
  },
};

const createMessage = (pattern: string, language: string, params: Object): string =>
  params.currency != null
    ? new IntlMessageFormat(
        pattern, language, {
            number: {
              CUR: {
                  style   : 'currency',
                  currency: params.currency,
              }
          }
        }
      ).format(params)
    : new IntlMessageFormat(
        pattern, language
      ).format(params);

/**
 * @memberof localization
 */
export const getLocalization = (
  localization: Localization,
  language: string,
  id: string,
  params: ?Object,
): string | React$Element<*> => {
  const localizationPattern: LocalizationPattern = localization[id];
  const nonEmptyParams = params || {};

  if (localizationPattern == null) {
    if (!process || process && process.env && process.env.NODE_ENV !== 'production') {
      console.error(
        `Missing localization for ${id}, language: ${language}`,
      );
    }
    return id;
  } else if (
    typeof localizationPattern === 'object'
    && typeof localizationPattern.text === 'string'
    && ['string', 'function'].includes(
      typeof localizationPattern.component,
    )
  ) return (
      React.createElement(
        localizationPattern.component,
        localizationPattern.props || {},
        createMessage(localizationPattern.text, language, nonEmptyParams),
      )
  );
  else if (typeof localizationPattern === 'string')
    return createMessage(localizationPattern, language, nonEmptyParams);
  else throw new Error(
    `Localization pattern error for ${id}, language: ${language}`,
  );
};

/**
 * @memberof localization
 */
export const getDefaultLocalization =
  (
    componentName: string,
    language: string = 'en',
    localization: Localization = {},
  ): GetLocalization =>
    (...args: Array<any>) =>
      getLocalization(
        {
          ...(
            defaultLocalization[language]
            ? defaultLocalization[language][componentName]
            : {}
          ),
          ...localization,
        },
        language,
        ...args,
      );
