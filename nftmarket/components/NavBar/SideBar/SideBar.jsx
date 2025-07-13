import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GrClose } from "react-icons/gr";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiArrowSortedDown,
  TiSocialInstagram,
  TiArrowSortedUp
} from "react-icons/ti";

// internal imports
import Style from "./SideBar.module.css";
import images from "../../../img";
import { Button } from "../../Button/Button";

const SideBar = ({ setOpenSideMenu }) => {
  const [openDiscover, setOpenDiscover] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  const discover = [
    { name: "Collection", link: "collection" },
    { name: "Search", link: "search" },
    { name: "Author Profile", link: "author-profile" },
    { name: "NFT Details", link: "NFT-details" },
    { name: "Account Setting", link: "account-setting" },
    { name: "Connect Wallet", link: "connect-wallet" },
    { name: "Blog", link: "blog" },
  ];

  const helpCenter = [
    { name: "About", link: "about" },
    { name: "Contact Us", link: "contact-us" },
    { name: "Sign Up", link: "sign-up" },
    { name: "Sign In", link: "sign-in" },
    { name: "Subscription", link: "subscription" },
  ];

  const toggleDiscover = () => setOpenDiscover(!openDiscover);
  const toggleHelp = () => setOpenHelp(!openHelp);
  const closeSideBar = () => setOpenSideMenu(false);

  return (
    <div className={Style.sideBar}>
      <GrClose className={Style.sideBar_closeBtn} onClick={closeSideBar} />

      <div className={Style.sideBar_box}>
        <Image src={images.logo} alt="logo" width={150} height={150} />
        <p>Discover the most outstanding articles on all topics of NFT!</p>

        <div className={Style.sideBar_social}>
          <a href="#"><TiSocialFacebook /></a>
          <a href="#"><TiSocialLinkedin /></a>
          <a href="#"><TiSocialTwitter /></a>
          <a href="#"><TiSocialYoutube /></a>
          <a href="#"><TiSocialInstagram /></a>
        </div>
      </div>

      <div className={Style.sideBar_menu}>
        <div>
          <div className={Style.sideBar_menu_box} onClick={toggleDiscover}>
            <p>Discover</p>
            <TiArrowSortedDown />
            {openDiscover && (
              <div className={Style.sideBar_discover}>
                {discover.map((el, i) => (
                  <p key={i}>
                    <Link href={`/${el.link}`}>{el.name}</Link>
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className={Style.sideBar_menu_box} onClick={toggleHelp}>
            <p>HelpCenter</p>
            <TiArrowSortedDown />
            {openHelp && (
              <div className={Style.sideBar_discover}>
                {helpCenter.map((el, i) => (
                  <p key={i}>
                    <Link href={`/${el.link}`}>{el.name}</Link>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={Style.sideBar_button}>
        <Button btnText="Create" handleClick={() => {}} />
        <Button btnText="Connect Wallet" handleClick={() => {}} />
      </div>
    </div>
  );
};

export default SideBar;
