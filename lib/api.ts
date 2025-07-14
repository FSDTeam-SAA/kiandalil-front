/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const TOKEN = session?.user?.accessToken;
    if (TOKEN) {
      config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Properties API

export async function fetchCities() {
  try {
    const response = await api.get(`/all/properties/citys`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch cities");
  }
}

export async function fetchApprovedProperties() {
  try {
    const response = await api.get(`/properties/approved/all`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch approved properties"
    );
  }
}

export async function fetchUnApprovedProperties() {
  try {
    const response = await api.get(`/properties/unapproved/all`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch approved properties"
    );
  }
}

export async function updatePropertyStatus(id: string, approve: boolean) {
  try {
    const response = await api.patch(`/properties/approve/${id}`, { approve });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update property status"
    );
  }
}

// Newsletter API

export async function subscribeNewsletter(email: string) {
  try {
    const response = await api.post(`/newsletter/subscribe`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to subscribe");
  }
}

export async function postNews(subject: string, html: string) {
  try {
    const response = await api.post(`/newsletter/broadcast`, { subject, html });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update property status"
    );
  }
}

export async function fetchAllUsers() {
  try {
    const response = await api.get(`/user/all/user`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update property status"
    );
  }
}

export async function fetchSingleUser(id: string) {
  try {
    const response = await api.get(`/user/user/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user details"
    );
  }
}

export const updateUserProfile = async (
  userId: string,
  data: any,
  token: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/profile/update/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
};

// Wishlist API

export async function fetchWishlist() {
  try {
    const response = await api.get(`/my-wishlist`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch wishlist"
    );
  }
}

export async function addToWishlist(propertyId: string) {
  try {
    const response = await api.post(`/add-wishlist`, { propertyId });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to add to wishlist"
    );
  }
}

export async function removeFromWishlist(id: string) {
  try {
    const response = await api.delete(`/remove/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to remove from wishlist"
    );
  }
}

export async function fetchAllNews() {
  try {
    const response = await api.get(`/news`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch news");
  }
}

export async function getSingleNews(id: string) {
  try {
    const response = await api.get(`/news/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch news");
  }
}

export async function createNews(data: any) {
  try {
    const response = await api.post(`/news`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create newsletter"
    );
  }
}

export async function updateNews(id: string, data: any) {
  try {
    const response = await api.patch(`/news/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update newsletter"
    );
  }
}

export async function deleteNews(id: string) {
  try {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete newsletter"
    );
  }
}
