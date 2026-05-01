import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        analytics: resolve(__dirname, 'Analytics.html'),
        donor_dashboard: resolve(__dirname, 'Donor_Dashboard.html'),
        food_alerts: resolve(__dirname, 'Food_Alerts.html'),
        incoming_deliveries: resolve(__dirname, 'Incoming_Deliveries.html'),
        list_food: resolve(__dirname, 'List_Food.html'),
        login: resolve(__dirname, 'Login.html'),
        meal_forecast: resolve(__dirname, 'Meal_Forecast.html'),
        my_donations: resolve(__dirname, 'My_Donations.html'),
        ngo_dashboard: resolve(__dirname, 'NGO_Dashboard.html'),
        ngo_registration: resolve(__dirname, 'NGO_Registration.html'),
        registration: resolve(__dirname, 'Registration.html'),
        supermarket_registration: resolve(__dirname, 'Supermarket_Registration.html'),
        volunteer_fleet: resolve(__dirname, 'Volunteer_Fleet.html'),
        volunteer_registration: resolve(__dirname, 'Volunteer_Registration.html'),
        zone_dispatch: resolve(__dirname, 'Zone_Dispatch.html'),
      },
    },
  },
});
