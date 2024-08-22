'use client';

import React from 'react';
// import { useSWRInfinite } from 'swr';
import useSWRInfinite from 'swr/infinite';

// import LoadingIndicator from './LoadingIndicator';
// import InfiniteScroll from '.';
import InfiniteScroll from './infinitescroll';

// export default {
//   title: 'InfiniteScroll/GitHub',
//   component: InfiniteScroll,
// };

export default function GithubList() {
  // export const GitHub: React.FC = () => {
  const PAGE_SIZE = 5;

  const swr = useSWRInfinite(
    (index) =>
      `https://api.github.com/repos/reactjs/react-a11y/issues?per_page=${PAGE_SIZE}&page=${
        index + 1
      }`,
    {
      fetcher: async (key) => fetch(key).then((res) => res.json()),
    },
  );

  return (
    <InfiniteScroll
      swr={swr}
      // loadingIndicator={<LoadingIndicator style={{ margin: '30px auto' }} />}
      endingIndicator={
        <div style={{ margin: '30px auto', textAlign: 'center' }}>
          No more issues! 🎉
        </div>
      }
      isReachingEnd={(swr) =>
        swr.data?.[0]?.length === 0 ||
        swr.data?.[swr.data?.length - 1]?.length < PAGE_SIZE
      }
    >
      {(response) =>
        response?.map(
          (issue: {
            id: number;
            title: string;
            created_at: string;
            user: { login: string };
          }) => (
            <div
              key={issue.id}
              style={{
                padding: '20px',
                borderRadius: '8px',
                border: 'solid #ccc 1px',
                margin: '20px auto',
                maxWidth: '400px',
              }}
            >
              <div style={{ fontWeight: 700 }}>{issue.title}</div>
              <div style={{ color: '#aaa', marginTop: '8px' }}>
                {issue.user.login} • {new Date(issue.created_at).toDateString()}
              </div>
            </div>
          ),
        )
      }
    </InfiniteScroll>
  );
}
// GitHub.storyName = 'GitHub';
