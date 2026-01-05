'use client'
import './index.scss'
import { useState } from 'react'
import { UIFieldClientComponent } from 'payload'
import { revalidateTag } from '@/utilities/revalidateTag'
import { Button, toast, PopupList } from '@payloadcms/ui'
import { triggerVercelDeployServerFunction } from './triggerVercelDeploy'

const SiteTriggers: UIFieldClientComponent = () => {
  const [isDeploying, setIsDeploying] = useState(false)
  const [isRevalidating, setIsRevalidating] = useState(false)

  const handleRevalidate = async (tag: 'draft' | 'published') => {
    setIsRevalidating(true)

    try {
      const result = await revalidateTag(tag)
      if (result?.success) toast.success(result.message)
      else if (result) toast.error(result.message)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsRevalidating(false)
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)

    try {
      const result = await triggerVercelDeployServerFunction()
      if (result.success) toast.success(result.message)
      else toast.error(result.message)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <>
      <div style={{ marginLeft: '-10px', marginBottom: '10px' }}>
        <Button
          buttonStyle="none"
          disabled={isRevalidating || isDeploying}
          SubMenuPopupContent={({ close }) => (
            <PopupList.ButtonGroup>
              <PopupList.Button
                onClick={() => {
                  handleRevalidate('draft')
                  close()
                }}
              >
                Revalidate Drafts
              </PopupList.Button>
              <PopupList.Button
                onClick={() => {
                  handleRevalidate('published')
                  close()
                }}
              >
                Revalidate Published
              </PopupList.Button>
              <PopupList.Button
                onClick={() => {
                  handleDeploy()
                  close()
                }}
              >
                Trigger Deploy
              </PopupList.Button>
            </PopupList.ButtonGroup>
          )}
        >
          {isRevalidating ? 'Revalidating...' : isDeploying ? 'Deploying...' : 'Site Actions'}
        </Button>
      </div>
      <div
        style={{
          height: '1px',
          marginLeft: '-20px',
          width: 'calc(100% + 40px)',
          backgroundColor: 'var(--theme-elevation-200)',
          marginBottom: '15px',
        }}
      />
    </>
  )
}

SiteTriggers.displayName = 'SiteTriggers'

export default SiteTriggers
