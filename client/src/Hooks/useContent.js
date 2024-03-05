import { useState } from 'react';
import useRequest from './useRequest';

function useContent() {
  const { data, loading, error, makeRequest } = useRequest();

  const getContent = (id) => {
    makeRequest({
      method: 'get',
      url: `/content/${id}`,
    });
  };

  const createContent = (content) => {
    makeRequest({
      method: 'post',
      url: '/content',
      data: content,
    });
  };

  const updateContent = (id, content) => {
    makeRequest({
      method: 'patch',
      url: `/content/${id}`,
      data: content,
    });
  };

  const deleteContent = (id) => {
    makeRequest({
      method: 'delete',
      url: `/content/${id}`,
    });
  };

  return {
    data,
    loading,
    error,
    getContent,
    createContent,
    updateContent,
    deleteContent,
  };
}

export default useContent;
