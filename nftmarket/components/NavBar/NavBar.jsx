import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Import icons
import { MdNotifications } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";

// Internal imports
import Style from "./NavBar.module.css";
import { Discover, HelpCenter, Notification, Profile, SideBar } from "./index"; // ✅ Capital S!
import { Button } from "../ComponentIndex";
import images from "../../img";

const NavBar = () => {
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const openMenu = (e) => {
    const btnText = e.target.innerText;
    if (btnText === "Discover") {
      setDiscover(true);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    } else if (btnText === "HelpCenter") {
      setDiscover(false);
      setHelp(true);
      setNotification(false);
      setProfile(false);
    } else {
      setDiscover(false);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    }
  };

  const openNotification = () => {
    setNotification(!notification);
    if (!notification) {
      setDiscover(false);
      setHelp(false);
      setProfile(false);
    }
  };

  const openProfile = () => {
    setProfile(!profile);
    if (!profile) {
      setDiscover(false);
      setHelp(false);
      setNotification(false);
    }
  };

  const OpenSideBar = () => {
    setOpenSideMenu(!openSideMenu);
  };

  return (
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        {/* LEFT SECTION */}
        <div className={Style.navbar_container_left}>
          <div className={Style.logo}>
            <Image
              src={images.logo}
              alt="NFT MARKET PLACE"
              width={100}
              height={100}
            />
          </div>

          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type="text" placeholder="Search NFT" />
              <BsSearch onClick={() => {}} className={Style.search_icon} />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className={Style.navbar_container_right}>
          <div className={Style.navbar_container_right_discover}>
            <p onClick={(e) => openMenu(e)}>Discover</p>
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          <div className={Style.navbar_container_right_help}>
            <p onClick={(e) => openMenu(e)}>HelpCenter</p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <HelpCenter />
              </div>
            )}
          </div>

          <div className={Style.navbar_container_right_notify}>
            <MdNotifications
              className={Style.notify}
              onClick={openNotification}
            />
            {notification && <Notification />}
          </div>

          <div className={Style.navbar_container_right_button}>
            <Button btnText="Create" handleClick={() => {}} />
          </div>

          <div className={Style.navbar_container_right_profile_box}>
            <div className={Style.navbar_container_right_profile}>
              <Image
                src={images.user1}
                alt="Profile"
                width={40}
                height={40}
                onClick={openProfile}
                className={Style.navbar_container_right_profile}
              />
              {profile && <Profile />}
            </div>

            <div className={Style.navbar_container_right_menuBtn}>
              <CgMenuRight
                className={Style.MenuIcon}
                onClick={OpenSideBar}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Component */}
      {openSideMenu && (
        <div className={Style.sideBar}>
          <SideBar setOpenSideMenu={setOpenSideMenu} />
        </div>
      )}
    </div>
  );
};

export default NavBar;
