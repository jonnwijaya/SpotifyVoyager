// components/Header.js
import { Dialog, DialogPanel } from '@headlessui/react'; // Import Dialog components for mobile menu
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Import icons
import { useState } from 'react'; // Import useState hook

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto" />
            </a>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-700">
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
        </DialogPanel>
      </Dialog>
      <div className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img alt="" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; // Export the Header component
