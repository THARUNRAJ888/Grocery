import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Home", to: "/products" },
  { name: "Products", to: "/products" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const Navbar = () => {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const itemCount = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <Disclosure as="nav" className="bg-white shadow sticky top-0 z-20">
      {({ open: disclosureOpen }) => (
        <>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/products" className="flex items-center gap-2 font-semibold text-primary-700">
                    <span className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 grid place-items-center">
                      🛒
                    </span>
                    FreshCart
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          isActive ? "text-primary-700" : "text-slate-600",
                          "px-3 py-2 text-sm font-medium"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/cart" className="relative text-slate-700 hover:text-primary-700">
                  <ShoppingCartIcon className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -right-2 -top-2 h-5 min-w-[20px] rounded-full bg-primary-600 px-1 text-xs text-white text-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700">
                    {user?.name || "Account"}
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? "bg-slate-100" : "",
                                "block px-4 py-2 text-sm text-slate-700"
                              )}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/orders"
                              className={classNames(
                                active ? "bg-slate-100" : "",
                                "block px-4 py-2 text-sm text-slate-700"
                              )}
                            >
                              Orders
                            </Link>
                          )}
                        </Menu.Item>
                        {user?.role === "admin" && (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/admin/products"
                                  className={classNames(
                                    active ? "bg-slate-100" : "",
                                    "block px-4 py-2 text-sm text-slate-700"
                                  )}
                                >
                                  Admin Products
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/admin/reports"
                                  className={classNames(
                                    active ? "bg-slate-100" : "",
                                    "block px-4 py-2 text-sm text-slate-700"
                                  )}
                                >
                                  Reports
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={classNames(
                                active ? "bg-slate-100" : "",
                                "block w-full px-4 py-2 text-left text-sm text-slate-700"
                              )}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <div className="flex sm:hidden">
                  <Disclosure.Button
                    className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-primary-700 focus:outline-none"
                    onClick={() => setOpen(!open)}
                  >
                    <span className="sr-only">Open main menu</span>
                    {disclosureOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      isActive ? "bg-primary-50 text-primary-700" : "text-slate-700",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <Link
                to="/cart"
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700"
              >
                Cart ({itemCount})
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;

