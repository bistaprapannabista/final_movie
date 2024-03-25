import React, { Fragment } from 'react'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import { Card } from '../components'
import Spinner from '../components/Spinner'
import Table from '../components/Table'


const Recommend = () => {
    const [data, setData] = useState();
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState();

    const fetchOptions = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_BASE_URL + "movies-list");
            const result = await response.json();
            setOptions(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (movie) => {
        try {
            setLoading(true);
            const response = await fetch(process.env.REACT_APP_BASE_URL + "recommend" + `?name=${movie}`);
            const result = await response.json();
            setData(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const graphDistances = (data) => {
        const cosine_5_similar = data?.cosine?.map(item => ({ 'name': item.original_title, 'data': item.similarity })) || [];
        const euclidean_5_similar = data?.euclidean?.map(item => ({ 'name': item.original_title, 'data': item.similarity })) || [];
        return [cosine_5_similar, euclidean_5_similar];
    }


    const [graphData, setGraphData] = useState();
    console.log("data", graphData);


    useEffect(() => {
        fetchOptions();
        const final_data = graphDistances(data);
        setGraphData(final_data);
    }, [data])

    const handle_movie_recommend = (e) => {
        fetchData(e.value);
        setValue(e);
    }

    return (
        <main>
            <section className="max-w-7xl mx-auto py-7">
                {loading ?
                    <div className='flex justify-center'><Spinner /> </div> :
                    <>
                        <div className='react-select w-full'>
                            <Select options={options} onChange={handle_movie_recommend} value={value} />
                            {data && <h1 className='mt-3 text-3xl text-center text-slate-400 font-semibold'>Top 5 Recommend Movies</h1>}
                        </div>

                        {data &&
                            <>
                                <h1 className='mt-3 text-xl text-center text-slate-400 font-semibold'>
                                    Using Cosine Similarity
                                </h1>

                                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                                    {
                                        data?.cosine?.map((movie, index) =>
                                            <Card key={index} movie={movie} />
                                        )
                                    }
                                </div>
                            </>
                        }


                        {data && <><h1 className='mt-3 text-xl text-center text-slate-400 font-semibold'>
                            Using Euclidean Distance
                        </h1>
                            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                                {
                                    data?.euclidean?.map((movie, index) =>
                                        <Card key={index} movie={movie} />
                                    )
                                }
                            </div></>}

                        {
                            data && graphData &&
                            <>
                                <p className='mt-3 text-lg text-center text-slate-400 font-semibold'>Mathematical visulization of recommended movies</p>

                                <div className='flex justify-between gap-x-5'>
                                    <Table data={graphData[0]} name="Cosine Similarity" />
                                    <Table data={graphData[1]} name="Euclidean Distance" />
                                </div>
                            </>
                        }

                    </>
                }
            </section>
        </main>
    )
}

export default Recommend