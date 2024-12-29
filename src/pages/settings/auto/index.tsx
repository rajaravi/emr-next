import React, { useState, useEffect } from "react";

interface Option {
  id: number;
  name: string;
}

const DynamicDropdown: React.FC = () => {
  const [options, setOptions] = useState<Option[]>([]); // Options for the dropdown
  const [selectedOption, setSelectedOption] = useState<string | number>(""); // Selected value
  const [data, setData] = useState<any>(null); // Data fetched from API based on selection

  // Fetch options for the dropdown
  const fetchDropdownOptions = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users"); // Replace with your API
      const data = await response.json();
      setOptions(
        data.map((user: any) => ({
          id: user.id,
          name: user.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  // Fetch data based on the selected option
  const fetchDataForSelection = async (value: string | number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${value}` // Replace with your API
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data for selection:", error);
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value; // Get the selected value directly
    setSelectedOption(selectedValue); // Update the selected value in state
    fetchDataForSelection(selectedValue); // Call the API with the selected value
  };

  useEffect(() => {
    fetchDropdownOptions(); // Fetch dropdown options on component mount
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Dynamic Dropdown with API Calls</h2>

      {/* Dropdown */}
      <select
        value={selectedOption}
        onChange={handleDropdownChange}
        style={{ padding: "10px", width: "100%", marginBottom: "20px" }}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      {/* Display fetched data */}
      {data && (
        <div style={{ marginTop: "20px" }}>
          <h3>Fetched Data</h3>
          <pre style={{ backgroundColor: "#f9f9f9", padding: "10px" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DynamicDropdown;
