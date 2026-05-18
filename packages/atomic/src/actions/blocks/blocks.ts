import { ActSetCC } from './cookieConsent/set/block'
import { ActCCToDA } from './cookieConsent/toDA/block'
import { ActDSSetBool } from './dynamicStore/boolean/set/block'
import { ActDSBoolToDA } from './dynamicStore/boolean/toDA/block'
import { ActDSCycleText } from './dynamicStore/text/cycle/block'
import { ActDSTextToDA } from './dynamicStore/text/toDA/block'
import { ActFormErrorToDA } from './form/errorToDA/block'
import { ActResetForm } from './form/reset/block'
import { ActFormStatusToDA } from './form/statusToDA/block'
import { ActSubmitForm } from './form/submit/block'
import { ActSetPortalOpen } from './portal/set/block'
import { ActSetTheme } from './theme/set/block'

export const AllActionBlocks = [
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
]
