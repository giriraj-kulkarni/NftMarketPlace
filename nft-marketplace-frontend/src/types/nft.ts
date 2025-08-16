export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface NFT {
  tokenId: number;
  seller: string;
  owner: string;
  price: string;
  sold: boolean;
  metadata?: NFTMetadata;
  tokenURI?: string;
}

export interface CreateNFTData {
  name: string;
  description: string;
  image: File;
  price: string;
}

export interface Web3State {
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}
