import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { AtomicLogo } from '@/components/logo';
import { appName, githubUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <AtomicLogo className="size-5" />
          <span className="font-semibold">{appName}</span>
        </>
      ),
    },
    githubUrl,
    links: [
      {
        text: 'Documentation',
        url: '/docs',
        active: 'nested-url',
      },
    ],
  };
}
