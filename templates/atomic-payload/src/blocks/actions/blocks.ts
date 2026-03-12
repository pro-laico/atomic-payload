import { ActSetTheme } from './theme/set/block'
import { ActResetForm } from './form/reset/block'
import { ActSubmitForm } from './form/submit/block'
import { ActSetCC } from './cookieConsent/set/block'
import { ActSetPortalOpen } from './portal/set/block'
import { ActCCToDA } from './cookieConsent/toDA/block'
import { ActFormErrorToDA } from './form/errorToDA/block'
import { ActFormStatusToDA } from './form/statusToDA/block'
import { ActDSTextToDA } from './dynamicStore/text/toDA/block'
import { ActDSSetBool } from './dynamicStore/boolean/set/block'
import { ActDSCycleText } from './dynamicStore/text/cycle/block'
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
