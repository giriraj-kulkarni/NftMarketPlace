import React from "react";

//internal imports

import Style from './Discover.module.css';
import Link from "next/link";




const Discover = () => {


    //----discover navigation menu


    const discover = [
        {
            name: "Collection",
            link: "collection",
        },
        {
            name: "Search",
            link: "search",
        },
        {
            name: "Author Profile",
            link: "author-profile",
        },
        {
            name: "NFT Details",
            link: "NFT-details",
        },
        {
            name: "Account Setting",
            link: "account-setting",
        },
        {
            name: "Connect Wallet",
            link: "Connect-wallet",
        },
        {
            name: "Blog",
            name: "blog",
        }


    ]
    return (
        <div>
          {discover.map((el, i) => (
            <div key={i + 1} className={Style.discover}>
              <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
            </div>
          ))}
        </div>
      );
    }

export default Discover;