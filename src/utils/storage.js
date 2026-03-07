

const USERS_KEY = 'registration_users';
// IMPORTANT: Replace this with your Google Apps Script Web App URL
const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2Nrk2X60NXfp4O6zCDosb-OLoo2IwQjawyqZ70Y92yJt9bwkPVWxKzBY5YiKaNYE0VA/exec'; 

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
    const response = await fetch(submitUrl);
    const result = await response.json();
    
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
    console.error("Failed to sync to Google Sheets", err);
    throw err;
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
    
    const response = await fetch(submitUrl);
    const result = await response.json();
    
    return result.result === 'success';
  } catch(e) {
    console.error(e);
    return false;
  }
};
