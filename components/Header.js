// components/Header.js
"use client"; // Mark as client component to use React hooks

import { Fragment, useState, useEffect } from 'react'; // Import React hooks
import Link from 'next/link'; // Import Next.js Link for client-side navigation
import { Dialog, Transition } from '@headlessui/react'; // Import HeadlessUI components for UI elements
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Import icons

// Navigation links for the header
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
  { name: 'Dashboard', href: '/dashboard' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu open/closed
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  
  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken'); // Get token from storage
    const expiration = localStorage.getItem('tokenExpiration'); // Get expiration time
    
    // Set logged in if token exists and is valid
    setIsLoggedIn(token && expiration && parseInt(expiration) > Date.now());
  }, []);
  
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Desktop navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <span className="sr-only">Spotify Voyager</span>
            {/* You can replace this with your logo */}
            <div className="h-8 w-8 bg-[#1DB954] rounded-full flex items-center justify-center">
              <span className="text-white font-bold">SV</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">Spotify Voyager</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Desktop navigation links */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#1DB954] transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>
        
        {/* Login/Profile button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm font-semibold leading-6 text-white bg-[#1DB954] px-4 py-2 rounded-md hover:bg-[#19a34b] transition-colors"
            >
              My Dashboard
            </Link>
          ) : (
            <Link
              href="/api/auth/login"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-[#1DB954] transition-colors"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      
      {/* Mobile menu dialog */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog className="lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Spotify Voyager</span>
                  <div className="h-8 w-8 bg-[#1DB954] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">SV</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    {isLoggedIn ? (
                      <Link
                        href="/dashboard"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-[#1DB954] hover:bg-[#19a34b]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/api/auth/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </header>
  );
}