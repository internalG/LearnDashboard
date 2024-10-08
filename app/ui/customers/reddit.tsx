'use client';

// import React from 'react';
import useSWRInfinite from 'swr/infinite';

// import LoadingIndicator from './LoadingIndicator'
import InfiniteScroll from './infinitescroll';

// export default {
// 	title: 'InfiniteScroll/Reddit',
// 	component: InfiniteScroll,
// }

interface RedditPost {
  subreddit: string;
  author: string;
  title: string;
  thumbnail: string;
  permalink: string;
  url: string;
}

interface RedditPostObject {
  kind: 't3';
  data: RedditPost;
}

interface RedditDataResponse {
  after: string;
  children: RedditPostObject[];
}

const RedditPostCard: React.FC<{ post: RedditPost }> = ({ post }) => (
  <div
    style={{
      padding: '20px',
      borderRadius: '8px',
      margin: '20px auto',
      maxWidth: '400px',
      background: '#f8f8f8',
    }}
  >
    <div style={{ color: '#aaa' }}>
      {post.subreddit} • {post.author}
    </div>
    <div style={{ display: 'flex', marginTop: '8px' }}>
      {post.thumbnail?.startsWith('http') && (
        <img
          src={post.thumbnail}
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '4px',
            marginRight: '8px',
          }}
        />
      )}
      <div
        style={{
          flex: '1',
        }}
      >
        <a
          style={{
            display: 'block',
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
          }}
          href={post.url}
          target="_blank"
          rel="noreferrer"
        >
          {post.title}
        </a>
        <a
          style={{
            display: 'block',
            color: '#aaa',
            wordBreak: 'break-all',
          }}
          href={`https://reddit.com/${post.permalink}`}
          target="_blank"
          rel="noreferrer"
        >
          {post.permalink}
        </a>
      </div>
    </div>
  </div>
);

// export const Reddit = () => {
export default function CardList() {
  const swr = useSWRInfinite<RedditDataResponse>(
    (index, prev) =>
      prev
        ? `https://www.reddit.com/.json?limit=5&after=${prev.after}`
        : 'https://www.reddit.com/.json',
    {
      fetcher: async (key: string | URL | Request) =>
        fetch(key)
          .then((res) => res.json())
          .then((json) => json?.data),
    },
  );

  return (
    <InfiniteScroll
      swr={swr}
      // loadingIndicator={<LoadingIndicator style={{ margin: '30px auto' }} />}
      isReachingEnd={(swr: any) =>
        !swr.data?.[swr.data?.length - 1]?.after ?? false
      }
    >
      {(response: { children: { data: any }[] }) =>
        response?.children?.map(({ data }) => (
          <RedditPostCard post={data} key={data.permalink} />
        ))
      }
    </InfiniteScroll>
  );
}
