import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobForm = () => {
  const [jobData, setJobData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    _id: '',
    job_id: '',
    engineer_name: '',
    status: ''
  });

  // Basic Auth credentials
  const username = 'admin';
  const password = 'y!CTP4mkf7R=';

  // Function to fetch job data from the provided API
  const fetchJobData = async () => {
    try {
      const response = await axios.get('https://kizeo-webhook-testing.onrender.com/webhook-data', {
        headers: {
          Authorization: `Basic ${btoa(username + ":" + password)}`,
        }
      });
      
      setJobData(response.data); // Set the fetched data
      console.log(response.data)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchJobData(); 
  }, []);

  const handleEditClick = (job) => {
    setIsEditing(true);
    setEditedData({
      _id: job._id,
      job_id: job.job_id,
      engineer_name: job.engineer_name,
      status: job.status
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  const handleSaveClick = async () => {
    try {
      const updateData = {
        job_id: editedData.job_id,
        engineer_name: editedData.engineer_name,
        status: editedData.status
      };
  
      // Send the updated data to the server with Basic Auth
      const response = await axios.put(
        "https://dev257778.service-now.com/api/x_1578285_yogesh_0/dispatch_orders_api/trigger_webhook",
        updateData,
        {
          headers: {
            Authorization: `Basic ${btoa(username + ":" + password)}`,
            'Content-Type': 'application/json' // Ensure content type is set to JSON
          }
        }
      );
  
      console.log('Update Response:', response); // Check the response from the API
  
      setIsEditing(false); // Exit editing mode
      fetchJobData(); // Refetch job data after successful save
    } catch (error) {
      console.error('Error saving data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data); // Log error response
      }
    }
  };
  
console.log(editedData)
  return (
    <div className="container">
      <h1>Job Data</h1>

      {/* Table to display job data */}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Engineer Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobData.length > 0 ? (
            jobData.map((job) => (
              <tr key={job._id}>
                <td>
                  {isEditing && editedData._id === job._id ? (
                    <input
                      type="text"
                      name="job_id"
                      value={editedData.job_id}
                      onChange={handleInputChange}
                    />
                  ) : (
                    job.job_id
                  )}
                </td>
                <td>
                  {isEditing && editedData._id === job._id ? (
                    <input
                      type="text"
                      name="engineer_name"
                      value={editedData.engineer_name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    job.engineer_name
                  )}
                </td>
                <td>
                  {isEditing && editedData._id === job._id ? (
                    <input
                      type="text"
                      name="status"
                      value={editedData.status}
                      onChange={handleInputChange}
                    />
                  ) : (
                    job.status
                  )}
                </td>
                <td>
                  {isEditing && editedData._id === job._id ? (
                    <button onClick={handleSaveClick}>Save</button>
                  ) : (
                    <button onClick={() => handleEditClick(job)}>Edit</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Loading data...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobForm;
