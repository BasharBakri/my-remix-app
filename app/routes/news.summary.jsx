

const Summary = (props) => {


  return (
    <div className='bg-gray-300 max-w-full overflow-x-hidden p-4'>
      <pre className='whitespace-pre-wrap text-sm'>{props.summary}</pre>
    </div>
  );
};

export default Summary;