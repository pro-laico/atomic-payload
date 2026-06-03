import { ActSetTheme } from './theme/set/filter'
import { ActResetForm } from './form/reset/filter'
import { ActSubmitForm } from './form/submit/filter'
import { ActCCToDA } from './cookieConsent/toDA/filter'
import { ActSetCC } from './cookieConsent/set/filter'
import { ActSetPortalOpen } from './portal/set/filter'
import { ActFormErrorToDA } from './form/errorToDA/filter'
import { ActFormStatusToDA } from './form/statusToDA/filter'
import { ActDSSetBool } from './dynamicStore/boolean/set/filter'
import { ActDSTextToDA } from './dynamicStore/text/toDA/filter'
import { ActDSBoolToDA } from './dynamicStore/boolean/toDA/filter'
import { ActDSCycleText } from './dynamicStore/text/cycle/filter'

export const ActionFilters = {
  ActSetCC,
  ActCCToDA,
  ActSetTheme,
  ActResetForm,
  ActDSSetBool,
  ActSubmitForm,
  ActDSBoolToDA,
  ActDSTextToDA,
  ActDSCycleText,
  ActFormErrorToDA,
  ActSetPortalOpen,
  ActFormStatusToDA,
}
