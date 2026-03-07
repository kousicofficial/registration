

const USERS_KEY = 'registration_users';
// IMPORTANT: Replace this with your Google Apps Script Web App URL
const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2Nrk2X60NXfp4O6zCDosb-OLoo2IwQjawyqZ70Y92yJt9bwkPVWxKzBY5YiKaNYE0VA/exec'; 

// Helper function for exponential backoff fetch
const fetchWithRetry = async (url, options = {}, retries = 3, backoff = 300) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      // wait with exponential backoff
      await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
    }
  }
};

export const saveUser = async (userData) => {
  const users = getUsers();
  // Format Date and Time cleanly
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateString = now.toLocaleDateString('en-IN');
  
  if (!GOOGLE_APP_SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured.');
  }

  const queryParams = new URLSearchParams({
    action: 'register',
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    createdAt: `${timeString} - ${dateString}`
  }).toString();
  
  const submitUrl = `${GOOGLE_APP_SCRIPT_URL}?${queryParams}`;
  
  try {
    // Using fetchWithRetry to handle 5k concurrency and 429 quota errors
    const result = await fetchWithRetry(submitUrl, { method: 'GET' }, 4, 500);
    
    if (result.result !== 'success') {
      throw new Error(result.error || 'Failed to register');
    }

    const newUser = {
      ...userData,
      id: result.newId, // Gets S00X from Sheets
      createdAt: `${timeString} - ${dateString}`
    };
    
    // Save locally
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return newUser;
  } catch (err) {
    console.error("Failed to sync to Google Sheets after retries", err);
    throw new Error("High traffic detected. Please try submitting again in a few seconds.");
  }
};

export const getUser = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUsers = () => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

export const markUserPresent = async (id) => {
  if (!GOOGLE_APP_SCRIPT_URL) return false;
  try {
    const queryParams = new URLSearchParams({
      action: 'markPresent',
      id: id
    }).toString();
    
    const submitUrl = `${GOOGLE_APP_SCRIPT_URL}?${queryParams}`;
    
    // Using fetchWithRetry for robust organizer presence marking
    const result = await fetchWithRetry(submitUrl, { method: 'GET' }, 3, 500);
    
    return result.result === 'success';
  } catch(e) {
    console.error("Failed to mark present after retries", e);
    return false;
  }
};

export const sendOtp = async (phone) => {
  if (!GOOGLE_APP_SCRIPT_URL) throw new Error('Google Apps Script URL is not configured.');
  
  const queryParams = new URLSearchParams({
    action: 'sendOtp',
    phone: phone
  }).toString();
  
  const submitUrl = `${GOOGLE_APP_SCRIPT_URL}?${queryParams}`;
  const result = await fetchWithRetry(submitUrl, { method: 'GET' }, 3, 500);
  
  if (result.result !== 'success') {
    throw new Error(result.error || 'Failed to send OTP');
  }
  return true;
};

export const verifyOtp = async (phone, otp) => {
  if (!GOOGLE_APP_SCRIPT_URL) throw new Error('Google Apps Script URL is not configured.');
  
  const queryParams = new URLSearchParams({
    action: 'verifyOtp',
    phone: phone,
    otp: otp
  }).toString();
  
  const submitUrl = `${GOOGLE_APP_SCRIPT_URL}?${queryParams}`;
  const result = await fetchWithRetry(submitUrl, { method: 'GET' }, 3, 500);
  
  if (result.result !== 'success') {
    throw new Error(result.error || 'Invalid OTP');
  }
  return true;
};
