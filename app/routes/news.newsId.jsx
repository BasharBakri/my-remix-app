export default function NewsCard({ data }) {
  const {
    datePublished,
    description,
    name,
    url,
    // image, // uncomment this if you have image data
  } = data;
  console.log('newsCard jsx10', name);

  return (
    <div className="news-card">
      <h3 className="text-2xl font-bold">{name}</h3>
      <p className="py-6">{description}</p>
      <a className="flex-1  text-blue-500 underline" href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
      <hr className="my-4" />
      <p>{new Date(datePublished).toLocaleDateString()}</p>
      <hr className="my-4" />
      {/* <img src={image} alt="News" />  */}
    </div>
  );
};