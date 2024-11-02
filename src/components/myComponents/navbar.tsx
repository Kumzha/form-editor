"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signOut } from "@/store/user/userSlice";

// MOBILE COMPATIBLE

interface NavbarProps {
  userSignedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ userSignedIn }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignOut = (userSignedIn: boolean) => {
    if (userSignedIn) {
      dispatch(signOut());
      router.push("/login");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="navbar bg-base-200 h-14">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">LOGO</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-x-4">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
          <li>
            <a>........Long item name........</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {userSignedIn ? (
          <Button className="mr-5" onClick={() => handleSignOut(userSignedIn)}>
            Log Out
          </Button>
        ) : (
          <Button className="mr-5" onClick={() => handleSignOut(userSignedIn)}>
            Log In
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
