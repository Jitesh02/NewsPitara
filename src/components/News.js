import React, { useEffect, useState } from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner';
// import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {
    const [articles, setarticles] = useState([])
    const [loading, setloading] = useState(true)
    const [page, setpage] = useState(1)
    const [totalResults, settotalResults] = useState(0)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pagesize}`;
        setloading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(50);
        setarticles(parsedData.articles)
        settotalResults(parsedData.totalResults)
        setloading(false)

        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsPitara`;
        updateNews();
        //eslint-disable-next-line  
    }, [])



    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=3bd8c403a65645a7b6a27f18ebe31dbf&page=${page + 1}&pageSize=${props.pagesize}`;
        setpage(page + 1)
        let data = await fetch(url);
        let parsedData = await data.json();
        setarticles(articles.concat(parsedData.articles))
        settotalResults(parsedData.totalResults)
    };


    return (
        <>

            <h2 className="text-center" style={{ marginTop: "90px" }} >Top {capitalizeFirstLetter(props.category)} headlines</h2>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >

                <div className="container">

                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItems title={element.title ? element.title : ""} description={element.description ? element.description : " "} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                </div>

            </InfiniteScroll>

        </>
    )
}

News.defaultProps = {
    country: "in",
    pagesize: 8,
    category: "general"
}
// PropTypes = {
//     country: PropTypes.string,
//     pagesize: PropTypes.number,
//     category: PropTypes.string
// }

export default News