import { TFunction } from 'i18next'
export const rulesUser = (t: TFunction) => {
  return {
    name: { min: 5, message: t('NAMEINVALID') },
    email: { type: 'email', message: t('emailInvalid') },
    password: { min: 5, message: t('PASSWORDINVALID') },
    password_confirmation: { min: 5, message: t('PASSWORDINVALID') },
    fullName: {
      pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
      message: t('INVALIDFULLNAME')
    }
  }
}
