import { Card } from "../components"
import { useFetch } from "../hooks/useFetch";
import { useTitle } from "../hooks/useTitle";
export const MovieList = ({ apiPath, title }) => {
  const { data: movies } = useFetch(apiPath);
  useTitle(title);
  return (
    <main>
      <section className="max-w-7xl mx-auto py-7">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {movies.map((movie) =>
            <Card key={movie.id} movie={movie} />
          )}

        </div>
      </section>
    </main>
  )
}