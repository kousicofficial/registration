import { v4 as uuidv4 } from 'uuid';

const USERS_KEY = 'registration_users';
// IMPORTANT: Replace this with your Google Apps Script Web App URL
const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-DBiaj9NfBPprRaPVTb7mlrJDUeJS2fgJiLgJy8ko8N4FHD1VJ-n4Ds2a2EdqzEjx/exec'; 

export const saveUser = (userData) => {
  const users = getUsers();
  const newUser = {
    ...userData,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  };
  
  // Save locally
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Sync to Google Sheets if App Script URL is configured
  if (GOOGLE_APP_SCRIPT_URL) {
    try {
      // Build form data to send to Google Apps script
      const queryParams = new URLSearchParams({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        organization: newUser.organization,
        createdAt: newUser.createdAt
      }).toString();

      // Submit using a GET request (avoids CORS preflight issues with POST)
      const submitUrl = `${GOOGLE_APP_SCRIPT_URL}?${queryParams}`;
      
      fetch(submitUrl, {
        method: 'GET',
        mode: 'no-cors' // Usually required for simple Google Apps Script setups
      }).catch(err => console.error("Error syncing to Google Sheets:", err));
    } catch (e) {
      console.error("Failed to sync to Google Sheets", e);
    }
  }

  return newUser;
};

export const getUser = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUsers = () => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};
