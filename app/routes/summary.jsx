



const MyComponent = (props) => {

  console.log(props.searchData);
  return (
    <div className="bg-gray-50 h-fit w-full p-3 text-center block	">
      <h1>Test component</h1>
      <p>Check the console for the API call results.</p>
    </div>
  );
};

export default MyComponent;