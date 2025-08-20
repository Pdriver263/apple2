// client/src/utils/quickTest.js
export const quickTest = async () => {
  console.log('🚀 Starting Quick Tests...');
  
  // Test API connection
  try {
    const response = await fetch('http://localhost:5000/api/listings/featured');
    console.log('✅ API Connection:', response.ok ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('❌ API Connection: FAILED', error);
  }

  // Test component imports
  try {
    const modules = await Promise.allSettled([
      import('../pages/Home'),
      import('../pages/auth/Login'),
      import('../components/common/Navbar')
    ]);
    
    modules.forEach((module, index) => {
      const names = ['Home', 'Login', 'Navbar'];
      console.log(`✅ ${names[index]} Component:`, module.status === 'fulfilled' ? 'LOADED' : 'FAILED');
    });
  } catch (error) {
    console.log('❌ Component Test: FAILED', error);
  }
};

// App.js এ যোগ করুন
// import { quickTest } from './utils/quickTest';
// useEffect(() => { quickTest(); }, []);