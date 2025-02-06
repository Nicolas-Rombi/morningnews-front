import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideArticle, showAllArticles } from '../reducers/hiddenArticles';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks.value);
  const hiddenArticles = useSelector((state) => state.hiddenArticles.value);

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});

  useEffect(() => {
    fetch('https://morningnews-back-five.vercel.app/articles')
      .then(response => response.json())
      .then(data => {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.filter((_, i) => i > 0));
      });
  }, []);

  const handleHideArticle = (articleId) => {
    dispatch(hideArticle(articleId));
  };

  const handleShowAllArticles = () => {
    dispatch(showAllArticles());
  };

  const articles = articlesData
    .filter(article => !hiddenArticles.includes(article.id)) // Filtrer les articles masqués
    .map((data, i) => {
      const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
      return (
        <div key={i} className={styles.articleWrapper}>
          <Article {...data} isBookmarked={isBookmarked} />
          <FontAwesomeIcon 
            icon={faEyeSlash} 
            onClick={() => handleHideArticle(data.id)} 
            className={styles.hideIcon} 
          />
        </div>
      );
    });

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {topArticle && <TopArticle {...topArticle} />}
      <div className={styles.articlesContainer}>
        {articles}
      </div>
      <FontAwesomeIcon 
        icon={faEye} 
        onClick={handleShowAllArticles} 
        className={styles.showHiddenIcon} 
      />
    </div>
  );
}

export default Home;
