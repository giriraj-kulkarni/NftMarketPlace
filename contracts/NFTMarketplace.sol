// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//internal import for nft

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";


contract NFTMarketplace is ERC721URIStorage{
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.0025 ether;

    address payable owner;

    mapping(uint256 => MarketItem) private idMarketItem;


    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event idMarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold


    );

   modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
}

    constructor() ERC721("NFT Metavarse Token", "MYNFT") {
        owner == payable(msg.sender);


    }

    function updateListingPrice(uint256 _listingPrice) public payable onlyOwner(){

        listingPrice = _listingPrice;


    }

    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }

    // let create "create nft token function"

    function createToken(string memory tokenURI, uint256 price) public payable returns(uint256){
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();


        _mint(msg.sender, newTokenId);

        _setTokenURI(newTokenId,tokenURI);


        createMarketItem(newTokenId,price);

        return newTokenId;




    }

    function createMarketItem(uint256 tokenId, uint256 price) private{
        require(price > 0,"price myst be atleast 1");
        require(msg.value == listingPrice,"price must be equal to listing price");

        idMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);

        emit idMarketItemCreated(tokenId, msg.sender, address(this), price, false);

    }


    //function for resell token

    function reSellToken(uint256 tokenId,uint256 price) public payable{

        require(idMarketItem[tokenId].owner == msg.sender,"Only item owner can perform this");

        require(msg.value == listingPrice,"Price must be equal to the Listing price");
        idMarketItem[tokenId].sold = false;
        idMarketItem[tokenId].price = price;
        idMarketItem[tokenId].seller = payable(msg.sender);
        idMarketItem[tokenId].owner = payable(address(this));

        _itemsSold.decrement();
        _transfer(msg.sender,address(this), tokenId);

        

    }


    //function create market sale

    function createMarketSale(uint256 tokenId) public payable{
        uint256 price = idMarketItem[tokenId].price;

        require(msg.value == price,"please submit the asking price in order to complete the process");

        idMarketItem[tokenId].owner = payable(msg.sender);
        idMarketItem[tokenId].sold = true;
        idMarketItem[tokenId].owner = payable(address(0));


        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice);

        payable(idMarketItem[tokenId].seller).transfer(msg.value);

        
    }


    //getting unsold nft data

    function fetchMarketItem() public view
    returns(MarketItem[]memory){

        uint256 itemCount = _tokenIds.current();
        uint256 unSoldItemCount = _tokenIds.current() - _itemsSold.current();

        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unSoldItemCount);
        for (uint256 i = 0; i < itemCount; i++){
            if(idMarketItem[i + 1].owner == address(this)){
                uint256 currentId = i + 1;

                MarketItem storage currentItem = idMarketItem[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;

            }
        }

        return items;



    }


    //purchase item

    function fetchMyNFT() public view returns(MarketItem[]memory){

        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for(uint256 i = 0; i < totalCount; i++){
            if(idMarketItem[i+1].owner == msg.sender){
                itemCount +=1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint256 i = 0; i < totalCount; i++){
            if(idMarketItem[i + 1].owner == msg.sender){


            uint256 currentId = i + 1;
            MarketItem storage currentItem = idMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
            }
        }
        return items;

    } 

    //single user items

    function fetchItemsListed() public view returns(MarketItem[]memory)
    {

        uint256 totalCount = _tokenIds.current();
        uint256 itemsCount = 0;
        uint256 currentIndex = 0;

        for(uint256 i = 0; i < totalCount; i++){
            if(idMarketItem[i+1].seller == msg.sender){
                itemsCount +=1;
            }
        }
        MarketItem[] memory items = new MarketItem[] (itemsCount);

        for(uint256 i  = 0; i < totalCount; i++){
            if(idMarketItem[i+1].seller == msg.sender){
                uint256 currentId = i + 1;

                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;

            }
        }

        return items;

    }
    

}
