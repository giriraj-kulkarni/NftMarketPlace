'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useWeb3 } from '@/hooks/useWeb3';
import { useNFTContract } from '@/hooks/useNFTContract';
import { Button } from '@/components/ui/Button';
import { CreateNFTData } from '@/types/nft';

export default function CreateNFT() {
  const router = useRouter();
  const { provider, isConnected, connectWallet } = useWeb3();
  const { createNFT, getListingPrice, isLoading } = useNFTContract(provider);

  const [formData, setFormData] = useState<Omit<CreateNFTData, 'image'> & { image: File | null }>({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [listingPrice, setListingPrice] = useState<string>('0.0025');

  // Fetch listing price on component mount
  React.useEffect(() => {
    const fetchListingPrice = async () => {
      if (provider) {
        try {
          const price = await getListingPrice();
          setListingPrice(price);
        } catch (error) {
          console.error('Error fetching listing price:', error);
        }
      }
    };

    fetchListingPrice();
  }, [provider, getListingPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    const { name, description, price, image } = formData;
    
    if (!name || !description || !price || !image) {
      alert('Please fill in all fields and select an image');
      return;
    }

    if (parseFloat(price) <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    try {
      const nftData: CreateNFTData = {
        name,
        description,
        price,
        image
      };

      await createNFT(nftData);
      
      alert('NFT created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null,
      });
      setImagePreview(null);
      
      // Redirect to marketplace
      router.push('/marketplace');
    } catch (error: any) {
      console.error('Error creating NFT:', error);
      alert(`Error creating NFT: ${error.message || 'Unknown error'}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Connect Your Wallet</h2>
          <p className="mt-2 text-lg text-gray-600">
            You need to connect your wallet to create and mint NFTs
          </p>
          <div className="mt-6">
            <Button onClick={connectWallet} size="lg">
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Create New NFT</h1>
        <p className="mt-4 text-xl text-gray-600">
          Turn your digital artwork into a unique NFT
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="NFT Preview"
                      width={300}
                      height={300}
                      className="rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          id="image-upload"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter NFT name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your NFT"
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (ETH) *
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Important Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Listing fee: {listingPrice} ETH (paid to the marketplace)</li>
                      <li>Your NFT will be stored on IPFS for decentralized access</li>
                      <li>Once minted, your NFT will be immediately available for sale</li>
                      <li>You can set any price above 0.001 ETH</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-6">
          <Button
            type="submit"
            size="lg"
            loading={isLoading}
            disabled={isLoading || !formData.name || !formData.description || !formData.price || !formData.image}
            className="px-12"
          >
            {isLoading ? 'Creating NFT...' : 'Create NFT'}
          </Button>
          
          {isLoading && (
            <p className="mt-2 text-sm text-gray-600">
              This may take a few minutes. Please don't close this page.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
