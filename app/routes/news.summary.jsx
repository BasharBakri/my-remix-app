

const Summary = (props) => {


  return (
    <div className='bg-gray-50 h-fit  p-3 text-xs block flex-wrap'	>
      <pre>{props.summary}</pre>
    </div>
  );
};

export default Summary;