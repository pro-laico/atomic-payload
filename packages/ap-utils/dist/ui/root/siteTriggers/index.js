'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import './index.scss';
import { useState } from 'react';
import { revalidateTag } from '../../../utilities/revalidateTag';
import { Button, toast, PopupList } from '@payloadcms/ui';
import { triggerVercelDeployServerFunction } from './triggerVercelDeploy';
const SiteTriggers = () => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [isRevalidating, setIsRevalidating] = useState(false);
    const handleRevalidate = async (tag) => {
        setIsRevalidating(true);
        try {
            const result = await revalidateTag(tag);
            if (result?.success)
                toast.success(result.message);
            else if (result)
                toast.error(result.message);
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
        finally {
            setIsRevalidating(false);
        }
    };
    const handleDeploy = async () => {
        setIsDeploying(true);
        try {
            const result = await triggerVercelDeployServerFunction();
            if (result.success)
                toast.success(result.message);
            else
                toast.error(result.message);
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
        finally {
            setIsDeploying(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { style: { marginLeft: '-10px', marginBottom: '10px' }, children: _jsx(Button, { buttonStyle: "none", disabled: isRevalidating || isDeploying, SubMenuPopupContent: ({ close }) => (_jsxs(PopupList.ButtonGroup, { children: [_jsx(PopupList.Button, { onClick: () => {
                                    handleRevalidate('draft');
                                    close();
                                }, children: "Revalidate Drafts" }), _jsx(PopupList.Button, { onClick: () => {
                                    handleRevalidate('published');
                                    close();
                                }, children: "Revalidate Published" }), _jsx(PopupList.Button, { onClick: () => {
                                    handleDeploy();
                                    close();
                                }, children: "Trigger Deploy" })] })), children: isRevalidating ? 'Revalidating...' : isDeploying ? 'Deploying...' : 'Site Actions' }) }), _jsx("div", { style: {
                    height: '1px',
                    marginLeft: '-20px',
                    width: 'calc(100% + 40px)',
                    backgroundColor: 'var(--theme-elevation-200)',
                    marginBottom: '15px',
                } })] }));
};
SiteTriggers.displayName = 'SiteTriggers';
export default SiteTriggers;
//# sourceMappingURL=index.js.map