const TrendingCard = ({ data }) => {
  const { name, isBreakingNews, query, newsSearchUrl } = data;

  return (
    <div className="mt-2">
      <h3 className="text-2xl font-bold">{name}</h3>
      {isBreakingNews && (
        <span className="text-red-600 text-sm font-semibold ml-2">Breaking News</span>
      )}
      <p className="py-6">{query.text}</p>
      <a href={newsSearchUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:text-blue-600">
        Read more
      </a>
      <hr className="my-4" />
    </div>
  );
};

export default TrendingCard;