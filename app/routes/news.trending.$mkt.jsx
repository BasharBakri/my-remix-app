import { getTrendingNews } from "~/models/news/trendingnews.server";
import { defer } from "@remix-run/server-runtime";
import { Suspense } from "react";
import { Await, useLoaderData, useOutletContext, useNavigation, useParams } from "@remix-run/react";
import TrendingCard from "~/components/TrendingCard";




export async function loader({ params }) {
  try {
    const trendingNewsPromise = getTrendingNews(params.mkt);
    console.log('trending result');
    return defer({ trendingData: trendingNewsPromise });
  } catch (error) {
    throw error;
  }
}


export default function TrendingNews() {
  const params = useParams().mkt;
  const isSubmitting = useNavigation().state === 'submitting';
  const [bgColor, textColor] = useOutletContext();
  const loaderData = useLoaderData();


  const trendingGrid = (
    <Suspense fallback={<p>Loading trending News...</p>}>
      <Await
        resolve={loaderData?.trendingData}
        errorElement={<p>Error loading news search results!</p>}
      >
        {(newsData) =>

          newsData ? (
            newsData.map((newsItem) => {
              console.log('trending news Item', newsItem);
              const uniqueId = Math.random().toString(32).slice(2);
              return <TrendingCard key={uniqueId} data={newsItem} />;
            })
          ) : (
            <p>Loading search results...</p>
          )}
      </Await>
    </Suspense>
  );




  return (<>
    <p>Trending in: {params.slice(3)} </p>
    {isSubmitting ? <pre className={`${textColor} ${bgColor} mt-4`}>Loading results</pre> : trendingGrid}
  </>);
}