import { ActSetTheme } from './theme/set/block'
import { ActSetCC } from './cookieConsent/set/block'
import { ActResetForm } from './form/reset/block'
import { ActCCToDA } from './cookieConsent/toDA/block'
import { ActSubmitForm } from './form/submit/block'
import { ActSetPortalOpen } from './portal/set/block'
import { ActFormErrorToDA } from './form/errorToDA/block'
import { ActFormStatusToDA } from './form/statusToDA/block'
import { ActDSTextToDA } from './dynamicStore/text/toDA/block'
import { ActDSCycleText } from './dynamicStore/text/cycle/block'
import { ActDSSetBool } from './dynamicStore/boolean/set/block'
import { ActDSBoolToDA } from './dynamicStore/boolean/toDA/block'

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
