import { json } from "@remix-run/server-runtime";
import Loading from "~/components/Loader";
import { fetchCategory } from "~/models/news/category.server";
import { useLoaderData, useNavigation, useOutletContext, useParams } from "@remix-run/react";
import SearchCard from "~/components/searchCard";
import { defer } from "@remix-run/server-runtime";
import { Suspense } from "react";
import { Await } from "@remix-run/react";



export async function loader({ params }) {
  const market = "en-US";

  const category = params.cat;
  console.log(category, 'Category');

  try {
    const newsDataPromise = fetchCategory(category);

    return defer({ newsData: newsDataPromise, test: 'test' });
  } catch (error) {
    throw (error);
  }
}


export default function CategoryNews() {
  const isSubmitting = useNavigation().state === 'submitting';
  const [bgColor, textColor] = useOutletContext();
  const params = useParams().cat;


  const loaderData = useLoaderData();


  const newsGrid = (
    <Suspense fallback={<p>Loading news...</p>}>
      <Await
        resolve={loaderData?.newsData}
        errorElement={<p>Error loading news search results!</p>}
      >
        {(newsData) =>

          newsData ? (
            newsData.map((newsItem) => {
              const uniqueId = Math.random().toString(32).slice(2);
              return <SearchCard key={uniqueId} data={newsItem} />;
            })
          ) : (
            <p>Loading search results...</p>
          )}
      </Await>
    </Suspense>
  );


  console.log('Category Loader Data value', loaderData?.newsData);

  return (<>

    <p>Category: {params}</p>
    {isSubmitting ? <pre className={`${textColor} ${bgColor} mt-4`}>Loading results</pre> : newsGrid}
  </>);
}