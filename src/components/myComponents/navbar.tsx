"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signOut } from "@/store/user/userSlice";
import { FaUserCircle } from "react-icons/fa";

// MOBILE COMPATIBLE

const Navbar: React.FC = () => {
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
    <div className="navbar h-10 bg-gray-100">
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] w-52 px-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </div>
        <p className="text-xl font-bold font-sans pl-5">
          Form Matcher <span className="text-blue-500">PRO</span>
        </p>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-x-4">
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Button
          variant={"primary"}
          className="mr-5"
          onClick={() => console.log("sign out")}
        >
          Export
        </Button>
        <Button className="mr-5" onClick={() => console.log("sign out")}>
          Collaborate
        </Button>
        <FaUserCircle className="text-4xl mr-2" />
      </div>
    </div>
  );
};

export default Navbar;
