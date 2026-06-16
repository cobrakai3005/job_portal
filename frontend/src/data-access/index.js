import { api } from "../config/axios";

/* 
   AXIOS INSTANCE
- */

/* 
   REGISTER
- */

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Registration failed",
      }
    );
  }
};

/* 
   LOGIN
- */

export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Login failed",
      }
    );
  }
};

/* 
   LOGOUT
- */

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Logout failed",
      }
    );
  }
};

/* 
   GET LOGGED-IN USER
- */

export const getMe = async () => {
  try {
    const response = await api.get("/auth/get-me");

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch user",
      }
    );
  }
};

/* 
   GET ALL JOBS
 */

export const getAllJobs = async ({ search }) => {
  try {
    const response = await api.get("/jobs", {
      params: {
        search,
      },
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch jobs",
      }
    );
  }
};

/* 
   GET JOB BY ID
 */

export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch job",
      }
    );
  }
};

/* 
   CREATE JOB
 */

export const createJob = async (jobData) => {
  try {
    const formData = new FormData();

    Object.keys(jobData).forEach((key) => {
      formData.append(key, jobData[key]);
    });

    const response = await api.post("/jobs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to create job",
      }
    );
  }
};

/* 
   UPDATE JOB
 */

export const updateJob = async ({ id, jobData }) => {
  try {
    const response = await api.put(`/jobs/${id}`, jobData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.log(error.response);

    throw (
      error.response?.data || {
        message: "Failed to update job",
      }
    );
  }
};

/* 
   DELETE JOB
 */

export const deleteJob = async (id) => {
  try {
    const response = await api.delete(`/jobs/${id}`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to delete job",
      }
    );
  }
};

/* 
   CREATE APPLICATION
 */

export const createApplication = async (applicationData) => {
  try {
    const formData = new FormData();

    Object.keys(applicationData).forEach((key) => {
      formData.append(key, applicationData[key]);
    });

    const response = await api.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to create application",
      }
    );
  }
};

/* 
   GET ALL APPLICATIONS
 */

export const getApplications = async ({ status, search: designation }) => {
  try {
    const response = await api.get("/apply", {
      params: {
        status,
        designation,
      },
    });

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch applications",
      }
    );
  }
};

/* 
   GET SINGLE APPLICATION
 */

export const getApplicationById = async (id) => {
  try {
    const response = await api.get(`/apply/${id}`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch application",
      }
    );
  }
};

/* 
   UPDATE APPLICATION
 */

export const updateApplication = async ({ id, applicationData }) => {
  try {
    const response = await api.patch(`/apply/${id}`, applicationData);
    console.log(response);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to update application",
      }
    );
  }
};

/* 
   DELETE APPLICATION
 */

export const deleteApplication = async (id) => {
  try {
    const response = await api.delete(`/apply/${id}`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to delete application",
      }
    );
  }
};

// GET ALL LOCATIONS

export const getLocations = async () => {
  try {
    const response = await api.get("/locations");

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch locations",
      }
    );
  }
};

/*
   GET LOCATION BY ID
============ */

export const getLocationById = async (locationId) => {
  try {
    const response = await api.get(`/locations/${locationId}`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch location",
      }
    );
  }
};

/*
   CREATE LOCATION
============ */

export const createLocation = async (locationData) => {
  try {
    const response = await api.post("/locations", locationData);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to create location",
      }
    );
  }
};

/*
   UPDATE LOCATION
============ */

export const updateLocation = async (location) => {
  const { id, ...rest } = location;

  try {
    const response = await api.put(`/locations/${id}`, rest);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to update location",
      }
    );
  }
};

/*
   DELETE LOCATION
============ */

export const deleteLocation = async (locationId) => {
  try {
    console.log(locationId);

    const response = await api.delete(`/locations/${locationId}`);

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to delete location",
      }
    );
  }
};
