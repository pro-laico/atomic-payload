'use client'
import './index.scss'
import React, { memo } from 'react'
import { type APFunction } from '@/ts/types/apf'
import { apfRegistry } from '@/fields/apf/storage'
import type { BeforeDocumentControlsClientProps } from 'payload'
import { Button, EditIcon, PlusIcon, LinkIcon, MenuIcon, PopupList, SearchIcon, FolderIcon, DocumentIcon, useFormFields } from '@payloadcms/ui'

type RunControlsProps = { APFunctions?: APFunction[] } & BeforeDocumentControlsClientProps

//TODO: Add better icons
const apfIcons: Record<APFunction, React.ComponentType> = {
  page: LinkIcon,
  pages: DocumentIcon,
  classes: EditIcon,
  actions: PlusIcon,
  form: MenuIcon,
  active: FolderIcon,
  seo: SearchIcon,
  sitemap: FolderIcon,
  siteMetadata: SearchIcon,
}

const RunControls: React.FC<RunControlsProps> = ({ APFunctions = Object.keys(apfRegistry) }) => {
  const runValues = useFormFields(([fields]) => {
    const values = {} as Record<APFunction, boolean>

    Object.entries(apfRegistry).forEach(([apFunction, path]) => (values[apFunction as APFunction] = Boolean(fields[path]?.value)))

    return values
  })

  const setRunValue = useFormFields(([, dispatch]) => (apFunction: APFunction, value: boolean) => {
    dispatch({ type: 'UPDATE', path: apfRegistry[apFunction], value })
  })

  const handleToggleRun = (apFunction: APFunction) => setRunValue(apFunction, !runValues[apFunction])

  const activeControls = Object.entries(runValues)
    .filter(([, isActive]) => isActive)
    .map(([apfFunction]) => apfFunction as APFunction)

  return (
    <Button
      buttonStyle="none"
      className="full-width-button"
      tooltip="Processes That Run On Save"
      SubMenuPopupContent={() => (
        <PopupList.ButtonGroup>
          <div className="apf-controls__header flex-column">
            <span className="apf-controls__header-title text-sm">Processes That Run On Save</span>
          </div>
          {Object.keys(apfRegistry)
            .filter((apFunctionString) => APFunctions.includes(apFunctionString as APFunction))
            .map((apFunctionString) => {
              const apFunction = apFunctionString as APFunction
              //const isActive = runValues[apFunction]
              const IconComponent = apfIcons[apFunction as APFunction]

              return (
                <PopupList.Button key={apFunction} onClick={() => handleToggleRun(apFunction)}>
                  <div className="apf-controls__button-content">
                    <span>{apFunction}</span>
                    <IconComponent />
                  </div>
                </PopupList.Button>
              )
            })}
        </PopupList.ButtonGroup>
      )}
    >
      {activeControls.length > 0 ? (
        <div className="apf-controls__active-controls">
          {activeControls.map((apFunction) => {
            const IconComponent = apfIcons[apFunction]
            return <IconComponent key={apFunction} />
          })}
        </div>
      ) : (
        <span>None</span>
      )}
    </Button>
  )
}

RunControls.displayName = 'RunControls'

export default memo(RunControls)
