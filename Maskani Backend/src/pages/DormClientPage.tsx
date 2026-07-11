import React, { useState, useEffect, useCallback } from 'react';
import { dormAPI } from '../lib/api/dorm';
import { DormData, SearchDormParams } from '../lib/api/types';
import DormMap from '../components/DormMap';
import { useNavigate } from 'react-router-dom';

const DormClientPage: React.FC = () => {
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [selectedDormId, setSelectedDormId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<SearchDormParams>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchDorms = useCallback(async () => {
    try {
      setLoading(true);
      let results;
      
      if (Object.keys(searchParams).length > 0) {
        results = await dormAPI.searchDorms(searchParams);
      } else {
        const pagedResults = await dormAPI.getDormsPaged(currentPage - 1, pageSize);
        results = pagedResults.data;
      }
      
      setDorms(results);
    } catch (error) {
      console.error('Error fetching dorms:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentPage, pageSize]);

  useEffect(() => {
    fetchDorms();
  }, [fetchDorms]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newParams: SearchDormParams = {
      university: formData.get('university') as string || undefined,
      furnished: formData.get('furnished') === 'true',
      maxDistance: Number(formData.get('maxDistance')) || undefined,
      address: formData.get('address') as string || undefined,
      dormName: formData.get('dormName') as string || undefined,
    };
    setSearchParams(newParams);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Dorm</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              University
              <input
                type="text"
                name="university"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter university name"
              />
            </label>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Max Distance (km)
              <input
                type="number"
                name="maxDistance"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter max distance"
              />
            </label>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Furnished
              <select
                name="furnished"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Search
          </button>
        </div>
      </form>

      {/* Map Component */}
      <div className="mb-8 h-[500px]">
        <DormMap selectedDormId={selectedDormId} />
      </div>

      {/* Dorm List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : (
          dorms.map((dorm) => (
            <div
              key={dorm.dormID}
              className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => {
                setSelectedDormId(dorm.dormID);
                navigate(`/dorms/${dorm.dormID}`);
              }}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{dorm.dormName}</h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">University:</span> {dorm.universityName}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Distance:</span> {dorm.distance}km
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Furnished:</span>{' '}
                  {dorm.furnishedOrNot ? 'Yes' : 'No'}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Address:</span> {dorm.address}
                </p>
                {dorm.phone && (
                  <p className="text-gray-600">
                    <span className="font-semibold">Contact:</span> {dorm.phone}
                  </p>
                )}
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dorms/${dorm.dormID}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && dorms.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
          >
            Previous
          </button>
          <span className="bg-white px-4 py-2 border-t border-b">
            Page {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={dorms.length < pageSize}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DormClientPage; 