const dataStore = {
    // Method to store or update data based on page
    async getPageData(pageKey, fetchData) {
        try {
            // Check if there's already data in localStorage
            const cachedData = JSON.parse(localStorage.getItem(pageKey));
            
            // If cached data exists, return it immediately
            if (cachedData) {
                // Start background update for fresh data
                this.update(pageKey, fetchData);
                return cachedData;
            }

            // No cached data: fetch fresh data immediately, store it, and return it
            const data = await fetchData();
            localStorage.setItem(pageKey, JSON.stringify(data));
            return data;

        } catch (error) {
            console.error('Error in getPageData:', error);
            return null;
        }
    },

    // Method to retrieve data from localStorage
    retrieve(pageKey) {
        try {
            const data = JSON.parse(localStorage.getItem(pageKey));
            return data || null; // Return cached data if available, otherwise null
        } catch (error) {
            console.error('Error retrieving data:', error);
            return null;
        }
    },

    // Method to update data in cache and localStorage in the background
    async update(pageKey, fetchData) {
        try {
            // Fetch new data in the background
            const data = await fetchData();
            if (data) {
                // Update localStorage with the fresh data
                localStorage.setItem(pageKey, JSON.stringify(data));
                return data;
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    },

    // Method to clear specific page data if needed
    clear(pageKey) {
        try {
            localStorage.removeItem(pageKey);
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    },

    // Clear all stored data (use with caution)
    clearAll() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing all data:', error);
        }
    }
};

export default dataStore;
