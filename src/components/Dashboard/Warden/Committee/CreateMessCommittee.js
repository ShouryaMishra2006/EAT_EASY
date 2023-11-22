import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchResult,
  clearSearchResult,
} from "../../../../slices/profileSlice";
import { searchUserByRegistrationNumber } from "../../../../services/operations/messcommitteeAPI";
import UserDetailsComponent from "./CreateCommittee/UserDetails";

const SearchUser = () => {
  const dispatch = useDispatch();
  const { loading, searchResult } = useSelector((state) => state.profile);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [showDetails, setShowDetails] = useState(false);
  const handleSearch = async () => {
    dispatch(clearSearchResult()); // Clear previous search result
    console.log("reg no", registrationNumber);
    try {
      const response = await searchUserByRegistrationNumber(
        registrationNumber,
        token
      );
      // Dispatch success action
      console.log("response in handle search", response);
      dispatch(setSearchResult(response[0]));
      setShowDetails(false);
    } catch (error) {
      // Dispatch failure action
      console.error("Error searching for user details:", error.message);
    }
  };
  const handleShowDetails = () => {
    setShowDetails(true);
  };
  console.log("search result", searchResult);
  return (
    <div>
      <input
        type="text"
        value={registrationNumber}
        onChange={(e) => setRegistrationNumber(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        Search
      </button>
      <button onClick={handleShowDetails} disabled={!searchResult}>
        Show Details
      </button>
      {loading && <p>Loading...</p>}
      {searchResult === null && (
        <div className="text-white p-2 font-semibold">Not Found</div>
      )}
      {searchResult && (
        <div className="text-white p-2 font-semibold">
          {loading && <p>Loading...</p>}
          {searchResult === null && (
            <div className="text-white p-2 font-semibold">Not Found</div>
          )}
          {searchResult && showDetails && (
            <div className="text-white p-2 font-semibold">
              User found: {searchResult.firstName}
              {/* Add more details here based on the user object */}
              <UserDetailsComponent userDetails={searchResult} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
