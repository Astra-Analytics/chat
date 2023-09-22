import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

// import './globals.css';
// import { Docs, Github, Times } from './icons';
// import { Twitter } from './icons';
// import { Discord } from './icons';
import {
  ClerkProvider,
  OrganizationSwitcher,
  SignedIn,
  UserButton,
} from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    <ClerkProvider>
      <div className={`${inter.className} min-h-screen flex flex-col`}>
        <div className="flex items-center h-20 gap-4 px-4 border-b border-black border-solid sm:px-8 border-opacity-20">
          <Link
            href="/sign-in"
            className="flex items-center h-20 gap-2 sm:gap-4"
          >
            {/* <Image
              src="/Aero.svg"
              alt="Aero Logo"
              width={102}
              height={32}
              priority
            /> */}
            <p className="hidden sm:block text-sm text-white">Aero</p>
          </Link>
          <div className="grow" />
          <SignedIn>
            <div className="hidden sm:block">
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/payments/enterprise"
                afterSwitchOrganizationUrl="/dashboard"
              />
            </div>
            <div className="block sm:hidden">
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/payments/enterprise"
                afterSwitchOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    organizationSwitcherTriggerIcon: `hidden`,
                    organizationPreviewTextContainer: `hidden`,
                    organizationSwitcherTrigger: `pr-0`,
                  },
                }}
              />
            </div>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
        <SignedIn>
          <div className="flex-grow">{children}</div>
        </SignedIn>
      </div>
    </ClerkProvider>
    //{/* <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js" />
    // <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js" />
    // </html> */} //
  );
}
