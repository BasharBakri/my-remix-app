
import { useEffect } from "react";
import { refineSearchTerm } from "~/models/ai/searchbot.server";

const MyComponent = () => {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await refineSearchTerm('someString');
        console.log('API call result:', result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      <h1>Test component</h1>
      <p>Check the console for the API call results.</p>
    </div>
  );
};

export default MyComponent;